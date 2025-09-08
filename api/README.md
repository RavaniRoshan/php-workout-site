# Workout Generator API Documentation

## Overview

The Workout Generator API provides AJAX endpoints for form validation, session management, and workout generation. This API enables the modern frontend to interact with the PHP backend through structured JSON requests and responses.

## Base URL

All API endpoints are relative to the application root:
```
/api/endpoints.php
```

## Authentication

The API uses PHP sessions for state management. No additional authentication is required as the application operates on a per-session basis.

## Common Headers

All requests should include:
```
Content-Type: application/json
X-Requested-With: XMLHttpRequest
```

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "timestamp": 1640995200
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details (optional)
    }
  },
  "timestamp": 1640995200
}
```

## Endpoints

### 1. Validate Step Data

Validates form data for a specific step without saving it.

**Endpoint:** `GET /api/endpoints.php?action=validate_step`

**Method:** `POST`

**Request Body:**
```json
{
  "step": 1,
  "data": {
    "name": "John Doe",
    "age": 25,
    "gender": "male"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Validation passed"
  }
}
```

**Error Response (Validation Failed):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": {
      "name": "Name must be at least 2 characters long",
      "age": "Age must be between 13 and 100"
    }
  }
}
```

### 2. Save Step Data

Validates and saves form data for a specific step to the session.

**Endpoint:** `GET /api/endpoints.php?action=save_step_data`

**Method:** `POST`

**Request Body:**
```json
{
  "step": 1,
  "data": {
    "name": "John Doe",
    "age": 25,
    "gender": "male"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "saved": true,
    "step": 1,
    "message": "Step data saved successfully"
  }
}
```

### 3. Get Session Data

Retrieves current session data including form progress and saved data.

**Endpoint:** `GET /api/endpoints.php?action=get_session_data`

**Method:** `GET`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "form_data": {
      "step_1": {
        "name": "John Doe",
        "age": 25,
        "gender": "male"
      },
      "current_step": 2,
      "last_updated": 1640995200
    },
    "user_preferences": null,
    "workout_plan": null,
    "session_id": "abc123def456"
  }
}
```

### 4. Generate Workout

Generates a workout plan from the saved form data.

**Endpoint:** `GET /api/endpoints.php?action=generate_workout`

**Method:** `POST`

**Request Body:**
```json
{}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "workout_plan": {
      "Full Body Workout 1": [
        "Push-ups",
        "Bodyweight Squats",
        "Plank"
      ]
    },
    "intensity": {
      "sets": 3,
      "reps": "10-15"
    },
    "user_preferences": {
      "name": "John Doe",
      "goal": "general_fitness",
      "fitness_level": "beginner"
    },
    "redirect_url": "workout.php"
  }
}
```

### 5. Clear Session

Clears all session data.

**Endpoint:** `GET /api/endpoints.php?action=clear_session`

**Method:** `POST`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "cleared": true,
    "message": "Session cleared successfully"
  }
}
```

## Form Step Validation Rules

### Step 1: Personal Information
- `name`: Required, minimum 2 characters
- `age`: Required, number between 13-100
- `gender`: Required, one of: 'male', 'female', 'other'

### Step 2: Fitness Goals
- `primary_goal`: Required, one of: 'muscle_gain', 'weight_loss', 'general_fitness', 'strength', 'endurance'
- `target_areas`: Required, array of target muscle groups

### Step 3: Experience Level
- `fitness_level`: Required, one of: 'beginner', 'intermediate', 'advanced'
- `years_active`: Optional, number between 0-50

### Step 4: Equipment Selection
- `equipment`: Required, array of equipment types
- Valid equipment: 'bodyweight', 'dumbbells', 'barbell', 'resistance_bands', 'kettlebells', 'machines', 'cables'

### Step 5: Preferences
- `days_per_week`: Required, number between 1-7
- `workout_duration`: Required, number between 15-180 (minutes)
- `intensity`: Optional, number between 1-10

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_ACTION` | Invalid or missing action parameter |
| `INVALID_INPUT` | Invalid JSON input |
| `VALIDATION_FAILED` | Form validation failed |
| `NO_FORM_DATA` | No form data found in session |
| `INCOMPLETE_DATA` | Required form data is missing |
| `GENERATION_ERROR` | Workout generation failed |

## Usage Examples

### JavaScript (using fetch)

```javascript
// Validate step data
async function validateStep(step, data) {
  try {
    const response = await fetch('/api/endpoints.php?action=validate_step', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ step, data })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Validation passed');
      return true;
    } else {
      console.log('Validation errors:', result.error.details);
      return false;
    }
  } catch (error) {
    console.error('API request failed:', error);
    return false;
  }
}

// Save step data
async function saveStepData(step, data) {
  const response = await fetch('/api/endpoints.php?action=save_step_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({ step, data })
  });
  
  return await response.json();
}

// Generate workout
async function generateWorkout() {
  const response = await fetch('/api/endpoints.php?action=generate_workout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({})
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Redirect to workout page or display results
    window.location.href = result.data.redirect_url;
  } else {
    console.error('Workout generation failed:', result.error.message);
  }
}
```

### Using the ApiClient utility

```javascript
import { apiClient } from './src/js/utils/api-client.js';

// Validate and save step
const result = await apiClient.validateAndSaveStep(1, {
  name: 'John Doe',
  age: 25,
  gender: 'male'
});

if (result.success) {
  console.log('Step saved successfully');
} else {
  console.log('Validation errors:', result.errors);
}

// Generate workout
try {
  const workout = await apiClient.generateWorkout();
  console.log('Workout generated:', workout);
} catch (error) {
  console.error('Error:', error.getUserMessage());
}
```

## Session Management

The API maintains form state across multiple requests using PHP sessions. Form data is stored in the session under the `form_data` key with the following structure:

```php
$_SESSION['form_data'] = [
  'step_1' => [...], // Step 1 data
  'step_2' => [...], // Step 2 data
  // ... other steps
  'current_step' => 3,
  'last_updated' => timestamp
];
```

## Backward Compatibility

The enhanced generator.php maintains backward compatibility with traditional form submissions while adding AJAX support. The same endpoint can handle both:

1. Traditional POST requests (redirects to workout.php)
2. AJAX requests (returns JSON response)

The request type is detected using the `X-Requested-With` header.

## Rate Limiting

Currently, no rate limiting is implemented. In a production environment, consider implementing rate limiting to prevent abuse.

## Security Considerations

1. All user input is sanitized using `htmlspecialchars()`
2. Form data is validated on both client and server side
3. Session data is automatically cleaned up when the session expires
4. CORS headers are configured for development (should be restricted in production)

## Testing

Use the provided JavaScript API client for testing endpoints:

```javascript
// Test all endpoints
async function testAPI() {
  try {
    // Clear session
    await apiClient.clearSession();
    
    // Test validation
    const validation = await apiClient.validateStep(1, {
      name: 'Test User',
      age: 25,
      gender: 'male'
    });
    
    console.log('Validation result:', validation);
    
    // Test save
    const save = await apiClient.saveStepData(1, {
      name: 'Test User',
      age: 25,
      gender: 'male'
    });
    
    console.log('Save result:', save);
    
    // Get session data
    const session = await apiClient.getSessionData();
    console.log('Session data:', session);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}
```