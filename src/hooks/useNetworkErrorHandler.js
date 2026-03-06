import { useCallback } from 'react';
import { showNetworkError } from '../components/errorfeedback';

/**
 * Hook to handle network errors consistently across the application
 * @returns {Object} - Functions to handle network errors
 */
export const useNetworkErrorHandler = () => {
  /**
   * Handle fetch response errors
   * @param {Response} response - Fetch API response
   * @param {Function} retryFn - Function to call when retry is clicked
   * @returns {boolean} - Whether the response was an error that was handled
   */
  const handleFetchResponse = useCallback((response, retryFn) => {
    if (!response || !response.ok) {
      const statusCode = response?.status;
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
      
      showNetworkError(errorMessage, retryFn);
      return true;
    }
    return false;
  }, []);

  /**
   * Handle fetch errors (network failures, etc.)
   * @param {Error} error - Error object
   * @param {Function} retryFn - Function to call when retry is clicked
   * @returns {boolean} - Whether the error was handled
   */
  const handleFetchError = useCallback((error, retryFn) => {
    let errorMessage = "Network error. Please check your connection.";
    
    if (error.name === 'AbortError') {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showNetworkError(errorMessage, retryFn);
    return true;
  }, []);

  /**
   * Show a custom network error message
   * @param {string} message - Custom error message
   * @param {Function} retryFn - Function to call when retry is clicked
   */
  const showCustomNetworkError = useCallback((message, retryFn) => {
    showNetworkError(message, retryFn);
  }, []);

  return {
    handleFetchResponse,
    handleFetchError,
    showCustomNetworkError
  };
};

export default useNetworkErrorHandler; 