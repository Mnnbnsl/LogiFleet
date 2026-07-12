import API from '../api/axios';

export const getVehicles = async (params) => {
  return API.get('/vehicles', { params }).then((res) => res.data);
};

export const createVehicle = async (payload) => {
  return API.post('/vehicles', payload).then((res) => res.data);
};

export const updateVehicle = async (id, payload) => {
  return API.patch(`/vehicles/${id}`, payload).then((res) => res.data);
};

export const deleteVehicle = async (id) => {
  return API.delete(`/vehicles/${id}`).then((res) => res.data);
};
