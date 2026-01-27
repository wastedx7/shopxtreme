# E-Commerce Backend API

A complete, production-ready Spring Boot 3.5.10 e-commerce backend API with session-based authentication, MySQL database, and comprehensive RESTful endpoints.

## 🚀 Features

- **Session-Based Authentication** - HTTP session authentication (no JWT/Redis)
- **Role-Based Access Control** - CUSTOMER, SELLER, ADMIN roles
- **Product Management** - Full CRUD with search, filtering, and pagination
- **Shopping Cart** - Add, update, remove items with stock validation
- **Order Processing** - Complete checkout flow with stock management
- **Reviews & Ratings** - Product reviews with automated rating calculations
- **Seller Dashboard** - Product management and sales statistics
- **Admin Panel** - User management, seller verification, and analytics
- **File Upload** - Product image upload support
- **Data Validation** - Comprehensive input validation with custom error messages
- **Exception Handling** - Global exception handler with RFC 7807 Problem Detail
- **Request Logging** - Automatic logging of all HTTP requests/responses
- **Audit Trail** - Automatic createdAt/updatedAt timestamps on all entities

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.x
- Your favorite IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🛠️ Technology Stack

- **Framework:** Spring Boot 3.5.10
- **Database:** MySQL 8.x with JPA/Hibernate
- **Security:** Spring Security 6 (Session-based)
- **Validation:** Jakarta Bean Validation
- **DTO Mapping:** MapStruct
- **Code Reduction:** Lombok
- **Testing:** JUnit 5, Spring Boot Test, H2 (in-memory)
- **Build Tool:** Maven

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
cd ecommerce-api
```

### 2. Create MySQL Database

```sql
CREATE DATABASE ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecom_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password_here
```

**Note:** Replace `your_password_here` with your actual MySQL root password.

### 4. Build the Project

```bash
mvn clean install
```

This will:
- Download all dependencies
- Generate MapStruct mappers
- Compile the code
- Run tests

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or run the JAR directly:

```bash
java -jar target/ecommerce-api-1.0.0.jar
```

The application will start on `http://localhost:8080`

### 6. Verify Installation

Check if the application is running:

```bash
curl http://localhost:8080/api/v1/categories
```

You should receive a list of categories in JSON format.

## 🗄️ Database Schema

The application uses JPA/Hibernate to automatically generate tables. On first run, the following tables will be created:

- `users` (base table)
- `customers`, `sellers`, `admins` (user type tables)
- `user_roles` (user roles collection)
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `reviews`
- `customer_wishlist`

## 👤 Pre-Loaded Test Users

The application automatically loads test data on first run:

### Admin
- Email: `admin@ecom.com`
- Password: `admin123`
- Role: ADMIN

### Customers
- Email: `customer1@example.com` | Password: `password123`
- Email: `customer2@example.com` | Password: `password123`

### Sellers
- Email: `seller1@example.com` | Password: `password123` (Verified)
- Email: `seller2@example.com` | Password: `password123` (Verified)
- Email: `seller3@example.com` | Password: `password123` (Pending verification)

## 🔐 Authentication Flow

### 1. Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@ecom.com",
  "password": "admin123"
}
```

Response includes user details and sets a session cookie (`JSESSIONID`).

### 2. Use the Session

Include the session cookie in subsequent requests:

```bash
GET /api/v1/auth/profile
Cookie: JSESSIONID=<your-session-id>
```

### 3. Logout

```bash
POST /api/v1/auth/logout
Cookie: JSESSIONID=<your-session-id>
```

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Login with email/password | No |
| POST | `/logout` | Logout and invalidate session | Yes |
| GET | `/profile` | Get current user profile | Yes |
| POST | `/register/customer` | Register new customer | No |
| POST | `/register/seller` | Register new seller | No |

### Products (`/api/v1/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all products (supports search, filter, pagination) | No |
| GET | `/{id}` | Get product details | No |
| POST | `/` | Create new product | SELLER/ADMIN |
| PUT | `/{id}` | Update product | SELLER/ADMIN |
| DELETE | `/{id}` | Delete product (soft delete) | SELLER/ADMIN |
| POST | `/{id}/reviews` | Add product review | CUSTOMER |
| GET | `/{id}/reviews` | Get product reviews | No |

**Query Parameters for GET /**:
- `categoryId` (UUID) - Filter by category
- `sellerId` (UUID) - Filter by seller
- `search` (String) - Search in name/description
- `page` (int) - Page number (default: 0)
- `size` (int) - Page size (default: 20)
- `sort` (String) - Sort field and direction (e.g., `price,asc`)

### Categories (`/api/v1/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all categories (tree structure) | No |
| GET | `/{id}` | Get category details | No |

### Cart (`/api/v1/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get current user's cart | CUSTOMER |
| POST | `/items` | Add item to cart | CUSTOMER |
| PUT | `/items/{itemId}` | Update cart item quantity | CUSTOMER |
| DELETE | `/items/{itemId}` | Remove item from cart | CUSTOMER |
| POST | `/checkout` | Checkout and create order | CUSTOMER |

### Customers (`/api/v1/customers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/{id}` | Get customer profile | CUSTOMER |
| PUT | `/{id}` | Update customer profile | CUSTOMER |
| GET | `/{id}/orders` | Get customer orders | CUSTOMER |
| POST | `/{id}/wishlist/{productId}` | Add to wishlist | CUSTOMER |
| GET | `/{id}/wishlist` | Get wishlist | CUSTOMER |

### Sellers (`/api/v1/sellers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/{id}` | Get seller profile | Public |
| GET | `/{id}/products` | Get seller's products | Public |
| GET | `/{id}/stats` | Get seller statistics | SELLER/ADMIN |
| GET | `/{id}/orders` | Get orders containing seller's products | SELLER/ADMIN |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/{id}` | Get order details | CUSTOMER/SELLER/ADMIN |

### Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | List all users | ADMIN |
| GET | `/stats` | Get platform statistics | ADMIN |
| PUT | `/users/{id}/roles` | Update user roles | ADMIN |
| GET | `/sellers/pending` | List unverified sellers | ADMIN |
| PUT | `/sellers/{id}/verify` | Verify a seller | ADMIN |
| POST | `/categories` | Create category | ADMIN |
| PUT | `/categories/{id}` | Update category | ADMIN |
| DELETE | `/categories/{id}` | Delete category | ADMIN |
| POST | `/orders/{id}/status` | Update order status | ADMIN |

## 🧪 Testing

### Run All Tests

```bash
mvn test
```

Tests use an in-memory H2 database automatically configured in `application-test.properties`.

### Run Specific Test Class

```bash
mvn test -Dtest=EcommerceApiApplicationTests
```

## 🔧 Configuration

### Application Properties

Key configurations in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecom_db
spring.jpa.hibernate.ddl-auto=update  # Creates/updates tables automatically

# Server
server.port=8080
server.servlet.session.timeout=30m  # Session timeout

# File Upload
spring.servlet.multipart.max-file-size=64KB
spring.servlet.multipart.max-request-size=5MB
file.upload.dir=uploads/

# Logging
logging.level.com.example.ecom=DEBUG
```

### CORS Configuration

The application is configured to allow all origins for development. For production, update `CorsConfig.java` to restrict allowed origins.

### CSRF Protection

CSRF is enabled with cookie-based tokens suitable for SPA/frontend usage. The CSRF token is available in the `X-CSRF-TOKEN` response header.

## 📊 Sample API Calls

### Register a New Customer

```bash
curl -X POST http://localhost:8080/api/v1/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newcustomer@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "Customer",
    "phone": "+1234567890",
    "shippingAddress": "123 Street, City",
    "billingAddress": "123 Street, City"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "customer1@example.com",
    "password": "password123"
  }'
```

### Search Products

```bash
curl -X GET "http://localhost:8080/api/v1/products?search=laptop&page=0&size=10"
```

### Add to Cart

```bash
curl -X POST http://localhost:8080/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productId": "<product-uuid>",
    "quantity": 2
  }'
```

### Checkout

```bash
curl -X POST http://localhost:8080/api/v1/cart/checkout \
  -b cookies.txt
```

## 🐛 Troubleshooting

### Port 8080 Already in Use

Change the port in `application.properties`:

```properties
server.port=8081
```

### Database Connection Failed

1. Verify MySQL is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;`
3. Verify credentials in `application.properties`

### Session Not Persisting

Sessions are in-memory and will be lost on application restart. This is normal for development. For production, consider session clustering.

### MapStruct Compilation Errors

Clean and rebuild:

```bash
mvn clean compile
```

## 📁 Project Structure

```
ecommerce-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/ecom/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entities/        # JPA entities
│   │   │   ├── exception/       # Custom exceptions
│   │   │   ├── repository/      # JPA repositories
│   │   │   ├── security/        # Security configuration
│   │   │   ├── service/         # Business logic
│   │   │   ├── util/            # Utility classes
│   │   │   └── EcommerceApiApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/                # Test classes
│       └── resources/
│           └── application-test.properties
├── pom.xml
└── README.md
```

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📝 License

This project is provided as-is for educational and demonstration purposes.

## 📧 Support

For issues or questions, please review the code documentation and Spring Boot official documentation.

---

**Built with ❤️ using Spring Boot 3.5.10**
