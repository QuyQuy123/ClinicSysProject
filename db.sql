-- Tạo cơ sở dữ liệu nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ClinicSysDB')
BEGIN
    CREATE DATABASE ClinicSysDB;
END
GO

-- Sử dụng cơ sở dữ liệu vừa tạo
USE ClinicSysDB;
GO

-- ===== BẢNG NHÓM 1: Các bảng không phụ thuộc (Cha) =====

-- Bảng Vai trò (Roles)
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Bảng Loại Dịch vụ (ServiceType)
CREATE TABLE ServiceType (
    ServiceTypeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(255) NOT NULL UNIQUE,
    Status NVARCHAR(50) NOT NULL
);
GO

-- Bảng Nhóm Thuốc (MedicineGroup)
CREATE TABLE MedicineGroup (
    MedicineGroupID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Status NVARCHAR(50) NOT NULL
);
GO

-- Bảng Phương thức Thanh toán (PaymentMethod)
CREATE TABLE PaymentMethod (
    PaymentMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName NVARCHAR(255) NOT NULL UNIQUE,
    Status NVARCHAR(50) NOT NULL
);
GO

-- Bảng Mã ICD-10 (ICD10Code)
CREATE TABLE ICD10Code (
    CodeID INT IDENTITY(1,1) PRIMARY KEY,
    Code VARCHAR(20) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NOT NULL
);
GO

-- Bảng Bệnh nhân (Patient)
CREATE TABLE Patient (
    PatientID INT IDENTITY(1,1) PRIMARY KEY,
    PatientCode VARCHAR(50) NOT NULL UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(50) NOT NULL,
    Address NVARCHAR(500),
    Phone VARCHAR(20) NOT NULL UNIQUE,
    Email VARCHAR(255) UNIQUE
);
GO

-- ===== BẢNG NHÓM 2: Phụ thuộc Nhóm 1 =====

-- Bảng Người dùng/Nhân viên (User)
CREATE TABLE [User] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(500) NOT NULL,
    RoleID INT NOT NULL,
    FullName NVARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Status NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);
GO

-- Bảng Dịch vụ (Service)
CREATE TABLE Service (
    ServiceID INT IDENTITY(1,1) PRIMARY KEY,
    ServiceCode VARCHAR(50) NOT NULL UNIQUE,
    ServiceTypeID INT NOT NULL,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Price DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_Service_ServiceType FOREIGN KEY (ServiceTypeID) REFERENCES ServiceType(ServiceTypeID)
);
GO

-- Bảng Thuốc (Medicine)
CREATE TABLE Medicine (
    MedicineID INT IDENTITY(1,1) PRIMARY KEY,
    MedicineCode VARCHAR(50) NOT NULL UNIQUE,
    MedicineGroupID INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Strength NVARCHAR(100),
    Price DECIMAL(18, 2) NOT NULL,
    Stock INT NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_Medicine_MedicineGroup FOREIGN KEY (MedicineGroupID) REFERENCES MedicineGroup(MedicineGroupID)
);
GO

-- ===== BẢNG NHÓM 3: Phụ thuộc Nhóm 1 & 2 =====

-- Bảng Lịch hẹn (Appointment)
CREATE TABLE Appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    DateTime DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    ReceptionistID INT NOT NULL,
    CONSTRAINT FK_Appointment_Patient FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorID) REFERENCES [User](UserID),
    CONSTRAINT FK_Appointment_Receptionist FOREIGN KEY (ReceptionistID) REFERENCES [User](UserID)
);
GO

-- Bảng Nhật ký Hệ thống (AuditLog)
CREATE TABLE AuditLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActionType NVARCHAR(100) NOT NULL,
    Timestamp DATETIME2 NOT NULL,
    Details NVARCHAR(MAX),
    UserID INT NOT NULL,
    EntityAffected VARCHAR(255),
    CONSTRAINT FK_AuditLog_User FOREIGN KEY (UserID) REFERENCES [User](UserID)
);
GO

-- ===== BẢNG NHÓM 4: Phụ thuộc Nhóm 3 =====

-- Bảng Thông báo (Notification)
CREATE TABLE Notification (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    AppointmentID INT NOT NULL,
    CONSTRAINT FK_Notification_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID)
);
GO

-- Bảng Hóa đơn (Bill)
CREATE TABLE Bill (
    BillID INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceCode VARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    PaymentStatus NVARCHAR(50) NOT NULL,
    AppointmentID INT NOT NULL UNIQUE, -- Ràng buộc 1-1
    PaymentMethodID INT,
    DateIssued DATETIME2 NOT NULL,
    DatePaid DATETIME2 NULL,
    CONSTRAINT FK_Bill_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    CONSTRAINT FK_Bill_PaymentMethod FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethod(PaymentMethodID)
);
GO

-- Bảng Bệnh án/Phiếu khám (MedicalRecord)
CREATE TABLE MedicalRecord (
    RecordID INT IDENTITY(1,1) PRIMARY KEY,
    Vitals NVARCHAR(500),
    Symptoms NVARCHAR(MAX),
    Notes NVARCHAR(MAX),
    AppointmentID INT NOT NULL UNIQUE, -- Ràng buộc 1-1
    CreatedBy INT NOT NULL,
    ModifiedBy INT,
    CONSTRAINT FK_MedicalRecord_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    CONSTRAINT FK_MedicalRecord_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [User](UserID),
    CONSTRAINT FK_MedicalRecord_ModifiedBy FOREIGN KEY (ModifiedBy) REFERENCES [User](UserID)
);
GO

-- Bảng Nối Dịch vụ - Lịch hẹn (Appointment_Service)
CREATE TABLE Appointment_Service (
    AppointmentServiceID INT IDENTITY(1,1) PRIMARY KEY,
    AppointmentID INT NOT NULL,
    ServiceID INT NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT FK_AppSvc_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    CONSTRAINT FK_AppSvc_Service FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID)
);
GO

-- ===== BẢNG NHÓM 5: Phụ thuộc Nhóm 4 =====

-- Bảng Chẩn đoán (Diagnosis)
CREATE TABLE Diagnosis (
    DiagnosisID INT IDENTITY(1,1) PRIMARY KEY,
    Description NVARCHAR(MAX),
    Date DATETIME2 NOT NULL,
    RecordID INT NOT NULL,
    ICD10CodeID INT NOT NULL,
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_Diagnosis_MedicalRecord FOREIGN KEY (RecordID) REFERENCES MedicalRecord(RecordID),
    CONSTRAINT FK_Diagnosis_ICD10Code FOREIGN KEY (ICD10CodeID) REFERENCES ICD10Code(CodeID),
    CONSTRAINT FK_Diagnosis_User FOREIGN KEY (CreatedBy) REFERENCES [User](UserID)
);
GO

-- Bảng Đơn thuốc (Prescription)
CREATE TABLE Prescription (
    PrescriptionID INT IDENTITY(1,1) PRIMARY KEY,
    PrescriptionCode VARCHAR(50) NOT NULL UNIQUE,
    Date DATETIME2 NOT NULL,
    Notes NVARCHAR(MAX),
    AIAlerts NVARCHAR(MAX),
    RecordID INT NOT NULL,
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_Prescription_MedicalRecord FOREIGN KEY (RecordID) REFERENCES MedicalRecord(RecordID),
    CONSTRAINT FK_Prescription_User FOREIGN KEY (CreatedBy) REFERENCES [User](UserID)
);
GO

-- ===== BẢNG NHÓM 6: Phụ thuộc Nhóm 5 =====

-- Bảng Nối Đơn thuốc - Thuốc (Prescription_Medicine)
CREATE TABLE Prescription_Medicine (
    Prescription_MedicineID INT IDENTITY(1,1) PRIMARY KEY,
    PrescriptionID INT NOT NULL,
    MedicineID INT NOT NULL,
    Quantity INT NOT NULL,
    Note NVARCHAR(MAX),
    CONSTRAINT FK_PrescMed_Prescription FOREIGN KEY (PrescriptionID) REFERENCES Prescription(PrescriptionID),
    CONSTRAINT FK_PrescMed_Medicine FOREIGN KEY (MedicineID) REFERENCES Medicine(MedicineID)
);
GO



--insert data 



-- Sử dụng cơ sở dữ liệu
USE ClinicSysDB;
GO

-- ===== BẢNG NHÓM 1: Các bảng không phụ thuộc (Cha) =====

-- Bảng Vai trò (Roles)
PRINT 'Inserting data into Roles...';
-- ===== BẢNG NHÓM 1: Các bảng không phụ thuộc (Cha) =====

-- Bảng Vai trò (Roles)
PRINT 'Inserting data into Roles...';
INSERT INTO Roles (RoleName)
VALUES
(N'Quản trị viên'), -- RoleID = 1
(N'Bác sĩ'),       -- RoleID = 2
(N'Lễ tân');        -- RoleID = 3
GO

-- Bảng Loại Dịch vụ (ServiceType)
PRINT 'Inserting data into ServiceType...';
INSERT INTO ServiceType (TypeName, Status)
VALUES
(N'Khám lâm sàng', N'Hoạt động'),
(N'Xét nghiệm', N'Hoạt động'),
(N'Chẩn đoán hình ảnh', N'Hoạt động'),
(N'Thủ thuật', N'Hoạt động'),
(N'Tư vấn', N'Ngừng hoạt động');
GO

-- Bảng Nhóm Thuốc (MedicineGroup)
PRINT 'Inserting data into MedicineGroup...';
INSERT INTO MedicineGroup (Name, Status)
VALUES
(N'Kháng sinh', N'Hoạt động'),
(N'Giảm đau, hạ sốt', N'Hoạt động'),
(N'Vitamin và khoáng chất', N'Hoạt động'),
(N'Thuốc tim mạch', N'Hoạt động'),
(N'Thuốc tiêu hóa', N'Hoạt động');
GO

-- Bảng Phương thức Thanh toán (PaymentMethod)
PRINT 'Inserting data into PaymentMethod...';
INSERT INTO PaymentMethod (MethodName, Status)
VALUES
(N'Tiền mặt', N'Hoạt động'),
(N'Chuyển khoản', N'Hoạt động'),
(N'Thẻ tín dụng (Credit Card)', N'Hoạt động'),
(N'Ví điện tử MoMo', N'Hoạt động'),
(N'Bảo hiểm y tế', N'Ngừng hoạt động');
GO

-- Bảng Mã ICD-10 (ICD10Code)
PRINT 'Inserting data into ICD10Code...';
INSERT INTO ICD10Code (Code, Description)
VALUES
('J00', N'Viêm mũi họng cấp (cảm thông thường)'),
('I10', N'Tăng huyết áp nguyên phát (vô căn)'),
('R51', N'Đau đầu'),
('K29.7', N'Viêm dạ dày, không đặc hiệu'),
('M54.5', N'Đau thắt lưng');
GO

-- Bảng Bệnh nhân (Patient)
PRINT 'Inserting data into Patient...';
INSERT INTO Patient (PatientCode, FullName, DateOfBirth, Gender, Address, Phone, Email)
VALUES
('BN001', N'Nguyễn Văn An', '1990-01-15', N'Nam', N'123 Đường Láng, Hà Nội', '0912345671', 'an.nv@email.com'),
('BN002', N'Trần Thị Bình', '1985-05-20', N'Nữ', N'456 Hai Bà Trưng, TPHCM', '0912345672', 'binh.tt@email.com'),
('BN003', N'Lê Văn Cường', '2001-11-30', N'Nam', N'789 Nguyễn Văn Linh, Đà Nẵng', '0912345673', 'cuong.lv@email.com'),
('BN004', N'Phạm Thị Dung', '1995-02-10', N'Nữ', N'101 Lê Lợi, Hải Phòng', '0912345674', 'dung.pt@email.com'),
('BN005', N'Hoàng Văn Em', '1978-07-07', N'Nam', N'202 Trần Phú, Cần Thơ', '0912345675', 'em.hv@email.com');
GO

-- ===== BẢNG NHÓM 2: Phụ thuộc Nhóm 1 =====

-- Bảng Người dùng/Nhân viên (User)
-- (RoleID: 1=Admin, 2=Bác sĩ, 3=Lễ tân)
PRINT 'Inserting data into [User]...';
INSERT INTO [User] (Username, PasswordHash, RoleID, FullName, Email, Status)
VALUES
('admin', 'admin123', 1, N'Trần Quản Trị', 'admin@clinicsys.com', N'Hoạt động'),
('bacsi.khoa', 'pass123', 2, N'Bác sĩ Lê Minh Khoa', 'bacsi.khoa@clinicsys.com', N'Hoạt động'),
('letan.van', 'pass123', 3, N'Lễ tân Nguyễn Thị Vân', 'letan.van@clinicsys.com', N'Hoạt động'),
('bacsi.linh', 'pass123', 2, N'Bác sĩ Trần Thùy Linh', 'bacsi.linh@clinicsys.com', N'Hoạt động'),
('letan.tuan', 'pass123', 3, N'Lễ tân Phạm Tuấn', 'letan.tuan@clinicsys.com', N'Ngừng hoạt động');
GO

-- Bảng Dịch vụ (Service)
-- (ServiceTypeID: 1=Khám, 2=Xét nghiệm, 3=CĐHA)
PRINT 'Inserting data into Service...';
INSERT INTO Service (ServiceCode, ServiceTypeID, Name, Price, Status)
VALUES
('KLS001', 1, N'Khám tổng quát', 150000.00, N'Hoạt động'),
('KCK001', 1, N'Khám chuyên khoa (Tim mạch)', 250000.00, N'Hoạt động'),
('XN001', 2, N'Xét nghiệm máu (Công thức máu)', 100000.00, N'Hoạt động'),
('CDHA001', 3, N'Siêu âm ổ bụng', 200000.00, N'Hoạt động'),
('TT001', 4, N'Nội soi dạ dày', 1200000.00, N'Ngừng hoạt động');
GO

-- Bảng Thuốc (Medicine)
-- (MedicineGroupID: 1=Kháng sinh, 2=Giảm đau, 3=Vitamin, 4=Tim mạch, 5=Tiêu hóa)
PRINT 'Inserting data into Medicine...';
INSERT INTO Medicine (MedicineCode, MedicineGroupID, Name, Strength, Price, Stock, Status)
VALUES
('AMOXI500', 1, N'Amoxicillin', N'500mg', 1500.00, 500, N'Hoạt động'),
('PARA500', 2, N'Paracetamol', N'500mg', 1000.00, 1000, N'Hoạt động'),
('AMLOR5', 4, N'Amlodipin', N'5mg', 3000.00, 300, N'Hoạt động'),
('VITC1000', 3, N'Vitamin C', N'1000mg', 3000.00, 800, N'Hoạt động'),
('OMEP20', 5, N'Omeprazole', N'20mg', 5000.00, 150, N'Hoạt động');
GO

-- ===== BẢNG NHÓM 3: Phụ thuộc Nhóm 1 & 2 =====

-- Bảng Lịch hẹn (Appointment)
-- (PatientID: 1-5)
-- (DoctorID: 2, 4)
-- (ReceptionistID: 3, 5)
PRINT 'Inserting data into Appointment...';
INSERT INTO Appointment (DateTime, Status, PatientID, DoctorID, ReceptionistID)
VALUES
('2025-11-10 09:00:00', N'Đã hoàn thành', 1, 2, 3),
('2025-11-10 10:00:00', N'Đã hoàn thành', 2, 4, 5),
('2025-11-11 09:30:00', N'Đã hoàn thành', 3, 2, 3),
('2025-11-11 11:00:00', N'Đã hoàn thành', 4, 4, 5),
('2025-11-12 14:00:00', N'Đã hoàn thành', 5, 2, 3);
GO

-- Bảng Nhật ký Hệ thống (AuditLog)
-- (UserID: 1-5)
PRINT 'Inserting data into AuditLog...';
INSERT INTO AuditLog (ActionType, Timestamp, Details, UserID, EntityAffected)
VALUES
(N'Đăng nhập', '2025-11-10 08:00:00', N'User admin đăng nhập', 1, N'User'),
(N'Tạo mới', '2025-11-10 08:30:00', N'User letan.van tạo Lịch hẹn 1', 3, N'Appointment'),
(N'Cập nhật', '2025-11-10 09:15:00', N'User bacsi.khoa cập nhật Bệnh án 1', 2, N'MedicalRecord'),
(N'Đăng nhập', '2025-11-10 09:30:00', N'User bacsi.linh đăng nhập', 4, N'User'),
(N'Xóa', '2025-11-10 09:45:00', N'User admin xóa UserID 5 (letan.tuan)', 1, N'User');
GO

-- ===== BẢNG NHÓM 4: Phụ thuộc Nhóm 3 =====

-- Bảng Thông báo (Notification)
-- (AppointmentID: 1-5)
PRINT 'Inserting data into Notification...';
INSERT INTO Notification (Type, Status, AppointmentID)
VALUES
(N'Nhắc hẹn', N'Đã gửi', 1),
(N'Xác nhận lịch', N'Đã gửi', 2),
(N'Nhắc hẹn', N'Đã gửi', 3),
(N'Xác nhận lịch', N'Đã gửi', 4),
(N'Nhắc hẹn', N'Đã gửi', 5);
GO

-- Bảng Hóa đơn (Bill)
-- (AppointmentID: 1-5, UNIQUE)
-- (PaymentMethodID: 1-4)
PRINT 'Inserting data into Bill...';
INSERT INTO Bill (InvoiceCode, TotalAmount, PaymentStatus, AppointmentID, PaymentMethodID, DateIssued, DatePaid)
VALUES
('HD001', 250000.00, N'Đã thanh toán', 1, 1, '2025-11-10 09:30:00', '2025-11-10 09:35:00'),
('HD002', 450000.00, N'Đã thanh toán', 2, 2, '2025-11-10 10:30:00', '2025-11-10 10:32:00'),
('HD003', 150000.00, N'Đã thanh toán', 3, 1, '2025-11-11 10:00:00', '2025-11-11 10:01:00'),
('HD004', 200000.00, N'Đã thanh toán', 4, 3, '2025-11-11 11:30:00', '2025-11-11 11:31:00'),
('HD005', 150000.00, N'Đã thanh toán', 5, 2, '2025-11-12 14:30:00', '2025-11-12 14:35:00');
GO

-- Bảng Bệnh án/Phiếu khám (MedicalRecord)
-- (AppointmentID: 1-5, UNIQUE)
-- (CreatedBy/ModifiedBy: 2, 4 - Bác sĩ)
PRINT 'Inserting data into MedicalRecord...';
INSERT INTO MedicalRecord (Vitals, Symptoms, Notes, AppointmentID, CreatedBy, ModifiedBy)
VALUES
(N'Huyết áp 120/80, Mạch 75, Sốt 37.5C', N'Ho, Sổ mũi, Đau họng', N'Nghỉ ngơi, uống nhiều nước ấm.', 1, 2, NULL),
(N'Huyết áp 140/90, Mạch 80', N'Đau ngực nhẹ, khó thở khi gắng sức', N'Cần làm XN tim mạch, theo dõi huyết áp.', 2, 4, 4),
(N'Huyết áp 110/70, Mạch 70', N'Đau đầu, mệt mỏi', N'Nghi ngờ đau đầu do căng thẳng.', 3, 2, NULL),
(N'Huyết áp 120/80, Mạch 75', N'Đau bụng vùng thượng vị, ợ hơi', N'Nội soi dạ dày được chỉ định.', 4, 4, NULL),
(N'Huyết áp 130/85, Mạch 82', N'Đau lưng khi cúi', N'Chườm nóng, tập vật lý trị liệu.', 5, 2, 2);
GO

-- Bảng Nối Dịch vụ - Lịch hẹn (Appointment_Service)
-- (AppointmentID: 1-5)
-- (ServiceID: 1-4)
PRINT 'Inserting data into Appointment_Service...';
INSERT INTO Appointment_Service (AppointmentID, ServiceID, Quantity)
VALUES
(1, 1, 1), -- Hẹn 1, Khám tổng quát
(1, 3, 1), -- Hẹn 1, Xét nghiệm máu
(2, 2, 1), -- Hẹn 2, Khám tim mạch
(2, 4, 1), -- Hẹn 2, Siêu âm
(3, 1, 1); -- Hẹn 3, Khám tổng quát
GO

-- ===== BẢNG NHÓM 5: Phụ thuộc Nhóm 4 =====

-- Bảng Chẩn đoán (Diagnosis)
-- (RecordID: 1-5)
-- (ICD10CodeID: 1-5)
-- (CreatedBy: 2, 4 - Bác sĩ)
PRINT 'Inserting data into Diagnosis...';
INSERT INTO Diagnosis (Description, Date, RecordID, ICD10CodeID, CreatedBy)
VALUES
(N'Chẩn đoán xác định Viêm mũi họng cấp', '2025-11-10 09:15:00', 1, 1, 2),
(N'Theo dõi Tăng huyết áp', '2025-11-10 10:15:00', 2, 2, 4),
(N'Đau đầu do căng thẳng', '2025-11-11 09:45:00', 3, 3, 2),
(N'Theo dõi Viêm dạ dày', '2025-11-11 11:15:00', 4, 4, 4),
(N'Đau thắt lưng cơ năng', '2025-11-12 14:15:00', 5, 5, 2);
GO

-- Bảng Đơn thuốc (Prescription)
-- (RecordID: 1-5)
-- (CreatedBy: 2, 4 - Bác sĩ)
PRINT 'Inserting data into Prescription...';
INSERT INTO Prescription (PrescriptionCode, Date, Notes, AIAlerts, RecordID, CreatedBy)
VALUES
('DT001', '2025-11-10 09:20:00', N'Uống sau ăn no', NULL, 1, 2),
('DT002', '2025-11-10 10:20:00', N'Uống 1v/ngày vào buổi sáng', N'Cảnh báo: Tương tác thuốc nhẹ với Aspirin', 2, 4),
('DT003', '2025-11-11 09:50:00', N'Uống khi đau, không quá 4v/ngày', NULL, 3, 2),
('DT004', '2025-11-11 11:20:00', N'Uống trước ăn 30 phút', NULL, 4, 4),
('DT005', '2025-11-12 14:20:00', N'Chỉ uống khi đau nhiều', NULL, 5, 2);
GO

-- ===== BẢNG NHÓM 6: Phụ thuộc Nhóm 5 =====

-- Bảng Nối Đơn thuốc - Thuốc (Prescription_Medicine)
-- (PrescriptionID: 1-5)
-- (MedicineID: 1-5)
PRINT 'Inserting data into Prescription_Medicine...';
INSERT INTO Prescription_Medicine (PrescriptionID, MedicineID, Quantity, Note)
VALUES
(1, 2, 10, N'Uống 1v khi sốt > 38.5 độ'), -- Đơn 1, Paracetamol
(1, 4, 5, N'Uống 1v/ngày sau ăn sáng'), -- Đơn 1, Vitamin C
(2, 3, 30, N'Uống 1v/ngày vào 8h sáng'), -- Đơn 2, Amlodipin
(3, 2, 10, N'Uống 1v khi đau'), -- Đơn 3, Paracetamol
(4, 5, 14, N'Uống 1v/ngày trước ăn sáng 30p'); -- Đơn 4, Omeprazole
GO

PRINT 'All data inserted successfully!';