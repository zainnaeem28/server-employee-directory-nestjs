# Deployment Guide - Employee Directory API

## Overview
This guide covers deploying the Employee Directory API to Vercel with Neon PostgreSQL database.

## Prerequisites
- Vercel account
- Neon PostgreSQL database
- Node.js 18+ installed locally

## Database Setup (Neon PostgreSQL)

### 1. Create Neon Database
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Note down the connection details:
   - Host: `ep-flat-union-ad69c43w-pooler.c-2.us-east-1.aws.neon.tech`
   - Database: `neondb`
   - Username: `neondb_owner`
   - Password: `npg_rw9RTgh5sbPt`

### 2. Connection String
Use this connection string for production:
```
postgres://neondb_owner:npg_rw9RTgh5sbPt@ep-flat-union-ad69c43w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Configure Environment Variables
Set these environment variables in Vercel dashboard:

**Required Variables:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = `postgres://neondb_owner:npg_rw9RTgh5sbPt@ep-flat-union-ad69c43w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- `JWT_SECRET` = `your-super-secret-jwt-key-change-in-production`
- `ALLOWED_ORIGINS` = `https://employee-directory-next.vercel.app,http://localhost:3000`

**Optional Variables:**
- `PORT` = `3001`
- `LOG_LEVEL` = `info`
- `JWT_EXPIRES_IN` = `24h`
- `THROTTLE_TTL` = `60000`
- `THROTTLE_LIMIT` = `100`

### 4. Deploy to Vercel
```bash
# Deploy
vercel --prod

# Or use the Vercel dashboard
# 1. Connect your GitHub repository
# 2. Set environment variables
# 3. Deploy
```

## Testing Deployment

### 1. Test Local Environment
```bash
# Test local SQLite setup
npm run test:deployment:local
```

### 2. Test Production Environment
```bash
# Test production PostgreSQL setup
npm run test:deployment:prod
```

### 3. Manual Testing
Test these endpoints after deployment:

**Health Check:**
```bash
curl https://your-vercel-app.vercel.app/api/v1/health
```

**API Endpoints:**
```bash
# Get employees
curl https://your-vercel-app.vercel.app/api/v1/employees

# Get departments
curl https://your-vercel-app.vercel.app/api/v1/employees/departments

# Swagger docs
curl https://your-vercel-app.vercel.app/api/docs
```

## Environment Configuration

### Local Development (.env)
```env
NODE_ENV=development
DB_TYPE=sqlite
DB_NAME=employee_directory.db
JWT_SECRET=your-local-secret
ALLOWED_ORIGINS=http://localhost:3000
```

### Production (Vercel Environment Variables)
```env
NODE_ENV=production
DATABASE_URL=postgres://neondb_owner:npg_rw9RTgh5sbPt@ep-flat-union-ad69c43w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-production-secret
ALLOWED_ORIGINS=https://employee-directory-next.vercel.app,http://localhost:3000
```

## Database Migration

The application uses TypeORM with `synchronize: true` for local development and `synchronize: false` for production. For production, you may want to run migrations:

```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify Neon database is active
   - Check SSL configuration

2. **CORS Errors**
   - Verify ALLOWED_ORIGINS includes your frontend URL
   - Check for trailing slashes

3. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check TypeScript compilation

### Logs
Check Vercel function logs in the dashboard for detailed error information.

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variable management
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use SSL connections
   - Restrict database access
   - Monitor connection logs

3. **API Security**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs

## Monitoring

### Health Endpoints
- `/api/v1/health` - Overall health status
- `/api/v1/health/ready` - Readiness check
- `/api/v1/health/live` - Liveness check

### Database Monitoring
Monitor Neon database metrics in the console:
- Connection count
- Query performance
- Storage usage

## Support

For issues:
1. Check Vercel function logs
2. Test with deployment script
3. Verify environment variables
4. Check database connectivity 