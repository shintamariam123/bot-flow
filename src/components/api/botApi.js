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

// Get bot by title
export const getBotByTitle = (title) => API.get(`/bots/${title}`);

// Delete bot by title
export const deleteBotByTitle = (title) => API.delete(`/bots/${title}`);
