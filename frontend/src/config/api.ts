/**
 * Central API configuration
 * ใช้ VITE_API_URL จาก environment variable
 * - Development (.env): http://localhost:5000
 * - Production (.env.production): https://your-backend.onrender.com
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;
