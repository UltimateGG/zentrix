import { Capacitor } from '@capacitor/core';
import axios from 'axios';

export const DEV = process.env.NODE_ENV === 'development' || Capacitor.DEBUG;
const devIp = Capacitor.getPlatform() === 'android' ? '10.0.2.2' // android emulator tunnel
                        : Capacitor.getPlatform() === 'ios' ? process.env.REACT_APP_REMOTE_API
                        : 'localhost'; // web

export const API_URL = DEV ? `${devIp}:5000` : 'zentrix.app';

export const LOGO_URL = process.env.PUBLIC_URL + '/logo192.png';
export const FALLBACK_IMAGE_URL = process.env.PUBLIC_URL + '/image_failed.png';

const api = axios.create({
  baseURL: `http${DEV ? '' : 's'}://${API_URL}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zxtoken');
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  return Promise.resolve({
    data: error.response?.data || {
      error: true,
      message: 'Network Error'
    },
  });
});

export const loginWithGoogle = async (token: string) => {
  localStorage.removeItem('zxtoken');
  const res = await api.get('/auth/login', {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });

  if (res.data && res.data.token)
    localStorage.setItem('zxtoken', res.data.token);

  return res.data;
}

export const uploadFile = async (path: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(path, formData);
  return res.data;
}
