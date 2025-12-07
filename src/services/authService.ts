import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/graphql/';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const query = `mutation { login(input: { email: "${email}", password: "${password}" }) { success message token user { id username email firstName lastName } } }`;
    const response = await axios.post(API_URL, { query });
    return response.data.data.login;
  },

  register: async (email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    const query = `mutation { register(input: { email: "${email}", password: "${password}", firstName: "${firstName}", lastName: "${lastName}" }) { success message token user { id username email firstName lastName } } }`;
    const response = await axios.post(API_URL, { query });
    return response.data.data.register;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem('token');
    const query = `mutation { logout { success message } }`;
    const response = await axios.post(API_URL, { query }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data.logout;
  },

  getToken: () => localStorage.getItem('token'),
  
  setToken: (token: string) => localStorage.setItem('token', token),
  
  removeToken: () => localStorage.removeItem('token'),
  
  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: User) => localStorage.setItem('user', JSON.stringify(user)),
  
  removeUser: () => localStorage.removeItem('user'),
};
