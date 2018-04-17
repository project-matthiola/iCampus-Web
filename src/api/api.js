import axios from 'axios';

let base = 'http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus';

export const register = params => { return axios.post(`${base}/Member/`, params).then(res => res.data); };
export const requestLogin = params => { return axios.get(`${base}/Member/`, {params: params}); };
export const getUserList = params => { return axios.get(`${base}/Member/`, {params: params}); };
export const removeUser = params => { return axios.delete(`${base}/Member/`+params.id); };
export const editUser = params => { return axios.put(`${base}/Member/`+params.id, params); };

export const getActivities = params => { return axios.get(`${base}/Information/`, {params: params}); };
export const addActivities = params => { return axios.post(`${base}/Information/`, params).then(res => res.data); };
export const removeActivities = params => { return axios.delete(`${base}/Information/`+params.id); };
export const editActivities = params => { return axios.put(`${base}/Information/`+params.id, params); };

export const getCourses = params => { return axios.get(`${base}/Course/`, {params: params}); };
export const getSelections = params => { return axios.get(`${base}/Selection/`, {params: params}); };

export const getScores = params => { return axios.get(`${base}/Grade/`, {params: params}); };
export const initScores = params => { return axios.post(`${base}/Grade/`, params).then(res => res.data); };
export const editScore = params => { return axios.put(`${base}/Grade/`+params.id, params); };
