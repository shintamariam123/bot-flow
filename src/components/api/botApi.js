import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Save or update bot
export const saveOrUpdateBot = (botData) => API.post('/bots', botData);

export const saveOrUpdateMedia = (formData) => 
  API.post('/upload-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Get all bots
export const getAllBots = () => API.get('/bots');

//edit bot by id
// ** NEW: Get bot by ID **
export const getBotById = (id) => API.get(`/bots/${id}`); // Changed to :id in the route

// Delete bot by title
export const deleteBotByTitle = (title) => API.delete(`/bots/${title}`);
