# 📡 API Documentation

Complete API reference for the Naryn Clinic Queue System.

## 🔗 Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## 📋 General Information

### Response Format
All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔐 Authentication

### Doctor Login
Authenticate doctors to access the dashboard.

**Endpoint**: `POST /api/login-doctor`

**Request Body**:
```json
{
  "username": "doctor",
  "password": "1234",
  "department": "General"
}
```

**Response**:
```json
{
  "success": true,
  "doctor": {
    "id": 1,
    "name": "Dr. John Doe",
    "department": "General",
    "email": "doctor@clinic.kg"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## ⏰ Time Slots

### Get Time Slots
Retrieve available time slots for appointments.

**Endpoint**: `GET /api/timeslots`

**Query Parameters**:
- `day` (optional): Filter by date (YYYY-MM-DD)
- `department` (optional): Filter by department

**Example**: `GET /api/timeslots?day=2024-01-01&department=General`

**Response**:
```json
{
  "success": true,
  "timeSlots": [
    {
      "id": "1234567890",
      "department": "General",
      "time": "09:00",
      "day": "2024-01-01",
      "isAvailable": true,
      "maxPatients": 4,
      "currentBookings": 2,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Time Slot
Add a new time slot for appointments.

**Endpoint**: `POST /api/timeslots`

**Request Body**:
```json
{
  "department": "General",
  "time": "10:00",
  "day": "2024-01-01",
  "maxPatients": 4
}
```

**Response**:
```json
{
  "success": true,
  "timeSlot": {
    "id": "1234567891",
    "department": "General",
    "time": "10:00",
    "day": "2024-01-01",
    "isAvailable": true,
    "maxPatients": 4,
    "currentBookings": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Time Slot
Modify an existing time slot.

**Endpoint**: `PUT /api/timeslots/:id`

**Request Body**:
```json
{
  "isAvailable": false,
  "maxPatients": 6
}
```

**Response**:
```json
{
  "success": true,
  "timeSlot": {
    "id": "1234567890",
    "department": "General",
    "time": "09:00",
    "day": "2024-01-01",
    "isAvailable": false,
    "maxPatients": 6,
    "currentBookings": 2,
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Delete Time Slot
Remove a time slot from the system.

**Endpoint**: `DELETE /api/timeslots/:id`

**Response**:
```json
{
  "success": true,
  "message": "Time slot deleted successfully"
}
```

## 👥 Patients

### Register Patient
Register a new patient for an appointment.

**Endpoint**: `POST /api/register-patient`

**Request Body**:
```json
{
  "name": "John Doe",
  "department": "General",
  "time": "09:00",
  "day": "2024-01-01",
  "phone": "+996555123456",
  "email": "john.doe@email.com",
  "timeSlotId": "1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "patient": {
    "id": "1234567892",
    "name": "John Doe",
    "department": "General",
    "time": "09:00",
    "day": "2024-01-01",
    "phone": "+996555123456",
    "email": "john.doe@email.com",
    "timeSlotId": "1234567890",
    "queueNumber": 1,
    "status": "Waiting",
    "created_at": "2024-01-01T00:00:00.000Z",
    "timeSlot": {
      "id": "1234567890",
      "department": "General",
      "time": "09:00",
      "day": "2024-01-01",
      "isAvailable": true,
      "maxPatients": 4,
      "currentBookings": 3
    }
  }
}
```

### Get Patients
Retrieve list of patients with optional filtering.

**Endpoint**: `GET /api/patients`

**Query Parameters**:
- `day` (optional): Filter by date (YYYY-MM-DD)
- `department` (optional): Filter by department
- `status` (optional): Filter by status (Waiting, In Progress, Completed)
- `doctorId` (optional): Filter by doctor ID

**Example**: `GET /api/patients?day=2024-01-01&department=General&status=Waiting`

**Response**:
```json
{
  "success": true,
  "patients": [
    {
      "id": "1234567892",
      "name": "John Doe",
      "department": "General",
      "time": "09:00",
      "day": "2024-01-01",
      "phone": "+996555123456",
      "email": "john.doe@email.com",
      "timeSlotId": "1234567890",
      "queueNumber": 1,
      "status": "Waiting",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Patient Details
Retrieve detailed information about a specific patient.

**Endpoint**: `GET /api/patients/:id`

**Response**:
```json
{
  "success": true,
  "patient": {
    "id": "1234567892",
    "name": "John Doe",
    "department": "General",
    "time": "09:00",
    "day": "2024-01-01",
    "phone": "+996555123456",
    "email": "john.doe@email.com",
    "timeSlotId": "1234567890",
    "queueNumber": 1,
    "status": "Waiting",
    "position": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "timeSlot": {
      "id": "1234567890",
      "department": "General",
      "time": "09:00",
      "day": "2024-01-01",
      "isAvailable": true,
      "maxPatients": 4,
      "currentBookings": 3
    }
  }
}
```

### Update Patient
Update patient information or status.

**Endpoint**: `PUT /api/patients/:id`

**Request Body**:
```json
{
  "status": "In Progress"
}
```

**Response**:
```json
{
  "success": true,
  "patient": {
    "id": "1234567892",
    "name": "John Doe",
    "department": "General",
    "time": "09:00",
    "day": "2024-01-01",
    "phone": "+996555123456",
    "email": "john.doe@email.com",
    "timeSlotId": "1234567890",
    "queueNumber": 1,
    "status": "In Progress",
    "position": 1,
    "updated_at": "2024-01-01T12:00:00.000Z",
    "timeSlot": {
      "id": "1234567890",
      "department": "General",
      "time": "09:00",
      "day": "2024-01-01",
      "isAvailable": true,
      "maxPatients": 4,
      "currentBookings": 3
    }
  }
}
```

## 📊 Queue Management

### Call Next Patient
Advance the queue by calling the next patient.

**Endpoint**: `POST /api/call-next`

**Request Body**:
```json
{
  "day": "2024-01-01",
  "department": "General"
}
```

**Response**:
```json
{
  "success": true,
  "patient": {
    "id": "1234567892",
    "name": "John Doe",
    "department": "General",
    "time": "09:00",
    "day": "2024-01-01",
    "queueNumber": 1,
    "status": "In Progress",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Get Statistics
Retrieve clinic operation statistics.

**Endpoint**: `GET /api/stats`

**Query Parameters**:
- `day` (optional): Filter by date (YYYY-MM-DD)

**Example**: `GET /api/stats?day=2024-01-01`

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalPatients": 15,
    "waitingPatients": 8,
    "inProgressPatients": 2,
    "completedPatients": 5,
    "departmentStats": {
      "General": {
        "total": 8,
        "waiting": 4,
        "averageWaitTime": "15 min"
      },
      "Pediatrics": {
        "total": 4,
        "waiting": 2,
        "averageWaitTime": "10 min"
      },
      "Dentistry": {
        "total": 3,
        "waiting": 2,
        "averageWaitTime": "20 min"
      }
    }
  }
}
```

## 🔍 Health Check

### System Health
Check if the API server is running properly.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

## 📝 Data Models

### Time Slot
```json
{
  "id": "string",
  "department": "string",
  "time": "string",
  "day": "string",
  "isAvailable": "boolean",
  "maxPatients": "number",
  "currentBookings": "number",
  "created_at": "string",
  "updated_at": "string"
}
```

### Patient
```json
{
  "id": "string",
  "name": "string",
  "department": "string",
  "time": "string",
  "day": "string",
  "phone": "string",
  "email": "string",
  "timeSlotId": "string",
  "queueNumber": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Doctor
```json
{
  "id": "number",
  "name": "string",
  "department": "string",
  "email": "string"
}
```

## 🚨 Error Handling

### Common Error Responses

#### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name is required",
    "email": "Invalid email format"
  }
}
```

#### Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔧 Rate Limiting

The API implements rate limiting to prevent abuse:
- **100 requests per minute** per IP address
- **1000 requests per hour** per IP address

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🌐 CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS):
- **Allowed Origins**: Configurable per environment
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:3000';

// Login doctor
const loginDoctor = async (credentials) => {
  const response = await fetch(`${API_BASE}/api/login-doctor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  return await response.json();
};

// Get time slots
const getTimeSlots = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/api/timeslots?${params}`);
  
  return await response.json();
};
```

### Python
```python
import requests

API_BASE = 'http://localhost:3000'

def login_doctor(credentials):
    response = requests.post(f'{API_BASE}/api/login-doctor', json=credentials)
    return response.json()

def get_time_slots(filters=None):
    params = filters or {}
    response = requests.get(f'{API_BASE}/api/timeslots', params=params)
    return response.json()
```

### cURL
```bash
# Login doctor
curl -X POST http://localhost:3000/api/login-doctor \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","password":"1234","department":"General"}'

# Get time slots
curl "http://localhost:3000/api/timeslots?day=2024-01-01&department=General"
```

## 🔄 Versioning

API versioning follows semantic versioning:
- **v1.0.0**: Current stable version
- **Breaking changes**: Increment major version
- **New features**: Increment minor version
- **Bug fixes**: Increment patch version

Version information is available in the health check response.

## 📞 Support

For API support:
- **Documentation**: [API.md](API.md)
- **Issues**: [GitHub Issues](https://github.com/tattybubutashtanova/clinic-queue-system/issues)
- **Email**: api-support@clinic.kg

---

**Happy coding! 🚀**
