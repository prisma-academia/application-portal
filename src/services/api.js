import { showNetworkError } from '../components/errorfeedback';

/**
 * Base API service with error handling
 */
class ApiService {
  /**
   * Makes a fetch request with proper error handling
   * 
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @param {Function} retryFn - Function to call when retry is clicked
   * @returns {Promise<Object>} - The response data
   */
  static async fetchWithErrorHandling(url, options = {}, retryFn = null) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      });

      // Handle HTTP error responses
      if (!response.ok) {
        const statusCode = response.status;
        let errorMessage = "Unable to connect to the server.";
        
        if (statusCode === 401) {
          errorMessage = "Your session has expired. Please log in again.";
        } else if (statusCode === 403) {
          errorMessage = "You don't have permission to access this resource.";
        } else if (statusCode === 404) {
          errorMessage = "The requested resource was not found.";
        } else if (statusCode === 503) {
          errorMessage = "The application window is currently closed. No active application session.";
        } else if (statusCode === 500) {
          errorMessage = "An internal server error occurred. Please try again later.";
        } else if (statusCode >= 400) {
          errorMessage = "An error occurred while processing your request.";
        }
        
        // Try to get more specific error message from response
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If parsing fails, use status text
          if (response.statusText) {
            errorMessage = response.statusText;
          }
        }
        
        // Show the error in the global modal
        showNetworkError(errorMessage, retryFn);
        throw new Error(errorMessage);
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network errors
      if (!error.status) { // Not an HTTP error
        const errorMessage = error.message || "Network error. Please check your connection.";
        showNetworkError(errorMessage, retryFn);
      }
      
      throw error;
    }
  }
}

export default ApiService; 