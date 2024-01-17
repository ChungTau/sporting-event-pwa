import { Dispatch } from 'redux';
import { setLoggedIn, setToken } from '../store/authSlice';
import api from '../config/api';

export const login = async (credentials: { email: string, password: string }, dispatch: Dispatch) => {
  try {
    const response = await api.post('/login', credentials);

    const { token } = response.data;

    localStorage.setItem('token', token);

    dispatch(setLoggedIn(true));
    dispatch(setToken(token));
  } catch (error) {
  }
};

export const logout = (dispatch: Dispatch) => {
  localStorage.removeItem('token');
  dispatch(setLoggedIn(false));
  dispatch(setToken(null));
};
