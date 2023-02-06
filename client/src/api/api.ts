import axios from 'axios';


axios.interceptors.response.use((response) => response, (error) => {
  return Promise.resolve({
    data: error.response.data || {
      error: true,
      message: 'Network Error'
    },
  });
});

export const getAuthToken = async (token: string) => {
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
