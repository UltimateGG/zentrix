import { Capacitor } from '@capacitor/core';
import axios from 'axios';

export const DEV = process.env.NODE_ENV === 'development' || Capacitor.DEBUG;
export const API_URL = DEV ? `${Capacitor.getPlatform() === 'android' ? '10.0.2.2' : 'localhost'}:5000` : 'zentrix.app';

export const LOGO_URL = 'https://zentrixapp.s3.us-east-2.amazonaws.com/static/logo192.png';
export const FALLBACK_IMAGE_URL = 'https://zentrixapp.s3.us-east-2.amazonaws.com/static/image_failed.png';

const api = axios.create({
  baseURL: `http${DEV ? '' : 's'}://${API_URL}`,
  withCredentials: true,
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
  const res = await api.get('/auth/login', {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });

  return res.data;
}

export const logout = async () => {
  const res = await api.get('/auth/logout');
  return res.data;
}

export const uploadFile = async (path: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(path, formData);
  return res.data;
}
