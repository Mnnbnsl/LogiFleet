import API from '../api/axios';

export const getMaintenanceLogs = async (params) => {
  return API.get('/maintenance', { params }).then((res) => res.data);
};

export const createMaintenance = async (payload) => {
  return API.post('/maintenance', payload).then((res) => res.data);
};

export const closeMaintenance = async (id) => {
  return API.patch(`/maintenance/${id}/close`).then((res) => res.data);
};
