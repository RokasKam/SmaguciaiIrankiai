import axios from 'axios';
import { API_ENDPOINTS_USER } from '../../constants/apiEndpoints';

const REACT_APP_API = 'https://localhost:7026/api';

const login = (loginInfo: { email: string; password: string }) =>
  axios.post(`${REACT_APP_API}${API_ENDPOINTS_USER.LOGIN}`, loginInfo);

const fetchUserInfo = (token: string) =>
  axios.get(`${REACT_APP_API}${API_ENDPOINTS_USER.GET_ME}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiService = {
  login,
  fetchUserInfo,
};
