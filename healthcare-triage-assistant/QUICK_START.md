# Installation & Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js v14+ installed
- [ ] npm or yarn installed
- [ ] MongoDB account (free tier okay)
- [ ] OpenAI API account (paid tier recommended)
- [ ] Pinecone account (free tier okay)
- [ ] Git installed

## Step-by-Step Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/healthcare-triage-assistant.git
cd healthcare-triage-assistant
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required .env variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-triage
JWT_SECRET=your-super-secret-key-change-this-in-production
OPENAI_API_KEY=sk-...your-openai-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENV=gcp-starter  # or your environment
PINECONE_INDEX=healthcare-triage
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Start backend:**
```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production mode
```

Backend will be available at: `http://localhost:5000`

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Optional: Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm start
```

Frontend will be available at: `http://localhost:3000`

## Verify Installation

### Backend Check
```bash
curl http://localhost:5000/health
# Should return: {"status":"API is running","timestamp":"..."}
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"testpass123",
    "age":30,
    "gender":"male"
  }'
```

### Access Application
1. Open browser: `http://localhost:3000`
2. Click "Register" or "Sign In"
3. Create account with test email
4. Navigate to "Symptom Checker"
5. Test symptom submission

## First Time Setup Tasks

### 1. Add Sample Medical Documents

```bash
cd backend

# Open Node REPL
node

# Paste this code:
const mongoose = require('mongoose');
const MedicalDocument = require('./models/MedicalDocument');
const sampleDocs = require('../sample-data/medical_documents.json');

mongoose.connect(process.env.MONGODB_URI);

MedicalDocument.insertMany(sampleDocs)
  .then(() => console.log('Sample documents added!'))
  .catch(err => console.error('Error:', err))
  .finally(() => mongoose.connection.close());
```

### 2. Create Admin User

```bash
# In MongoDB Atlas or local:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

### 3. Test RAG Integration

1. Login to application
2. Go to Chat page
3. Submit a symptom query
4. Check if AI response is generated

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Verify `MONGODB_URI` in `.env`
- Ensure IP whitelist in MongoDB Atlas
- Check internet connection

### Issue: OpenAI API Errors
**Solution:**
- Verify API key is correct
- Check API quota/billing
- Ensure account has access to GPT-4

### Issue: Pinecone Connection Failed
**Solution:**
- Verify API key and environment
- Create index named "healthcare-triage"
- Check Pinecone dashboard

### Issue: CORS Errors
**Solution:**
- Verify `FRONTEND_URL` in backend `.env`
- Frontend URL should be `http://localhost:3000`
- Restart backend after changes

### Issue: Port Already in Use
**Solution:**
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev

# Make changes and server auto-reloads
```

### Frontend Development
```bash
cd frontend
npm start

# Hot reload on save
```

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Database Operations

### Connect to MongoDB Atlas

```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/healthcare-triage"
```

### View Collections
```bash
show collections
db.users.find()
db.symptomreports.find()
db.medicaldocuments.find()
db.auditlogs.find()
```

### Clear All Data
```bash
db.dropDatabase()
```

## API Testing with Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "password":"password123",
    "age":30,
    "gender":"male"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123"
  }'

# Save the token from response
export TOKEN="eyJhbGc..."
```

### Submit Symptoms
```bash
curl -X POST http://localhost:5000/api/chat/symptoms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms":["fever","cough"],
    "severity":"moderate",
    "duration":"3 days",
    "onsetDate":"2024-01-15T00:00:00Z",
    "description":"After work exposure"
  }'
```

## Next Steps

1. **Customize Medical Documents** - Add your own in `sample-data/`
2. **Configure Emergency Keywords** - Edit in `backend/utils/helpers.js`
3. **Add More Languages** - Update language files in `frontend/src/context/LanguageContext.js`
4. **Deploy Application** - Follow `DEPLOYMENT_GUIDE.md`
5. **Setup Monitoring** - Configure logging and monitoring
6. **User Testing** - Gather feedback and iterate

## Support & Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)

## Questions or Issues?

1. Check existing GitHub issues
2. Create detailed bug report
3. Include system information and error logs
4. Provide steps to reproduce issue

Happy developing! 🚀
