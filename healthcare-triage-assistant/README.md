# Healthcare Triage AI Assistant

A comprehensive full-stack AI-powered healthcare triage system that helps users assess their symptoms and receive intelligent recommendations using Retrieval-Augmented Generation (RAG) technology.

## 🚀 Features

- **AI-Powered Symptom Analysis**: Leverages OpenAI's GPT-4 for intelligent health assessments
- **Retrieval-Augmented Generation (RAG)**: Searches medical knowledge base stored in Pinecone vector database
- **Multi-Risk Classification**: Categorizes symptoms into Low, Moderate, High, and Emergency levels
- **Intelligent Recommendations**: Provides actionable health guidance based on symptom severity
- **Emergency Detection**: Automatically flags critical symptoms and emergency warnings
- **Multilingual Support**: Available in English, Hindi, and Telugu
- **User Authentication**: Secure JWT-based authentication system
- **Health History Tracking**: Maintains detailed records of user assessments
- **Admin Dashboard**: Comprehensive analytics and system monitoring
- **Audit Logging**: Complete tracking of all user interactions and AI responses

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB (user data, reports, documents)
- **Vector DB**: Pinecone (medical document embeddings)
- **AI/LLM**: OpenAI GPT-4
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **Icons**: React Icons
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API Key
- Pinecone API Key
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone and Navigate to Project
```bash
cd healthcare-triage-assistant
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your API keys and database credentials:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Your secret key for JWT
# - OPENAI_API_KEY: Your OpenAI API key
# - PINECONE_API_KEY: Your Pinecone API key
# - PINECONE_ENV: Your Pinecone environment
# - PINECONE_INDEX: Your Pinecone index name

# Start the backend server
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
- **POST** `/register` - Register new user
- **POST** `/login` - Login user
- **GET** `/profile` - Get user profile (protected)
- **PUT** `/profile` - Update user profile (protected)

### Chat/Symptom Routes (`/api/chat`)
- **POST** `/symptoms` - Submit symptom intake (protected)
- **GET** `/history` - Get user's symptom history (protected)
- **GET** `/report/:reportId` - Get specific report (protected)

### RAG Routes (`/api/rag`)
- **POST** `/upload` - Upload medical document (protected)
- **POST** `/search` - Search medical documents (protected)
- **GET** `/documents` - Get all documents (protected)
- **GET** `/documents/:documentId` - Get specific document (protected)
- **DELETE** `/documents/:documentId` - Delete document (protected)

### Classification Routes (`/api/classify`)
- **POST** `/symptoms` - Classify symptoms (protected)
- **POST** `/emergency` - Detect emergency symptoms (protected)

### Recommendation Routes (`/api/recommendation`)
- **POST** `/generate` - Generate health recommendations (protected)

### Audit Routes (`/api/audit`)
- **GET** `/logs` - Get user audit logs (protected)
- **GET** `/statistics` - Get user statistics (protected)

### Admin Routes (`/api/admin`)
- **GET** `/users` - Get all users (admin only)
- **GET** `/dashboard` - Get dashboard statistics (admin only)
- **GET** `/audit-logs` - Get all audit logs (admin only)
- **PATCH** `/users/:userId/promote` - Promote user to admin (admin only)

## 📊 Database Schema

### Users Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  gender: String,
  medicalHistory: [String],
  allergies: [String],
  language: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### SymptomReports Collection
```javascript
{
  userId: ObjectId,
  symptoms: [String],
  severity: String,
  duration: String,
  onsetDate: Date,
  description: String,
  riskLevel: String,
  recommendation: String,
  aiResponse: String,
  retrievedDocuments: [Object],
  emergencyFlags: [String],
  followUpNeeded: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### MedicalDocuments Collection
```javascript
{
  title: String,
  content: String,
  category: String,
  source: String,
  tags: [String],
  pineconeId: String,
  embedding: [Number],
  language: String,
  uploadedBy: ObjectId,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLogs Collection
```javascript
{
  userId: ObjectId,
  action: String,
  userQuery: String,
  retrievedDocuments: [Object],
  aiResponse: String,
  riskClassification: String,
  recommendation: String,
  emergencyFlagsDetected: [String],
  responseTime: Number,
  modelUsed: String,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload build folder to Vercel or Netlify
```

## 🔐 Security Considerations

1. **Environment Variables**: Store sensitive data in `.env` files
2. **JWT Tokens**: Tokens expire after 7 days
3. **Password Hashing**: Bcrypt with salt rounds = 10
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Configured to only accept requests from frontend URL
6. **HELMET**: Provides security headers
7. **Input Validation**: All inputs validated with Joi
8. **SQL Injection**: Protected via Mongoose ORM

## 📝 Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "age": 30,
    "gender": "male"
  }'
```

### Submit Symptom Intake
```bash
curl -X POST http://localhost:5000/api/chat/symptoms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fever", "cough"],
    "severity": "moderate",
    "duration": "3 days",
    "onsetDate": "2024-01-15",
    "description": "Started after exposure to sick colleague",
    "language": "en"
  }'
```

## 🎓 Sample Medical Documents

The `sample-data` folder contains example medical documents for indexing:
- Common cold information
- Flu symptoms and management
- Pneumonia recognition
- Fever management
- Respiratory infections

Upload these to populate your medical knowledge base.

## 📞 Emergency Keywords

The system automatically detects these critical symptoms:
- Chest pain
- Difficulty breathing
- Stroke symptoms (facial drooping, slurred speech, arm weakness)
- Severe bleeding
- Loss of consciousness
- Anaphylaxis
- And more...

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Disclaimer

**This Healthcare Triage Assistant is NOT a medical device and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment.**

- Always consult with a qualified healthcare professional
- In case of emergencies, call 911 or your local emergency number
- The AI provides general information only
- Individual results may vary

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Pinecone for vector database
- MongoDB for data persistence
- React team for amazing frontend framework
