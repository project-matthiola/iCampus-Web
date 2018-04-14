import axios from 'axios';

let base = 'http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus';

export const register = params => {return axios.post(`${base}/Member`, params).then(res => res.data); };
export const requestLogin = params => {return axios.get(`${base}/Member/`, {params: params}); };
export const getUserList = params => {return axios.get(`${base}/Member/`, {params: params}); };
export const removeUser = params => {return axios.delete(`${base}/Member/`, {params: params}); };
export const getActivities = params => {return axios.get(`${base}/Information/`, {params: params}); };
export const addActivities = params => {return axios.post(`${base}/Information`, params).then(res => res.data); };
