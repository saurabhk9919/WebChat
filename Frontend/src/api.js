import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

// Set axios defaults so existing relative calls ("/api/...") use the production backend
axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

export { axios };
