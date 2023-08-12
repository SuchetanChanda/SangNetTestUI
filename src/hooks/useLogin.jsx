import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [Loading, setLoading] = useState(false);
  const URL = 'http://localhost:8000';
  // const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const userData = async (userId) => {
    try {
      const data = await axios.get(`${URL}/accounts/profile/${userId}`);
      return data.data;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong!');
      }
      return null;
    }
  };

  const login = async (Email, Password) => {
    try {
      if (Email === '' || Password === '') {
        toast.warn('Please fill all the fields!');
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        `${URL}/accounts/login/`,
        {
          email: Email,
          password: Password,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      if (!data.data.is_verified) {
        toast.warn('Please verify your email!');
        navigate('/otp', { state: { email: Email } });
        return;
      }
      console.log('logged');
      toast.success('Logged in successfully!');

      localStorage.setItem('refresh', data.token.refresh);
      localStorage.setItem('access', data.token.access);
      localStorage.setItem('user_id', data.data.user_id);

      const User = await userData(data.data.user_id);
      dispatch({ type: 'LOGIN', payload: { ...User } });

      navigate('/', { state: { user_id: data.data.user_id } });
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 404) {
        console.log(error);
        navigate('/error');
      } else {
        toast.error('Something went wrong!');
      }
    }

    setLoading(false);
  };
  return { login, Loading };
};
