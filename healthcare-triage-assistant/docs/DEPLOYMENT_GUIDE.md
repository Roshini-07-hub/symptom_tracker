# Deployment Guide

## Backend Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set OPENAI_API_KEY=your_openai_key
   heroku config:set PINECONE_API_KEY=your_pinecone_key
   heroku config:set PINECONE_ENV=your_pinecone_env
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean Deployment

1. **Create Droplet**
   - Choose Ubuntu 20.04 LTS
   - Install Node.js and npm

2. **Clone Repository**
   ```bash
   git clone <repo-url>
   cd healthcare-triage-assistant/backend
   ```

3. **Install PM2**
   ```bash
   npm install -g pm2
   ```

4. **Start Application**
   ```bash
   pm2 start server.js --name "health-triage"
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
       }
   }
   ```

### Option 3: AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS AMI
   - Configure security groups to allow HTTP, HTTPS, SSH

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd healthcare-triage-assistant/backend
   npm install
   ```

4. **Setup Environment**
   ```bash
   nano .env  # Add your configuration
   ```

5. **Install and Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

## Frontend Deployment

### Option 1: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, add `REACT_APP_API_URL`

### Option 2: Netlify Deployment

1. **Build Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

3. **Or Drag & Drop**
   - Go to netlify.com
   - Drag and drop the `build` folder

### Option 3: AWS S3 + CloudFront

1. **Build Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload Build**
   ```bash
   aws s3 sync build/ s3://your-bucket-name
   ```

4. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure SSL certificate

## Database Setup

### MongoDB Atlas (Cloud)

1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to `MONGODB_URI` environment variable

### Local MongoDB

1. Install MongoDB
2. Start service: `mongod`
3. Use connection string: `mongodb://localhost:27017/healthcare-triage`

## Pinecone Setup

1. Go to pinecone.io
2. Create free project
3. Create index with name "healthcare-triage"
4. Get API key and environment
5. Add to environment variables

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 logs
pm2 monit
```

### Application Logging

Logs are generated in the application and can be viewed with:
```bash
tail -f /path/to/app/logs/error.log
```

## Performance Optimization

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Use CDN for assets
- Implement code splitting

### Backend
- Enable caching
- Use database indexes
- Implement pagination
- Use connection pooling

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/healthcare-triage" --out backup/

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/healthcare-triage" backup/
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Issues
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly

### Database Connection Issues
- Verify MongoDB URI
- Check firewall/security group rules
- Test connection with MongoDB Compass

### API Rate Limiting
- Check if hitting rate limit
- Adjust limits in environment variables
- Implement request queuing on client

## Maintenance

### Regular Updates
```bash
cd backend
npm update
npm audit fix
```

### Database Optimization
```bash
# MongoDB index analysis
db.collection.aggregate([{ $indexStats: {} }])
```

### Log Rotation
```bash
# Use logrotate for server logs
sudo logrotate -f /etc/logrotate.conf
```
