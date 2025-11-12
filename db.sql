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
    Status VARCHAR(50) NOT NULL
);
GO

-- Bảng Nhóm Thuốc (MedicineGroup)
CREATE TABLE MedicineGroup (
    MedicineGroupID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Status VARCHAR(50) NOT NULL
);
GO

-- Bảng Phương thức Thanh toán (PaymentMethod)
CREATE TABLE PaymentMethod (
    PaymentMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName NVARCHAR(255) NOT NULL UNIQUE,
    Status VARCHAR(50) NOT NULL
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
    Status VARCHAR(50) NOT NULL,
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
    Status VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Service_ServiceType FOREIGN KEY (ServiceTypeID) REFERENCES ServiceType(ServiceTypeID)
);
GO

-- Bảng Thuốc (Medicine)
-- *** ĐÃ BỔ SUNG CỘT 'Unit' THEO YÊU CẦU CỦA BẠN ***
CREATE TABLE Medicine (
    MedicineID INT IDENTITY(1,1) PRIMARY KEY,
    MedicineCode VARCHAR(50) NOT NULL UNIQUE,
    MedicineGroupID INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Strength NVARCHAR(100),
    Unit NVARCHAR(50), -- <<< CỘT MỚI ĐÃ ĐƯỢC THÊM VÀO ĐỊNH NGHĨA
    Price DECIMAL(18, 2) NOT NULL,
    Stock INT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Medicine_MedicineGroup FOREIGN KEY (MedicineGroupID) REFERENCES MedicineGroup(MedicineGroupID)
);
GO

-- ===== BẢNG NHÓM 3: Phụ thuộc Nhóm 1 & 2 =====

-- Bảng Lịch hẹn (Appointment)
CREATE TABLE Appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    DateTime DATETIME2 NOT NULL,
    Status VARCHAR(50) NOT NULL,
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
    Status VARCHAR(50) NOT NULL,
    AppointmentID INT NOT NULL,
    CONSTRAINT FK_Notification_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID)
);
GO

-- Bảng Hóa đơn (Bill)
CREATE TABLE Bill (
    BillID INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceCode VARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL,
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

-- ===================================
-- ===== INSERT DỮ LIỆU (MASTER DATA) =====
-- ===================================

USE ClinicSysDB;
GO

-- Bảng Vai trò (Roles)
PRINT 'Inserting data into Roles...';
INSERT INTO Roles (RoleName)
VALUES
(N'Admin'), -- RoleID = 1
(N'Doctor'),     -- RoleID = 2
(N'Receptionist');      -- RoleID = 3
GO

-- Bảng Loại Dịch vụ (ServiceType)
PRINT 'Inserting data into ServiceType...';
INSERT INTO ServiceType (TypeName, Status)
VALUES
(N'Clinical Examination', 'Active'),
(N'Laboratory Test', 'Active'),
(N'Diagnostic Imaging', 'Active'),
(N'Procedure', 'Active'),
(N'Consultation', 'Inactive');
GO

-- Bảng Nhóm Thuốc (MedicineGroup)
PRINT 'Inserting data into MedicineGroup...';
INSERT INTO MedicineGroup (Name, Status)
VALUES
(N'Antibiotics', 'Active'),
(N'Analgesics, Antipyretics', 'Active'),
(N'Vitamins and Minerals', 'Active'),
(N'Cardiovascular Drugs', 'Active'),
(N'Digestive Drugs', 'Active');
GO

-- Bảng Phương thức Thanh toán (PaymentMethod)
PRINT 'Inserting data into PaymentMethod...';
INSERT INTO PaymentMethod (MethodName, Status)
VALUES
('Cash', 'Active'),
('Bank Transfer', 'Active'),
('Credit Card', 'Active'),
('MoMo E-Wallet', 'Active'),
('Health Insurance', 'Inactive');
GO

-- Bảng Mã ICD-10 (ICD10Code)
PRINT 'Inserting data into ICD10Code...';
INSERT INTO ICD10Code (Code, Description)
VALUES
('J00', N'Acute nasopharyngitis (common cold)'),
('I10', N'Essential (primary) hypertension'),
('R51', N'Headache'),
('K29.7', N'Gastritis, unspecified'),
('M54.5', N'Low back pain');
GO

-- Bảng Người dùng/Nhân viên (User)
PRINT 'Inserting data into [User]...';
INSERT INTO [User] (Username, PasswordHash, RoleID, FullName, Email, Status)
VALUES
('admin', 'admin123', 1, N'Trần Quản Trị', 'admin@clinicsys.com', 'Active'),
('bacsi.khoa', 'pass123', 2, N'Bác sĩ Lê Minh Khoa', 'bacsi.khoa@clinicsys.com', 'Active'),
('letan.van', 'pass123', 3, N'Lễ tân Nguyễn Thị Vân', 'letan.van@clinicsys.com', 'Active'),
('bacsi.linh', 'pass123', 2, N'Bác sĩ Trần Thùy Linh', 'bacsi.linh@clinicsys.com', 'Active'),
('letan.tuan', 'pass123', 3, N'Lễ tân Phạm Tuấn', 'letan.tuan@clinicsys.com', 'Inactive');
GO

-- Bảng Dịch vụ (Service)
PRINT 'Inserting data into Service...';
INSERT INTO Service (ServiceCode, ServiceTypeID, Name, Price, Status)
VALUES
('KLS001', 1, N'General Examination', 150000.00, 'Active'),
('KCK001', 1, N'Specialist Examination (Cardiology)', 250000.00, 'Active'),
('XN001', 2, N'Blood Test (CBC)', 100000.00, 'Active'),
('CDHA001', 3, N'Abdominal Ultrasound', 200000.00, 'Active'),
('TT001', 4, N'Gastroscopy', 1200000.00, 'Inactive');
GO

-- Bảng Thuốc (Medicine)
-- *** ĐÃ BỔ SUNG GIÁ TRỊ CHO CỘT 'Unit' ***
PRINT 'Inserting data into Medicine...';
INSERT INTO Medicine (MedicineCode, MedicineGroupID, Name, Strength, Unit, Price, Stock, Status)
VALUES
('AMOXI500', 1, N'Amoxicillin', N'500mg', N'Viên', 1500.00, 500, 'Active'),
('PARA500', 2, N'Paracetamol', N'500mg', N'Viên', 1000.00, 1000, 'Active'),
('AMLOR5', 4, N'Amlodipine', N'5mg', N'Viên', 3000.00, 300, 'Active'),
('VITC1000', 3, N'Vitamin C', N'1000mg', N'Viên sủi', 3000.00, 800, 'Active'),
('OMEP20', 5, N'Omeprazole', N'20mg', N'Viên', 5000.00, 150, 'Active');
GO

-- ==========================================================
-- ===== INSERT DỮ LIỆU GỐC (5 BỆNH NHÂN ĐẦU TIÊN) =====
-- ==========================================================
PRINT 'Inserting original 5 patients (ID 1-5)...';
INSERT INTO Patient (PatientCode, FullName, DateOfBirth, Gender, Address, Phone, Email)
VALUES
('BN001', N'Nguyen Van An', '1990-01-15', N'Nam', N'123 Duong Lang, Ha Noi', '0912345671', 'an.nv@email.com'),
('BN002', N'Tran Thi Binh', '1985-05-20', N'Nữ', N'456 Hai Ba Trung, TPHCM', '0912345672', 'binh.tt@email.com'),
('BN003', N'Le Van Cuong', '2001-11-30', N'Nam', N'789 Nguyen Van Linh, Da Nang', '0912345673', 'cuong.lv@email.com'),
('BN004', N'Pham Thi Dung', '1995-02-10', N'Nữ', N'101 Le Loi, Hai Phong', '0912345674', 'dung.pt@email.com'),
('BN005', N'Hoang Van Em', '1978-07-07', N'Nam', N'202 Tran Phu, Can Tho', '0912345675', 'em.hv@email.com');
GO

-- Bảng Lịch hẹn (Appointment) - Dữ liệu gốc
PRINT 'Inserting original 5 appointments (ID 1-5)...';
INSERT INTO Appointment (DateTime, Status, PatientID, DoctorID, ReceptionistID)
VALUES
('2025-11-10 09:00:00', 'Completed', 1, 2, 3),
('2025-11-10 10:00:00', 'Completed', 2, 4, 3), -- Sửa 5 thành 3 (letan.tuan inactive)
('2025-11-11 09:30:00', 'Completed', 3, 2, 3),
('2025-11-11 11:00:00', 'Completed', 4, 4, 3), -- Sửa 5 thành 3
('2025-11-12 14:00:00', 'Completed', 5, 2, 3);
GO

-- Bảng Nhật ký Hệ thống (AuditLog)
PRINT 'Inserting data into AuditLog...';
INSERT INTO AuditLog (ActionType, Timestamp, Details, UserID, EntityAffected)
VALUES
(N'Login', '2025-11-10 08:00:00', N'User admin logged in', 1, N'User'),
(N'Create', '2025-11-10 08:30:00', N'User letan.van created Appointment 1', 3, N'Appointment'),
(N'Update', '2025-11-10 09:15:00', N'User bacsi.khoa updated Medical Record 1', 2, N'MedicalRecord'),
(N'Login', '2025-11-10 09:30:00', N'User bacsi.linh logged in', 4, N'User'),
(N'Delete', '2025-11-10 09:45:00', N'User admin deleted UserID 5 (letan.tuan)', 1, N'User');
GO

-- Bảng Thông báo (Notification)
PRINT 'Inserting data into Notification...';
INSERT INTO Notification (Type, Status, AppointmentID)
VALUES
(N'Reminder', 'Sent', 1),
(N'Confirmation', 'Sent', 2),
(N'Reminder', 'Sent', 3),
(N'Confirmation', 'Sent', 4),
(N'Reminder', 'Sent', 5);
GO

-- Bảng Hóa đơn (Bill)
PRINT 'Inserting data into Bill...';
INSERT INTO Bill (InvoiceCode, TotalAmount, PaymentStatus, AppointmentID, PaymentMethodID, DateIssued, DatePaid)
VALUES
('HD001', 250000.00, 'Paid', 1, 1, '2025-11-10 09:30:00', '2025-11-10 09:35:00'),
('HD002', 450000.00, 'Paid', 2, 2, '2025-11-10 10:30:00', '2025-11-10 10:32:00'),
('HD003', 150000.00, 'Paid', 3, 1, '2025-11-11 10:00:00', '2025-11-11 10:01:00'),
('HD004', 200000.00, 'Paid', 4, 3, '2025-11-11 11:30:00', '2025-11-11 11:31:00'),
('HD005', 150000.00, 'Paid', 5, 2, '2025-11-12 14:30:00', '2025-11-12 14:35:00');
GO

-- Bảng Bệnh án/Phiếu khám (MedicalRecord)
PRINT 'Inserting data into MedicalRecord...';
INSERT INTO MedicalRecord (Vitals, Symptoms, Notes, AppointmentID, CreatedBy, ModifiedBy)
VALUES
(N'BP 120/80, Pulse 75, Temp 37.5C', N'Cough, Runny nose, Sore throat', N'Rest, drink warm water.', 1, 2, NULL),
(N'BP 140/90, Pulse 80', N'Mild chest pain, dyspnea on exertion', N'Need cardiac tests, monitor BP.', 2, 4, 4),
(N'BP 110/70, Pulse 70', N'Headache, fatigue', N'Suspected tension headache.', 3, 2, NULL),
(N'BP 120/80, Pulse 75', N'Epigastric pain, bloating', N'Gastroscopy indicated.', 4, 4, NULL),
(N'BP 130/85, Pulse 82', N'Back pain on bending', N'Warm compress, physical therapy.', 5, 2, 2);
GO

-- Bảng Nối Dịch vụ - Lịch hẹn (Appointment_Service)
PRINT 'Inserting data into Appointment_Service...';
INSERT INTO Appointment_Service (AppointmentID, ServiceID, Quantity)
VALUES
(1, 1, 1), -- Appt 1, General Exam
(1, 3, 1), -- Appt 1, Blood Test
(2, 2, 1), -- Appt 2, Cardio Exam
(2, 4, 1), -- Appt 2, Ultrasound
(3, 1, 1); -- Appt 3, General Exam
GO

-- Bảng Chẩn đoán (Diagnosis)
PRINT 'Inserting data into Diagnosis...';
INSERT INTO Diagnosis (Description, Date, RecordID, ICD10CodeID, CreatedBy)
VALUES
(N'Confirmed Acute Nasopharyngitis', '2025-11-10 09:15:00', 1, 1, 2),
(N'Monitor Hypertension', '2025-11-10 10:15:00', 2, 2, 4),
(N'Tension Headache', '2025-11-11 09:45:00', 3, 3, 2),
(N'Monitor Gastritis', '2025-11-11 11:15:00', 4, 4, 4),
(N'Functional Low Back Pain', '2025-11-12 14:15:00', 5, 5, 2);
GO

-- Bảng Đơn thuốc (Prescription)
PRINT 'Inserting data into Prescription...';
INSERT INTO Prescription (PrescriptionCode, Date, Notes, AIAlerts, RecordID, CreatedBy)
VALUES
('DT001', '2025-11-10 09:20:00', N'Take after meals', NULL, 1, 2),
('DT002', '2025-11-10 10:20:00', N'Take 1 pill/day in the morning', N'Alert: Mild interaction with Aspirin', 2, 4),
('DT003', '2025-11-11 09:50:00', N'Take when in pain, max 4/day', NULL, 3, 2),
('DT004', '2025-11-11 11:20:00', N'Take 30 mins before breakfast', NULL, 4, 4),
('DT005', '2025-11-12 14:20:00', N'Only take if pain is severe', NULL, 5, 2);
GO

-- Bảng Nối Đơn thuốc - Thuốc (Prescription_Medicine)
PRINT 'Inserting data into Prescription_Medicine...';
INSERT INTO Prescription_Medicine (PrescriptionID, MedicineID, Quantity, Note)
VALUES
(1, 2, 10, N'Take 1 pill if fever > 38.5C'), -- P1, Paracetamol
(1, 4, 5, N'Take 1 pill/day after breakfast'), -- P1, Vitamin C
(2, 3, 30, N'Take 1 pill/day at 8 AM'), -- P2, Amlodipine
(3, 2, 10, N'Take 1 pill when in pain'), -- P3, Paracetamol
(4, 5, 14, N'Take 1 pill/day 30min before breakfast'); -- P4, Omeprazole
GO


-- ==========================================================
-- ===== INSERT DỮ LIỆU MỚI (20 BỆNH NHÂN VÀ 20 LỊCH HẸN MỚI) =====
-- ==========================================================
PRINT 'Inserting 20 new patients (ID 6 to 25)...';
GO
INSERT INTO Patient (PatientCode, FullName, DateOfBirth, Gender, Address, Phone, Email)
VALUES
-- 10 Bệnh nhân cho Bác sĩ Khoa (ID 6-15)
('BN006', N'Trần Minh Tuấn', '1988-05-10', N'Nam', N'11 Lý Thường Kiệt, Hà Nội', '0987654321', 'tuan.tm@email.com'),
('BN007', N'Lê Thị Thu Hà', '1992-09-20', N'Nữ', N'22 Trần Hưng Đạo, Hà Nội', '0987654322', 'ha.ltt@email.com'),
('BN008', N'Phạm Văn Hùng', '1975-02-15', N'Nam', N'33 Hai Bà Trưng, Hà Nội', '0987654323', 'hung.pv@email.com'),
('BN009', N'Nguyễn Thị Lan Anh', '2001-11-30', N'Nữ', N'44 Quang Trung, Hà Nội', '0987654324', 'lananh.nt@email.com'),
('BN010', N'Vũ Đức Thắng', '1995-07-07', N'Nam', N'55 Bà Triệu, Hà Nội', '0987654325', 'thang.vd@email.com'),
('BN011', N'Đỗ Phương Mai', '1983-01-25', N'Nữ', N'66 Bạch Mai, Hà Nội', '0987654326', 'mai.dp@email.com'),
('BN012', N'Hoàng Văn Nam', '1990-03-12', N'Nam', N'77 Xã Đàn, Hà Nội', '0987654327', 'nam.hv@email.com'),
('BN013', N'Bùi Thanh Thảo', '1998-08-19', N'Nữ', N'88 Kim Mã, Hà Nội', '0987654328', 'thao.bt@email.com'),
('BN014', N'Đặng Quang Vinh', '1979-12-05', N'Nam', N'99 Nguyễn Chí Thanh, Hà Nội', '0987654329', 'vinh.dq@email.com'),
('BN015', N'Lý Bảo Ngọc', '2003-04-18', N'Nữ', N'110 Láng Hạ, Hà Nội', '0987654330', 'ngoc.lb@email.com'),

-- 10 Bệnh nhân cho Bác sĩ Linh (ID 16-25)
('BN016', N'Hồ Anh Dũng', '1985-06-22', N'Nam', N'121 Nguyễn Văn Cừ, TPHCM', '0911111111', 'dung.ha@email.com'),
('BN017', N'Nguyễn Ngọc Bích', '1993-10-14', N'Nữ', N'122 Võ Thị Sáu, TPHCM', '0911111112', 'bich.nn@email.com'),
('BN018', N'Trần Quốc Bảo', '1997-01-09', N'Nam', N'123 Điện Biên Phủ, TPHCM', '0911111113', 'bao.tq@email.com'),
('BN019', N'Lê Minh Châu', '1980-07-28', N'Nữ', N'124 Đồng Khởi, TPHCM', '0911111114', 'chau.lm@email.com'),
('BN020', N'Phạm Gia Khiêm', '2000-02-20', N'Nam', N'125 Pasteur, TPHCM', '0911111115', 'khiem.pg@email.com'),
('BN021', N'Vũ Kiều Trang', '1996-09-03', N'Nữ', N'126 Nam Kỳ Khởi Nghĩa, TPHCM', '0911111116', 'trang.vk@email.com'),
('BN022', N'Đặng Minh Khôi', '1989-11-17', N'Nam', N'127 Lê Lợi, TPHCM', '0911111117', 'khoi.dm@email.com'),
('BN023', N'Ngô Tố Uyên', '1994-05-23', N'Nữ', N'128 Hai Bà Trưng, TPHCM', '0911111118', 'uyen.nt@email.com'),
('BN024', N'Bùi Thế Hiển', '1978-12-31', N'Nam', N'129 Nguyễn Huệ, TPHCM', '0911111119', 'hien.bt@email.com'),
('BN025', N'Đỗ Thùy Linh', '1999-08-08', N'Nữ', N'130 Cách Mạng Tháng 8, TPHCM', '0911111120', 'linh.dt@email.com');
GO

PRINT '20 new patients inserted successfully (ID 6-25).';
GO

-- ===== Bác sĩ Lê Minh Khoa (DoctorID = 2) - 10 Lịch hẹn (PatientID 6-15) =====
PRINT 'Inserting 20 new appointments for 2025-11-13 (ID 6-25)...';
GO
INSERT INTO Appointment (DateTime, Status, PatientID, DoctorID, ReceptionistID)
VALUES
-- Completed (Sáng)
('2025-11-13 08:00:00', 'Completed', 6, 2, 3),  -- Trần Minh Tuấn
('2025-11-13 08:30:00', 'Completed', 7, 2, 3),  -- Lê Thị Thu Hà
('2025-11-13 09:00:00', 'Completed', 8, 2, 3),  -- Phạm Văn Hùng
-- In Consultation (Đang khám)
('2025-11-13 09:30:00', 'In Consultation', 9, 2, 3), -- Nguyễn Thị Lan Anh
-- Checked-in (Đang chờ)
('2025-11-13 10:00:00', 'Checked-in', 10, 2, 3), -- Vũ Đức Thắng
('2025-11-13 10:15:00', 'Checked-in', 11, 2, 3), -- Đỗ Phương Mai
-- Scheduled (Chiều)
('2025-11-13 14:00:00', 'Scheduled', 12, 2, 3), -- Hoàng Văn Nam
('2025-11-13 14:30:00', 'Scheduled', 13, 2, 3), -- Bùi Thanh Thảo
('2025-11-13 15:00:00', 'Scheduled', 14, 2, 3), -- Đặng Quang Vinh
('2025-11-13 15:30:00', 'Scheduled', 15, 2, 3); -- Lý Bảo Ngọc
GO

-- ===== Bác sĩ Trần Thùy Linh (DoctorID = 4) - 10 Lịch hẹn (PatientID 16-25) =====
INSERT INTO Appointment (DateTime, Status, PatientID, DoctorID, ReceptionistID)
VALUES
-- Completed (Sáng)
('2025-11-13 08:15:00', 'Completed', 16, 4, 3), -- Hồ Anh Dũng
('2025-11-13 08:45:00', 'Completed', 17, 4, 3), -- Nguyễn Ngọc Bích
('2025-11-13 09:15:00', 'Completed', 18, 4, 3), -- Trần Quốc Bảo
-- In Consultation (Đang khám)
('2025-11-13 09:45:00', 'In Consultation', 19, 4, 3), -- Lê Minh Châu
-- Checked-in (Đang chờ)
('2025-11-13 10:30:00', 'Checked-in', 20, 4, 3), -- Phạm Gia Khiêm
('2025-11-13 10:45:00', 'Checked-in', 21, 4, 3), -- Vũ Kiều Trang
-- Scheduled (Chiều)
('2025-11-13 14:15:00', 'Scheduled', 22, 4, 3), -- Đặng Minh Khôi
('2025-11-13 14:45:00', 'Scheduled', 23, 4, 3), -- Ngô Tố Uyên
('2025-11-13 15:15:00', 'Scheduled', 24, 4, 3), -- Bùi Thế Hiển
('2025-11-13 15:45:00', 'Scheduled', 25, 4, 3); -- Đỗ Thùy Linh
GO


PRINT 'All data inserted successfully! (Total 25 patients, 25 appointments)';
GO