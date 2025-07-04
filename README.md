# 🏢 Employee Directory - Full Stack Application

A modern, full-stack employee directory application built with **NestJS** (Backend) and **Next.js** (Frontend), featuring real-time data management, authentication, and a responsive UI.

## 🌟 Features

### Backend (NestJS)
- **RESTful API** with comprehensive CRUD operations
- **JWT Authentication** with role-based access control
- **PostgreSQL Database** (Neon) with TypeORM
- **SQLite** for local development
- **Swagger API Documentation**
- **Request/Response Logging**
- **Global Exception Handling**
- **CORS Configuration** for cross-origin requests
- **Rate Limiting** and Security Headers
- **Environment-based Configuration**

### Frontend (Next.js)
- **Modern React UI** with TypeScript
- **Responsive Design** for all devices
- **Real-time Data Updates**
- **Advanced Filtering & Search**
- **Employee Management Interface**
- **Authentication Integration**
- **Optimized Performance**

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd server-employee-directory-nestjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp env.example .env
```

Update `.env` with your configuration:
```env
# Database Configuration
DATABASE_URL=your_database_url_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app

# Environment
NODE_ENV=development
```

4. **Run migrations**
```bash
npm run migration:run
```

5. **Start development server**
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../client-employee-directory-next
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update the API base URL in your frontend configuration to point to your backend.

4. **Start development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Core Endpoints

#### Health Check
```http
GET /api/v1/health
```

#### Employee Management
```http
GET    /api/v1/employees          # Get all employees (with pagination)
POST   /api/v1/employees          # Create new employee
GET    /api/v1/employees/:id      # Get employee by ID
PUT    /api/v1/employees/:id      # Update employee
DELETE /api/v1/employees/:id      # Delete employee
```

#### Filter Endpoints
```http
GET /api/v1/employees/departments  # Get all departments
GET /api/v1/employees/titles       # Get all job titles
GET /api/v1/employees/locations    # Get all locations
```

#### Authentication
```http
POST /api/v1/auth/register         # Register new user
POST /api/v1/auth/login           # Login user
```

## 🗄️ Database Schema

### Employee Entity
```typescript
{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  location: string;
  avatar: string;
  hireDate: Date;
  salary: number;
  manager: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌐 Deployment

### Backend Deployment (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Configure Environment Variables in Vercel**
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `JWT_SECRET`: Your JWT secret key
- `ALLOWED_ORIGINS`: Comma-separated list of frontend domains
- `NODE_ENV`: production

3. **Deploy**
The backend will automatically deploy to Vercel and be available at:
`https://server-employee-directory-nestjs.vercel.app`

### Frontend Deployment (Vercel)

1. **Configure API endpoint** in your frontend to point to the deployed backend
2. **Deploy to Vercel** - your frontend will be available at:
`https://client-employee-directory-next.vercel.app`

## 🔒 Security

### Environment Variables
The following environment variables are **required** for the application to function properly:

- `JWT_SECRET`: A strong, unique secret key for JWT token signing
- `DATABASE_URL`: Database connection string (required in production)

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: User roles and permissions
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet middleware for additional security
- **Error Handling**: Secure error responses that don't leak sensitive information

### Best Practices
1. **Never commit secrets** to version control
2. **Use strong, unique JWT secrets** in production
3. **Regularly rotate** JWT secrets
4. **Monitor** application logs for security events
5. **Keep dependencies** updated to latest secure versions

## 🧪 Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Test deployment
node scripts/test-deployment.js

# Test CORS configuration
node scripts/test-cors.js
```

### API Testing
```bash
# Test Vercel deployment
node scripts/test-vercel.js
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 3001) | No |

### Database Configuration

The application supports two database types:

1. **SQLite** (Development)
   - File-based database
   - No additional setup required
   - Perfect for local development

2. **PostgreSQL** (Production)
   - Recommended: Neon PostgreSQL
   - Scalable and production-ready
   - Automatic connection pooling

## 📁 Project Structure

```
server-employee-directory-nestjs/
├── src/
│   ├── auth/                 # Authentication module
│   ├── employees/            # Employee management
│   ├── users/               # User management
│   ├── health/              # Health check endpoints
│   ├── common/              # Shared utilities
│   ├── config/              # Configuration
│   └── database/            # Database migrations
├── api/                     # Vercel serverless function
├── scripts/                 # Utility scripts
├── vercel.json             # Vercel configuration
└── package.json
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run migration:generate  # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage

# Linting
npm run lint               # Run ESLint
npm run lint:fix           # Fix linting issues
```

### Code Quality

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Jest** for testing

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers
- **Input Validation** with class-validator
- **SQL Injection Protection** with TypeORM

## 📊 Performance

- **Database Connection Pooling**
- **Request/Response Logging**
- **Optimized Queries** with TypeORM
- **Caching Strategies**
- **Compression** for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [API Documentation](https://server-employee-directory-nestjs.vercel.app/api/docs)
2. Review the logs in your deployment platform
3. Test the health endpoint: `https://server-employee-directory-nestjs.vercel.app/api/v1/health`
4. Open an issue in the repository

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality
- [ ] Mobile app (React Native)
- [ ] Multi-tenant support
- [ ] Advanced reporting features

---

**Built with ❤️ using NestJS, Next.js, and PostgreSQL** 