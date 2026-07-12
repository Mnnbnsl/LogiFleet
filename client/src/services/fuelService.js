import API from './api';

export const getFuelLogs = async () => {
  return API.get('/fuel-logs').then((res) => res.data);
};

export const createFuelLog = async (payload) => {
  return API.post('/fuel-logs', payload).then((res) => res.data);
};
