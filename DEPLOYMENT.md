# 🚀 Deployment Guide

This guide covers deploying the Naryn Clinic Queue System to various environments.

## 📋 Prerequisites

### System Requirements
- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: Minimum 1GB available space
- **Network**: Internet connection for dependencies

### Platform Support
- ✅ Linux (Ubuntu, CentOS, Debian)
- ✅ macOS (Intel and Apple Silicon)
- ✅ Windows (Windows 10/11)

## 🏗️ Build Process

### 1. Prepare the Application

```bash
# Clone the repository
git clone https://github.com/tattybubutashtanova/clinic-queue-system.git
cd clinic-queue-system

# Install dependencies
npm install

# Run tests (if available)
npm test
```

### 2. Build for Production

```bash
# Create production build
npm run build

# Verify build output
ls -la build/
```

The build process creates an optimized `build/` directory with:
- Compressed JavaScript bundles
- Optimized CSS files
- Static assets (images, icons)
- HTML entry point

## 🌐 Deployment Options

### Option 1: Simple Node.js Deployment

#### Setup
```bash
# Set production environment
export NODE_ENV=production
export PORT=3000

# Start the application
npm start
```

#### Process Management with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "clinic-queue"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

#### PM2 Configuration File
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'clinic-queue',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Option 2: Docker Deployment

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Commands
```bash
# Build Docker image
docker build -t clinic-queue-system .

# Run container
docker run -d -p 3000:3000 --name clinic-queue clinic-queue-system

# View logs
docker logs clinic-queue
```

#### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  clinic-queue:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

### Option 3: Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create clinic-queue-system

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

# Deploy
git push heroku main
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=build
```

## 🔧 Environment Configuration

### Production Environment Variables
Create `.env.production`:
```env
NODE_ENV=production
PORT=3000
API_URL=https://your-domain.com
JWT_SECRET=your_super_secure_jwt_secret_here
```

### Security Considerations
- Use strong JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Set up monitoring and logging
- Regular security updates

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# With PM2
pm2 monit

# View logs
pm2 logs clinic-queue

# Restart application
pm2 restart clinic-queue
```

### Log Management
Create log directory:
```bash
mkdir -p logs
touch logs/err.log logs/out.log logs/combined.log
```

### Health Checks
```bash
# Application health
curl https://your-domain.com/api/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🔒 SSL/HTTPS Setup

### Using Nginx Reverse Proxy
Create `/etc/nginx/sites-available/clinic-queue`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build --analyze

# Source maps for debugging
npm run build -- --source-map
```

### Caching Strategy
- Enable browser caching for static assets
- Use CDN for static files
- Implement API response caching
- Database query optimization

### Load Balancing
```nginx
upstream clinic_queue {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://clinic_queue;
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to server
      run: |
        # Your deployment script here
        scp -r build/* user@server:/var/www/clinic-queue/
        ssh user@server 'pm2 restart clinic-queue'
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Memory Issues
```bash
# Check memory usage
pm2 monit

# Restart with increased memory
pm2 delete clinic-queue
pm2 start server.js --name "clinic-queue" --max-memory-restart 1024
```

#### Build Failures
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Health Check Script
Create `health-check.sh`:
```bash
#!/bin/bash

response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

if [ $response -eq 200 ]; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is unhealthy (HTTP $response)"
    pm2 restart clinic-queue
    exit 1
fi
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Implement session management
- Database connection pooling

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Monitor performance metrics

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables set
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring tools in place
- [ ] Backup strategy implemented
- [ ] Security measures enabled
- [ ] Performance testing completed
- [ ] Error logging configured
- [ ] Health checks working
- [ ] Documentation updated

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs clinic-queue`
- Verify environment: `pm2 env clinic-queue`
- Monitor performance: `pm2 monit`
- Review documentation: [README.md](README.md)

---

**Happy deploying! 🚀**
