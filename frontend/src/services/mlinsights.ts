import axios from 'axios';
import api from './api';

export const predictDelay = async (taskId: string) => {
  
  const res = await api.post(
    'http://localhost:3000/mlinsights/predict-delay',
    { taskId },
    
  );
  return res.data; // { delayRisk: number }
};

