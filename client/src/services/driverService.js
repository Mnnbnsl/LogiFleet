import API from '../api/axios';

export const getDrivers = async (params) => {
  return API.get('/drivers', { params }).then((res) => res.data);
};

export const createDriver = async (payload) => {
  return API.post('/drivers', payload).then((res) => res.data);
};

export const updateDriver = async (id, payload) => {
  return API.patch(`/drivers/${id}`, payload).then((res) => res.data);
};
