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
    Status VARCHAR(50) NOT NULL -- Đổi từ NVARCHAR sang VARCHAR
);
GO

-- Bảng Nhóm Thuốc (MedicineGroup)
CREATE TABLE MedicineGroup (
    MedicineGroupID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Status VARCHAR(50) NOT NULL -- Đổi từ NVARCHAR sang VARCHAR
);
GO

-- Bảng Phương thức Thanh toán (PaymentMethod)
CREATE TABLE PaymentMethod (
    PaymentMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName NVARCHAR(255) NOT NULL UNIQUE,
    Status VARCHAR(50) NOT NULL -- Đổi từ NVARCHAR sang VARCHAR
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
    Status VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
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
    Status VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
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
    Status VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
    CONSTRAINT FK_Medicine_MedicineGroup FOREIGN KEY (MedicineGroupID) REFERENCES MedicineGroup(MedicineGroupID)
);
GO

-- ===== BẢNG NHÓM 3: Phụ thuộc Nhóm 1 & 2 =====

-- Bảng Lịch hẹn (Appointment)
CREATE TABLE Appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    DateTime DATETIME2 NOT NULL,
    Status VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
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
    Status VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
    AppointmentID INT NOT NULL,
    CONSTRAINT FK_Notification_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID)
);
GO

-- Bảng Hóa đơn (Bill)
CREATE TABLE Bill (
    BillID INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceCode VARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL, -- Đổi từ NVARCHAR sang VARCHAR
    AppointmentID INT NOT NULL UNIQUE, -- Ràng buộc 1-1
    PaymentMethodID INT,
    DateIssued DATETIME2 NOT NULL,
    DatePaid DATETIME2 NULL,
    CONSTRAINT FK_Bill_Appointment FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    CONSTRAINT FK_Bill_PaymentMethod FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethod(PaymentMethodID)
);
GO

-- Bảng Bệnh án/Phiếu khám (MedicalRecord)
-- ... (Giữ nguyên, không có status)
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
-- ... (Giữ nguyên)
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
-- ... (Giữ nguyên)
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
-- ... (Giữ nguyên)
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
-- ... (Giữ nguyên)
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
-- ===== INSERT DỮ LIỆU (ENGLISH) =====
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

-- Bảng Bệnh nhân (Patient)
PRINT 'Inserting data into Patient...';
INSERT INTO Patient (PatientCode, FullName, DateOfBirth, Gender, Address, Phone, Email)
VALUES
('BN001', N'Nguyen Van An', '1990-01-15', N'Nam', N'123 Duong Lang, Ha Noi', '0912345671', 'an.nv@email.com'),
('BN002', N'Tran Thi Binh', '1985-05-20', N'Nữ', N'456 Hai Ba Trung, TPHCM', '0912345672', 'binh.tt@email.com'),
('BN003', N'Le Van Cuong', '2001-11-30', N'Nam', N'789 Nguyen Van Linh, Da Nang', '0912345673', 'cuong.lv@email.com'),
('BN004', N'Pham Thi Dung', '1995-02-10', N'Nữ', N'101 Le Loi, Hai Phong', '0912345674', 'dung.pt@email.com'),
('BN005', N'Hoang Van Em', '1978-07-07', N'Nam', N'202 Tran Phu, Can Tho', '0912345675', 'em.hv@email.com');
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
PRINT 'Inserting data into Medicine...';
INSERT INTO Medicine (MedicineCode, MedicineGroupID, Name, Strength, Price, Stock, Status)
VALUES
('AMOXI500', 1, N'Amoxicillin', N'500mg', 1500.00, 500, 'Active'),
('PARA500', 2, N'Paracetamol', N'500mg', 1000.00, 1000, 'Active'),
('AMLOR5', 4, N'Amlodipine', N'5mg', 3000.00, 300, 'Active'),
('VITC1000', 3, N'Vitamin C', N'1000mg', 3000.00, 800, 'Active'),
('OMEP20', 5, N'Omeprazole', N'20mg', 5000.00, 150, 'Active');
GO

-- Bảng Lịch hẹn (Appointment)
PRINT 'Inserting data into Appointment...';
INSERT INTO Appointment (DateTime, Status, PatientID, DoctorID, ReceptionistID)
VALUES
('2025-11-10 09:00:00', 'Completed', 1, 2, 3),
('2025-11-10 10:00:00', 'Completed', 2, 4, 5),
('2025-11-11 09:30:00', 'Completed', 3, 2, 3),
('2025-11-11 11:00:00', 'Completed', 4, 4, 5),
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

PRINT 'All data inserted successfully (English version)!';