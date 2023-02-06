import axios from 'axios';


axios.interceptors.response.use((response) => response, (error) => {
  return Promise.resolve({
    data: error.response.data || {
      error: true,
      message: 'Network Error'
    },
  });
});

export const login = async (token: string) => {
  const res = await axios.get('/auth/login', {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });

  return res.data;
}
