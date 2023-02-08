import axios from 'axios';


export const LOGO_URL = 'https://zentrixapp.s3.us-east-2.amazonaws.com/static/logo192.png';
export const FALLBACK_IMAGE_URL = 'https://zentrixapp.s3.us-east-2.amazonaws.com/static/image_failed.png';

axios.interceptors.response.use((response) => response, (error) => {
  return Promise.resolve({
    data: error.response.data || {
      error: true,
      message: 'Network Error'
    },
  });
});

export const loginWithGoogle = async (token: string) => {
  const res = await axios.get('/auth/login', {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });

  return res.data;
}

export const logout = async () => {
  const res = await axios.get('/auth/logout');
  return res.data;
}

export const uploadFile = async (path: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(path, formData);
  return res.data;
}
