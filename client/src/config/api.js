const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://university-clubs-production.up.railway.app' // Your Railway backend URL
  : 'http://localhost:5000';

export default API_BASE_URL;
