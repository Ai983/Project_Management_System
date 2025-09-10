import axios from 'axios';
import api from './api';
export const sendNotification = async (payload: {
  userId: string;
  message: string;
  taskId?: string;
  channel: 'email' | 'in-app';
}) => {
  
  return api.post('http://localhost:3000/notifications', payload, {
    
  });
};


