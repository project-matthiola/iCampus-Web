import axios from 'axios';

let base = 'http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus';

export const register = params => {return axios.post(`${base}/User`, params).then(res => res.data); };

