# 🚌 Coach Booking - Hệ thống đặt vé xe khách trực tuyến

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Giải pháp đặt vé xe khách online** - Không cần gọi điện, có vé điện tử xác nhận, chọn ghế trực quan!

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Demo](#-demo)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Tài khoản test](#-tài-khoản-test)

---

## 🎯 Giới thiệu

**Coach Booking** là hệ thống đặt vé xe khách trực tuyến, được xây dựng để giải quyết các vấn đề thực tế:

| ❌ Vấn đề cũ | ✅ Giải pháp mới |
|-------------|-----------------|
| Phải gọi điện đặt vé | Đặt online 24/7 |
| Không có vé xác nhận | Mã vé điện tử + QR |
| Không biết còn ghế không | Sơ đồ ghế real-time |
| Khó so sánh nhà xe | Xem tất cả chuyến cùng lúc |
| Thanh toán tiền mặt | MoMo, VNPay, Chuyển khoản |

## ✨ Tính năng

### 👤 Khách hàng
- 🔍 Tìm kiếm chuyến xe theo tuyến, ngày, loại xe
- 🪑 Chọn ghế trực quan trên sơ đồ xe giường nằm 2 tầng (41 giường)
- 💳 Thanh toán online: MoMo, VNPay, Chuyển khoản ngân hàng
- 🎫 Quản lý vé đã đặt với mã QR
- ❌ Hủy vé trước giờ khởi hành

### 👨‍💼 Admin
- 📊 Dashboard tổng quan hệ thống
- 🛣️ Quản lý tuyến đường (CRUD)
- 🚌 Quản lý xe khách (CRUD)
- 📅 Quản lý chuyến xe (CRUD)
- 🎫 Quản lý đơn đặt vé, xác nhận thanh toán
- 🔍 Tra cứu vé theo mã booking

## 🖼️ Demo

### Trang chủ - Tìm kiếm chuyến xe
```
┌─────────────────────────────────────────────────────────────┐
│  🚌 CoachBooking                              [Đăng nhập]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Đặt vé xe khách - Nhanh chóng & Tiện lợi           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 📍 Điểm đi  │ │ 📍 Điểm đến │ │ 📅 Ngày đi  │          │
│  │ [Hà Nội ▼] │ │ [Hải Phòng▼]│ │ [25/12/2024]│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│              [ 🔍 Tìm chuyến xe ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Chọn ghế - Sơ đồ xe giường nằm 2 tầng
```
┌─────────────────────────────────────────────────────────────┐
│  TẦNG 1 (18 giường)                              [Tài xế]  │
│  ┌────┬────┬────┬────┬────┬────┐                          │
│  │ A1 │ A4 │ A7 │A10 │A13 │A16 │  ⬜ Trống               │
│  ├────┼────┼────┼────┼────┼────┤  🟧 Đang chọn           │
│  │ A2 │ A5 │ A8 │A11 │A14 │A17 │  ⬛ Đã đặt              │
│  ├────┼────┼────┼────┼────┼────┤                          │
│  │ A3 │ A6 │ A9 │A12 │A15 │A18 │                          │
│  └────┴────┴────┴────┴────┴────┘                          │
├─────────────────────────────────────────────────────────────┤
│  TẦNG 2 (23 giường)                                        │
│  ┌────┬────┬────┬────┬────┬────┬────┐                     │
│  │ B1 │ B4 │ B7 │B10 │B13 │B16 │B19 │                     │
│  ├────┼────┼────┼────┼────┼────┼────┤                     │
│  │ B2 │ B5 │ B8 │B11 │B14 │B17 │B20 │                     │
│  ├────┼────┼────┼────┼────┼────┼────┼────┬────┬────┐      │
│  │ B3 │ B6 │ B9 │B12 │B15 │B18 │B21 │B22 │B23 │    │      │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Version | Mô tả |
|-----------|---------|-------|
| Java | 17 | Ngôn ngữ lập trình |
| Spring Boot | 3.2.0 | Framework backend |
| Spring Security | 6.x | Bảo mật, authentication |
| Spring Data JPA | 3.x | ORM, database access |
| JWT (jjwt) | 0.12.3 | Token authentication |
| MySQL | 8.x | Database |
| Maven | 3.x | Build tool |

### Frontend
| Công nghệ | Version | Mô tả |
|-----------|---------|-------|
| React | 18.x | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 5.x | Build tool |
| TailwindCSS | 3.x | CSS framework |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP client |
| Lucide React | - | Icons |

## 📁 Cấu trúc dự án

```
coach-booking/
├── 📂 backend/                    # Spring Boot Backend
│   ├── 📂 src/main/java/com/example/demo/
│   │   ├── 📂 config/            # Cấu hình (CORS, Payment, DataInit)
│   │   ├── 📂 controller/        # REST Controllers
│   │   ├── 📂 dto/               # Data Transfer Objects
│   │   ├── 📂 entity/            # JPA Entities
│   │   ├── 📂 exception/         # Exception handlers
│   │   ├── 📂 repository/        # JPA Repositories
│   │   ├── 📂 security/          # JWT, Security config
│   │   └── 📂 service/           # Business logic
│   └── 📄 pom.xml
│
├── 📂 frontend/                   # React Frontend (Khách hàng)
│   ├── 📂 src/
│   │   ├── 📂 api/               # Axios config
│   │   ├── 📂 components/        # Shared components
│   │   ├── 📂 context/           # Auth context
│   │   └── 📂 pages/             # Page components
│   └── 📄 package.json
│
├── 📂 dashboard/                  # React Dashboard (Admin)
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   ├── 📂 components/
│   │   ├── 📂 context/
│   │   └── 📂 pages/
│   └── 📄 package.json
│
└── 📄 README.md
```

## 🚀 Cài đặt

### Yêu cầu
- Java 17+
- Node.js 18+
- MySQL 8+ hoặc Docker
- Maven 3+

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/coach-booking.git
cd coach-booking
```

### Bước 2: Khởi động MySQL với Docker
```bash
docker run -d --name mysql-coach \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=coachbooking \
  -e MYSQL_USER=coachuser \
  -e MYSQL_PASSWORD=coachpass \
  -p 3308:3306 \
  mysql:8
```

Hoặc tạo database thủ công:
```sql
CREATE DATABASE coachbooking;
CREATE USER 'coachuser'@'localhost' IDENTIFIED BY 'coachpass';
GRANT ALL PRIVILEGES ON coachbooking.* TO 'coachuser'@'localhost';
```

### Bước 3: Khởi động Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend chạy tại: `http://localhost:8081`

### Bước 4: Khởi động Frontend (Khách hàng)
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

### Bước 5: Khởi động Dashboard (Admin)
```bash
cd dashboard
npm install
npm run dev
```
Dashboard chạy tại: `http://localhost:5174`

## 📖 Sử dụng

### Khách hàng
1. Truy cập `http://localhost:5173`
2. Tìm kiếm chuyến xe (điểm đi, điểm đến, ngày)
3. Chọn chuyến xe phù hợp
4. Đăng nhập/Đăng ký tài khoản
5. Chọn ghế trên sơ đồ xe
6. Thanh toán (MoMo/VNPay/Chuyển khoản)
7. Nhận mã vé điện tử

### Admin
1. Truy cập `http://localhost:5174`
2. Đăng nhập với tài khoản admin
3. Quản lý: Tuyến đường → Xe khách → Chuyến xe
4. Xác nhận đơn đặt vé sau khi khách thanh toán


## 📚 API Documentation

### Authentication
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |

### Trips & Routes
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/routes` | Danh sách tuyến đường | ❌ |
| POST | `/api/trips/search` | Tìm kiếm chuyến xe | ❌ |
| GET | `/api/trips/{id}` | Chi tiết chuyến xe | ❌ |

### Seats
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/seats/trip/{tripId}` | Danh sách ghế của chuyến | ✅ |
| GET | `/api/seats/trip/{tripId}/available` | Ghế còn trống | ✅ |

### Bookings
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/bookings` | Tạo đơn đặt vé | ✅ |
| GET | `/api/bookings` | Danh sách vé của tôi | ✅ |
| GET | `/api/bookings/{id}` | Chi tiết đơn đặt | ✅ |
| POST | `/api/bookings/payment` | Xác nhận thanh toán | ✅ |
| GET | `/api/bookings/{id}/payment-qr` | Lấy QR thanh toán | ✅ |
| DELETE | `/api/bookings/{id}` | Hủy vé | ✅ |

### Admin (Yêu cầu role ADMIN)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/routes` | Danh sách tuyến |
| POST | `/api/admin/routes` | Tạo tuyến mới |
| PUT | `/api/admin/routes/{id}` | Cập nhật tuyến |
| DELETE | `/api/admin/routes/{id}` | Xóa tuyến |
| GET | `/api/admin/coaches` | Danh sách xe |
| POST | `/api/admin/coaches` | Tạo xe mới |
| PUT | `/api/admin/coaches/{id}` | Cập nhật xe |
| DELETE | `/api/admin/coaches/{id}` | Xóa xe |
| GET | `/api/admin/trips` | Danh sách chuyến |
| POST | `/api/admin/trips` | Tạo chuyến mới |
| PUT | `/api/admin/trips/{id}` | Cập nhật chuyến |
| DELETE | `/api/admin/trips/{id}` | Xóa chuyến |
| GET | `/api/admin/bookings` | Tất cả đơn đặt |
| GET | `/api/admin/bookings/search/{code}` | Tra cứu theo mã vé |
| PATCH | `/api/admin/bookings/{id}/status` | Cập nhật trạng thái |

### Ví dụ Request/Response

**Đăng nhập:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "test@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "role": "CUSTOMER"
}
```

**Tìm kiếm chuyến xe:**
```bash
POST /api/trips/search
Content-Type: application/json

{
  "departure": "Hà Nội",
  "destination": "Hải Phòng",
  "departureDate": "2024-12-25",
  "coachType": "VIP"
}
```

**Đặt vé:**
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": 1,
  "seatIds": [1, 2, 3]
}
```

## 🔑 Tài khoản test

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | `admin@coachbooking.com` | `admin123` |
| 👤 Customer | `test@example.com` | `123456` |

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   bookings   │     │    trips     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │◄────│ user_id      │     │ id           │
│ full_name    │     │ trip_id      │────►│ route_id     │
│ email        │     │ booking_code │     │ coach_id     │
│ phone        │     │ total_price  │     │ departure_time│
│ password     │     │ status       │     │ arrival_time │
│ role         │     │ payment_method│    │ price        │
│ created_at   │     │ created_at   │     │ status       │
└──────────────┘     └──────┬───────┘     └──────┬───────┘
                            │                    │
                            │ M:N                │ 1:N
                            ▼                    ▼
                     ┌──────────────┐     ┌──────────────┐
                     │    seats     │     │   coaches    │
                     ├──────────────┤     ├──────────────┤
                     │ id           │     │ id           │
                     │ trip_id      │     │ license_plate│
                     │ seat_number  │     │ type         │
                     │ status       │     │ total_seats  │
                     │ version      │     │ description  │
                     └──────────────┘     └──────────────┘
                                                │
                            ┌──────────────┐    │
                            │    routes    │◄───┘
                            ├──────────────┤
                            │ id           │
                            │ departure    │
                            │ destination  │
                            │ distance     │
                            │ duration     │
                            └──────────────┘
```

## 🔒 Bảo mật

- **JWT Authentication**: Token-based authentication
- **BCrypt**: Mã hóa password
- **Role-based Access Control**: CUSTOMER, ADMIN
- **Pessimistic Locking**: Tránh double booking ghế
- **CORS**: Cấu hình cho phép frontend domains

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác giả

**[Tên của bạn]**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

---

⭐ Nếu dự án hữu ích, hãy cho một star nhé!
