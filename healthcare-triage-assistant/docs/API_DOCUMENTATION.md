# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {}
}
```

## Error Handling
Errors include appropriate HTTP status codes:
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error

## Endpoints

### Auth Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 30,
  "gender": "male",
  "medicalHistory": ["diabetes"],
  "allergies": ["penicillin"]
}

Response (201):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "user": { ... }
}
```

#### Update Profile
```
PUT /auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "age": 31,
  "gender": "male",
  "medicalHistory": ["diabetes", "hypertension"],
  "allergies": ["penicillin"]
}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Chat Endpoints

#### Submit Symptoms
```
POST /chat/symptoms
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "symptoms": ["fever", "cough"],
  "severity": "moderate",
  "duration": "3 days",
  "onsetDate": "2024-01-15T00:00:00Z",
  "description": "Started after work exposure",
  "language": "en"
}

Response (200):
{
  "success": true,
  "data": {
    "report": {
      "id": "507f...",
      "riskLevel": "moderate",
      "confidence": 0.85,
      "reason": "Symptoms suggest need for medical evaluation"
    },
    "aiResponse": "Your symptoms...",
    "disclaimer": "⚠️ DISCLAIMER...",
    "recommendation": {
      "type": "doctor-consultation",
      "primary": "Schedule doctor consultation",
      "actions": [...],
      "followUp": "...",
      "timeframe": "24-48 hours"
    },
    "emergencyAlert": false,
    "emergencySymptoms": []
  }
}
```

#### Get Symptom History
```
GET /chat/history?limit=10&skip=0
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "reports": [...],
    "pagination": {
      "total": 5,
      "limit": 10,
      "skip": 0,
      "hasMore": false
    }
  }
}
```

#### Get Specific Report
```
GET /chat/report/{reportId}
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### RAG Endpoints

#### Search Documents
```
POST /rag/search
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "query": "fever and cough",
  "topK": 5,
  "language": "en"
}

Response (200):
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc-507f...",
        "title": "Influenza Symptoms",
        "content": "...",
        "relevanceScore": 0.92
      }
    ],
    "count": 5,
    "responseTime": 234
  }
}
```

#### Upload Document
```
POST /rag/upload
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "COVID-19 Symptoms",
  "category": "condition",
  "content": "Long medical document content...",
  "tags": ["covid", "respiratory", "pandemic"],
  "language": "en"
}

Response (201):
{
  "success": true,
  "data": {
    "documentId": "507f...",
    "pineconeId": "doc-507f..."
  }
}
```

### Classification Endpoints

#### Classify Symptoms
```
POST /classify/symptoms
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "symptoms": ["fever", "cough"],
  "severity": "moderate",
  "age": 30,
  "medicalHistory": []
}

Response (200):
{
  "success": true,
  "data": {
    "riskLevel": "moderate",
    "score": 3.5,
    "confidence": 0.7,
    "reason": "...",
    "rationale": "..."
  }
}
```

#### Detect Emergency
```
POST /classify/emergency
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "symptoms": ["chest pain", "difficulty breathing"],
  "description": "Sudden onset"
}

Response (200):
{
  "success": true,
  "data": {
    "isEmergency": true,
    "emergencySymptoms": ["chest pain", "difficulty breathing"],
    "recommendation": "🚨 SEEK IMMEDIATE EMERGENCY CARE..."
  }
}
```

### Recommendation Endpoints

#### Generate Recommendation
```
POST /recommendation/generate
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "riskLevel": "moderate",
  "symptoms": ["fever", "cough"],
  "severity": "moderate",
  "language": "en"
}

Response (200):
{
  "success": true,
  "data": {
    "type": "doctor-consultation",
    "primary": "Schedule doctor consultation",
    "actions": [...],
    "followUp": "...",
    "timeframe": "24-48 hours"
  }
}
```

### Audit Endpoints

#### Get User Logs
```
GET /audit/logs?limit=20&skip=0&action=symptom-intake
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "logs": [...],
    "pagination": { ... }
  }
}
```

#### Get Statistics
```
GET /audit/statistics?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "stats": [...],
    "riskStats": [...],
    "period": "Last 30 days"
  }
}
```

### Admin Endpoints

#### Get All Users
```
GET /admin/users?limit=20&skip=0
Authorization: Bearer <ADMIN_TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": { ... }
  }
}
```

#### Get Dashboard Statistics
```
GET /admin/dashboard?days=30
Authorization: Bearer <ADMIN_TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "users": { "total": 100, "new": 5 },
    "reports": { "total": 250, "new": 30, "emergencyCases": 3 },
    "riskDistribution": [...],
    "commonSymptoms": [...],
    "auditSummary": [...]
  }
}
```

## Rate Limiting

All endpoints are rate-limited to:
- **100 requests per 15 minutes** per IP address

## CORS

CORS is enabled for requests from `http://localhost:3000` (frontend URL)

## Security Headers

The API includes security headers via Helmet:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Best Practices

1. **Token Storage**: Store JWT tokens securely (httpOnly cookies if possible)
2. **Request Timeouts**: Set appropriate timeouts for API calls
3. **Error Handling**: Always handle errors gracefully
4. **Pagination**: Use pagination for large datasets
5. **Validation**: Validate all inputs on the client side before submission
