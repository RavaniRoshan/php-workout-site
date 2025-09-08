/**
 * API Client for Workout Generator AJAX Endpoints
 * Handles communication with PHP backend for form validation and workout generation
 */

class ApiClient {
    constructor() {
        this.baseUrl = window.location.origin;
        this.endpoints = {
            validate: '/api/endpoints.php?action=validate_step',
            saveStep: '/api/endpoints.php?action=save_step_data',
            getSession: '/api/endpoints.php?action=get_session_data',
            generateWorkout: '/api/endpoints.php?action=generate_workout',
            clearSession: '/api/endpoints.php?action=clear_session',
            legacyGenerate: '/generator.php'
        };
    }

    /**
     * Make HTTP request with proper error handling
     */
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    data.error?.code || 'HTTP_ERROR',
                    data.error?.message || `HTTP ${response.status}`,
                    response.status,
                    data.error?.details || {}
                );
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // Network or parsing errors
            throw new ApiError(
                'NETWORK_ERROR',
                'Failed to connect to server',
                0,
                { originalError: error.message }
            );
        }
    }

    /**
     * Validate form step data
     */
    async validateStep(step, data) {
        const response = await this.makeRequest(this.endpoints.validate, {
            method: 'POST',
            body: JSON.stringify({ step, data })
        });

        return response.data;
    }

    /**
     * Save step data to session
     */
    async saveStepData(step, data) {
        const response = await this.makeRequest(this.endpoints.saveStep, {
            method: 'POST',
            body: JSON.stringify({ step, data })
        });

        return response.data;
    }

    /**
     * Get current session data
     */
    async getSessionData() {
        const response = await this.makeRequest(this.endpoints.getSession);
        return response.data;
    }

    /**
     * Generate workout plan
     */
    async generateWorkout() {
        const response = await this.makeRequest(this.endpoints.generateWorkout, {
            method: 'POST',
            body: JSON.stringify({})
        });

        return response.data;
    }

    /**
     * Generate workout using legacy endpoint (for backward compatibility)
     */
    async generateWorkoutLegacy(formData) {
        const response = await this.makeRequest(this.endpoints.legacyGenerate, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        return response.data;
    }

    /**
     * Clear session data
     */
    async clearSession() {
        const response = await this.makeRequest(this.endpoints.clearSession, {
            method: 'POST'
        });

        return response.data;
    }

    /**
     * Validate and save step data in one call
     */
    async validateAndSaveStep(step, data) {
        try {
            // First validate
            await this.validateStep(step, data);
            
            // If validation passes, save the data
            const saveResult = await this.saveStepData(step, data);
            
            return {
                success: true,
                validated: true,
                saved: true,
                data: saveResult
            };
        } catch (error) {
            if (error.code === 'VALIDATION_FAILED') {
                return {
                    success: false,
                    validated: false,
                    saved: false,
                    errors: error.details
                };
            }
            throw error;
        }
    }

    /**
     * Get form progress from session
     */
    async getFormProgress() {
        try {
            const sessionData = await this.getSessionData();
            const formData = sessionData.form_data || {};
            
            return {
                currentStep: formData.current_step || 1,
                completedSteps: Object.keys(formData).filter(key => key.startsWith('step_')).length,
                lastUpdated: formData.last_updated || null,
                hasData: Object.keys(formData).length > 0
            };
        } catch (error) {
            console.warn('Failed to get form progress:', error);
            return {
                currentStep: 1,
                completedSteps: 0,
                lastUpdated: null,
                hasData: false
            };
        }
    }

    /**
     * Resume form from session data
     */
    async resumeForm() {
        try {
            const sessionData = await this.getSessionData();
            const formData = sessionData.form_data || {};
            
            if (!formData || Object.keys(formData).length === 0) {
                return null;
            }
            
            return {
                currentStep: formData.current_step || 1,
                stepData: formData,
                canResume: true
            };
        } catch (error) {
            console.warn('Failed to resume form:', error);
            return null;
        }
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(code, message, status = 0, details = {}) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.details = details;
    }

    /**
     * Check if error is a validation error
     */
    isValidationError() {
        return this.code === 'VALIDATION_FAILED';
    }

    /**
     * Check if error is a network error
     */
    isNetworkError() {
        return this.code === 'NETWORK_ERROR';
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage() {
        switch (this.code) {
            case 'VALIDATION_FAILED':
                return 'Please check your input and try again.';
            case 'NETWORK_ERROR':
                return 'Unable to connect to server. Please check your internet connection.';
            case 'GENERATION_ERROR':
                return 'Failed to generate workout. Please try again.';
            case 'NO_FORM_DATA':
                return 'No form data found. Please start over.';
            case 'INCOMPLETE_DATA':
                return 'Please complete all required fields.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export for use in other modules
export { apiClient, ApiError };

// Also make available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.ApiClient = ApiClient;
    window.apiClient = apiClient;
    window.ApiError = ApiError;
}