# ClinicSys - Hệ thống Quản lý Phòng khám

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
4. [Hướng dẫn cài đặt và chạy](#hướng-dẫn-cài-đặt-và-chạy)
5. [Cấu trúc Backend](#cấu-trúc-backend)
6. [Cấu trúc Frontend](#cấu-trúc-frontend)
7. [API Endpoints](#api-endpoints)
8. [Database](#database)

---

## 🎯 Tổng quan

ClinicSys là hệ thống quản lý phòng khám được xây dựng với:
- **Backend**: Spring Boot 3.5.7 (Java 17)
- **Frontend**: React 19.1.1 với Vite
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Token)

Hệ thống hỗ trợ 3 vai trò chính:
- **Admin**: Quản lý nhân viên, dịch vụ, thuốc
- **Doctor**: Quản lý bệnh nhân, khám bệnh, kê đơn
- **Receptionist**: Quản lý lễ tân (đang phát triển)

---

## 📁 Cấu trúc dự án

```
ClinicSysProject/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/clinicSys/
│   │       │   ├── config/         # Security, JWT config
│   │       │   ├── controller/      # REST Controllers
│   │       │   ├── domain/          # JPA Entities
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── repository/      # Data Access Layer
│   │       │   └── service/         # Business Logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── ApiClient/       # API service clients
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── doctor/      # Doctor pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── receptionist/ # Receptionist pages
│   │   ├── App.jsx          # Main routing
│   │   └── main.jsx
│   └── package.json
├── db.sql                   # Database schema
└── README.md                # File này
```

---

## 💻 Yêu cầu hệ thống

### Backend
- **Java**: JDK 17 hoặc cao hơn
- **Maven**: 3.6+ (hoặc sử dụng Maven Wrapper)
- **SQL Server**: 2019+ hoặc SQL Server Express
- **IDE**: IntelliJ IDEA, Eclipse, hoặc VS Code (khuyến nghị)

### Frontend
- **Node.js**: 18.0+ hoặc cao hơn
- **npm**: 9.0+ hoặc **yarn** 1.22+
- **Browser**: Chrome, Firefox, Edge (phiên bản mới nhất)

---

## 🚀 Hướng dẫn cài đặt và chạy

### Bước 1: Cài đặt Database

1. Tạo database SQL Server:
```sql
-- Database sẽ được tạo tự động khi chạy script db.sql
-- Hoặc tạo thủ công:
CREATE DATABASE ClinicSysDB;
```

2. Import schema từ file `db.sql`:
- Sử dụng **SQL Server Management Studio (SSMS)**
- Mở file `db.sql`
- Chạy script (F5 hoặc Execute)

Hoặc sử dụng command line:
```bash
sqlcmd -S localhost -U sa -P 123456 -i db.sql
```

### Bước 2: Cấu hình Backend

1. Mở file `backend/src/main/resources/application.properties`

2. Cập nhật thông tin kết nối database (nếu cần):
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ClinicSysDB;encrypt=false
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
```

3. Cập nhật JWT secret ( không cần):
```properties
jwt.secret=your-secret-key-here
```

### Bước 3: Chạy Backend

**Cách 1: Sử dụng Maven Wrapper (Khuyến nghị)**
```bash
cd backend
./mvnw spring-boot:run  => chạy lệnh này
```

**Cách 2: Sử dụng Maven**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Cách 3: Chạy từ IDE**
- Mở project trong IntelliJ IDEA/Eclipse
- Tìm file `BackendApplication.java`
- Click chuột phải → Run 'BackendApplication'

Backend sẽ chạy tại: **http://localhost:8080**

### Bước 4: Cài đặt và chạy Frontend

1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

2. Chạy development server:
```bash
npm run dev => chạy lenh này
```

Frontend sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 đã được sử dụng)

### Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5173**

**Tài khoản mặc định** (nếu có trong database):
- Admin: `admin@example.com` / `password`
- Doctor: `doctor@example.com` / `password`
- Receptionist: `receptionist@example.com` / `password`
  (check usename or email in database)
---

## 🏗️ Cấu trúc Backend

### Package Structure

```
com.clinicSys/
├── backend/
│   └── BackendApplication.java    # Main application class
├── config/
│   ├── SecurityConfig.java        # Spring Security configuration
│   ├── JwtUtil.java              # JWT utility class
│   └── filter/
│       └── JwtAuthFilter.java    # JWT authentication filter
├── controller/                     # REST Controllers
│   ├── AuthController.java        # Authentication endpoints
│   ├── AdminController.java       # Admin endpoints
│   ├── DoctorController.java      # Doctor endpoints
│   ├── EMRController.java         # EMR endpoints
│   ├── MedicineController.java    # Medicine management
│   ├── PrescriptionController.java # Prescription management
│   └── ServiceController.java     # Service management
├── domain/                         # JPA Entities
│   ├── User.java                  # User entity
│   ├── Patient.java                # Patient entity
│   ├── Appointment.java           # Appointment entity
│   ├── MedicalRecord.java          # Medical record entity
│   ├── Diagnosis.java             # Diagnosis entity
│   ├── Prescription.java          # Prescription entity
│   ├── Medicine.java              # Medicine entity
│   └── ...
├── dto/                            # Data Transfer Objects
│   ├── request/                    # Request DTOs
│   └── response/                   # Response DTOs
├── repository/                     # Data Access Layer
│   ├── IUserRepository.java        # Repository interfaces
│   ├── IAppointmentRepository.java
│   └── impl/                       # Repository implementations
└── service/                        # Business Logic Layer
    ├── IAuthService.java           # Service interfaces
    ├── IDoctorService.java
    └── impl/                       # Service implementations
```

### Các thành phần chính

#### 1. **Controllers** (`controller/`)
- Xử lý HTTP requests/responses
- Validate input
- Gọi services để xử lý business logic
- Trả về JSON responses

#### 2. **Services** (`service/`)
- Chứa business logic
- Xử lý transactions
- Gọi repositories để truy cập database

#### 3. **Repositories** (`repository/`)
- Interface và implementation cho data access
- Sử dụng JPA/Hibernate
- Custom queries với JPQL

#### 4. **Domain/Entities** (`domain/`)
- JPA entities mapping với database tables
- Sử dụng Lombok để giảm boilerplate code

#### 5. **DTOs** (`dto/`)
- Request DTOs: Dữ liệu từ client
- Response DTOs: Dữ liệu trả về cho client

#### 6. **Config** (`config/`)
- `SecurityConfig`: Cấu hình Spring Security, CORS, role-based access
- `JwtUtil`: Utility để tạo và validate JWT tokens
- `JwtAuthFilter`: Filter để xác thực JWT token

---

## 🎨 Cấu trúc Frontend

### Package Structure

```
src/
├── ApiClient/                      # API service clients
│   ├── api.js                      # Base API client (axios config)
│   ├── authService.js              # Authentication APIs
│   ├── doctorService.js            # Doctor APIs
│   ├── emrService.js               # EMR APIs
│   ├── prescriptionService.js      # Prescription APIs
│   ├── medicineService.js          # Medicine APIs
│   ├── serviceService.js           # Service APIs
│   ├── userService.js              # User management APIs
│   └── dashboardService.js         # Dashboard APIs
├── components/                     # Reusable components
│   ├── BackButton.jsx              # Back button component
│   ├── LogoutButton.jsx           # Logout button component
│   ├── ProtectedRoute.jsx         # Route protection component
│   └── layout/
│       ├── AdminLayout.jsx        # Admin layout with sidebar
│       └── DoctorLayout.jsx       # Doctor layout with sidebar
├── context/                        # React Context
│   ├── AuthContext.jsx            # Authentication context
│   └── UserContext.jsx            # User context
├── pages/                          # Page components
│   ├── auth/
│   │   └── Login.jsx               # Login page
│   ├── admin/                     # Admin pages
│   │   ├── AdminDashboard.jsx     # Admin dashboard
│   │   ├── StaffList.jsx          # Staff management
│   │   ├── AddStaff.jsx           # Add staff
│   │   ├── UpdateStaff.jsx        # Update staff
│   │   ├── ServiceList.jsx        # Service management
│   │   ├── AddService.jsx         # Add service
│   │   ├── UpdateService.jsx      # Update service
│   │   ├── MedicineList.jsx       # Medicine management
│   │   ├── AddMedicine.jsx        # Add medicine
│   │   └── UpdateMedicine.jsx    # Update medicine
│   ├── doctor/                     # Doctor pages
│   │   ├── DoctorDashboard.jsx    # Doctor dashboard
│   │   ├── EMRPage.jsx            # Patient EMR
│   │   ├── NewConsultation.jsx    # New consultation note
│   │   ├── UpdateConsultation.jsx # Update consultation
│   │   ├── CreatePrescription.jsx # Create prescription
│   │   └── UpdatePrescription.jsx # Update prescription
│   └── receptionist/              # Receptionist pages (future)
├── App.jsx                         # Main routing configuration
└── main.jsx                        # Application entry point
```

### Các thành phần chính

#### 1. **ApiClient** (`ApiClient/`)
- Base API client với axios
- Các service clients cho từng module
- Tự động thêm JWT token vào headers
- Xử lý errors

#### 2. **Components** (`components/`)
- **Layout components**: AdminLayout, DoctorLayout
- **Common components**: BackButton, LogoutButton
- **Route protection**: ProtectedRoute

#### 3. **Context** (`context/`)
- **AuthContext**: Quản lý authentication state
- **UserContext**: Quản lý user information

#### 4. **Pages** (`pages/`)
- Tổ chức theo role (admin, doctor, auth, receptionist)
- Mỗi page là một React component độc lập

#### 5. **Routing** (`App.jsx`)
- Sử dụng React Router v7
- Protected routes với role-based access
- Nested routes với Layout components

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất (nếu có)

### Admin APIs (`/api/admin/**`)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/staff` - Danh sách nhân viên
- `POST /api/admin/staff` - Tạo nhân viên mới
- `PUT /api/admin/staff/{id}` - Cập nhật nhân viên
- `PUT /api/admin/staff/{id}/status` - Cập nhật trạng thái
- `POST /api/admin/staff/{id}/reset-password` - Reset mật khẩu

### Doctor APIs (`/api/doctor/**`)
- `GET /api/doctor/dashboard` - Doctor dashboard
- `GET /api/doctor/emr/appointment/{appointmentID}` - Lấy EMR data
- `POST /api/doctor/emr/appointment/{appointmentID}/start-consultation` - Bắt đầu consultation
- `POST /api/doctor/emr/appointment/{appointmentID}/complete` - Hoàn thành consultation
- `GET /api/doctor/emr/icd10/search` - Tìm kiếm ICD10 codes
- `POST /api/doctor/emr/consultation/save` - Lưu consultation note
- `GET /api/doctor/emr/consultation/{appointmentID}` - Lấy consultation data

### Prescription APIs (`/api/doctor/prescription/**`)
- `GET /api/doctor/prescription/medicines/search` - Tìm kiếm thuốc
- `GET /api/doctor/prescription/appointment/{appointmentID}` - Lấy prescription data
- `POST /api/doctor/prescription/save` - Lưu prescription

### Medicine APIs (`/api/medicines/**`)
- `GET /api/medicines` - Danh sách thuốc
- `POST /api/medicines` - Tạo thuốc mới
- `PUT /api/medicines/{id}` - Cập nhật thuốc
- `PUT /api/medicines/{id}/status` - Cập nhật trạng thái

### Service APIs (`/api/services/**`)
- `GET /api/services` - Danh sách dịch vụ
- `POST /api/services` - Tạo dịch vụ mới
- `PUT /api/services/{id}` - Cập nhật dịch vụ
- `PUT /api/services/{id}/status` - Cập nhật trạng thái

**Lưu ý**: Tất cả các endpoints (trừ `/api/auth/login`) đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

---

## 🗄️ Database

### Schema Overview

Database được định nghĩa trong file `db.sql`. Các bảng chính:

- **User**: Thông tin người dùng (Admin, Doctor, Receptionist)
- **Patient**: Thông tin bệnh nhân
- **Appointment**: Lịch hẹn khám
- **MedicalRecord**: Hồ sơ khám bệnh
- **Diagnosis**: Chẩn đoán
- **ICD10Code**: Mã ICD-10
- **Prescription**: Đơn thuốc
- **Prescription_Medicine**: Chi tiết đơn thuốc
- **Medicine**: Thông tin thuốc
- **MedicineGroup**: Nhóm thuốc
- **Service**: Dịch vụ
- **ServiceType**: Loại dịch vụ
- **Bill**: Hóa đơn

### Import Database

```bash
# Sử dụng SQL Server command line
sqlcmd -S localhost -U sa -P 123456 -i db.sql

# Hoặc sử dụng SQL Server Management Studio (SSMS)
# File → Open → File → Chọn db.sql → Execute (F5)
```

---

## 🔧 Cấu hình

### Backend Configuration

File: `backend/src/main/resources/application.properties`

```properties
# Server
server.port=8080

# Database (SQL Server)
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ClinicSysDB;encrypt=false
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

# JWT
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000

# CORS (nếu cần)
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration

File: `frontend/src/ApiClient/api.js`

```javascript
// Base URL cho API
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🧪 Testing

### Test Backend

```bash
cd backend
mvn test
```

### Test Frontend

```bash
cd frontend
npm run lint
```

---

## 📝 Ghi chú

### Development

- Backend chạy trên port **8080**
- Frontend chạy trên port **5173** (hoặc port khác nếu 5173 đã được sử dụng)
- Hot reload được bật cho cả frontend và backend

### Production Build

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Files sẽ được build vào thư mục dist/
```

### Troubleshooting

1. **Lỗi kết nối database**: 
   - Kiểm tra SQL Server đang chạy
   - Kiểm tra username/password trong `application.properties`
   - Đảm bảo SQL Server Authentication được bật (Mixed Mode)
   - Kiểm tra port 1433 có đang mở không

2. **CORS errors**: Đảm bảo CORS đã được cấu hình trong `SecurityConfig.java`

3. **JWT token expired**: Token có thời hạn 24 giờ, cần đăng nhập lại

4. **Port đã được sử dụng**: Thay đổi port trong `application.properties` (backend) hoặc `vite.config.js` (frontend)

5. **SQL Server Driver not found**: Đảm bảo dependency `mssql-jdbc` đã được thêm vào `pom.xml`

---

## 👥 Roles và Permissions

### Admin
- Quản lý nhân viên (Staff Management)
- Quản lý dịch vụ (Service Management)
- Quản lý thuốc (Medicine Management)
- Xem dashboard với thống kê

### Doctor
- Xem dashboard với danh sách bệnh nhân
- Xem và quản lý EMR (Electronic Medical Record)
- Tạo và cập nhật consultation notes
- Tạo và cập nhật prescriptions
- Tìm kiếm ICD10 codes
- Tìm kiếm medicines

### Receptionist
- (Đang phát triển)

---

## 📚 Technologies Used

### Backend
- Spring Boot 3.5.7
- Spring Security (JWT Authentication)
- Spring Data JPA / Hibernate
- SQL Server JDBC Driver (mssql-jdbc)
- Lombok
- JWT (jjwt 0.11.5)
- Maven

### Frontend
- React 19.1.1
- React Router DOM 7.9.5
- Axios 1.13.1
- Vite 7.1.7

---

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Console logs (F12 trong browser)
2. Backend logs (terminal nơi chạy Spring Boot)
3. Database connection
4. CORS configuration
5. JWT token validity

---

**Version**: 1.0.0  
**Last Updated**: 2025

