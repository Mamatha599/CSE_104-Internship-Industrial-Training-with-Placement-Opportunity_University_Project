# API Specification

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

## Student Endpoints

### GET /api/students/profile
Get current student's profile (requires authentication).

### PUT /api/students/profile
Update student profile (requires authentication).

### GET /api/students/applications
Get student's applications (requires authentication).

### POST /api/students/applications/:opportunityId
Apply for an opportunity (requires authentication).

## Opportunity Endpoints

### GET /api/opportunities
Get all available opportunities.

### POST /api/opportunities
Create new opportunity (requires placement_cell or recruiter role).

### GET /api/opportunities/:id
Get specific opportunity details.

## Application Endpoints

### GET /api/applications
Get all applications (admin/faculty only).

### PUT /api/applications/:id/status
Update application status (faculty only).

## Analytics Endpoints

### GET /api/analytics/dashboard
Get dashboard analytics (placement_cell only).

### GET /api/analytics/placement-stats
Get placement statistics (placement_cell only).

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error info"],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```