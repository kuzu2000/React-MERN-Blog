import {
  registerPending,
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginStart,
  loginFailure,
  updateUser,
} from './userSlice';

import { publicRequest, userRequest } from './requestMethod';

export const register = async (dispatch, user, navigate) => {
  dispatch(registerPending());
  try {
    const res = await publicRequest.post('/auth/register', user);
    dispatch(registerSuccess(res.data));
    navigate('/')
  } catch (error) {
    dispatch(registerFailure(error.response.data.message))
  }
};

export const login = async (dispatch, user, navigate) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post('/auth/login', user);
    dispatch(loginSuccess(res.data));
    navigate('/')
  } catch (error) {
    dispatch(loginFailure(error.response.data.message));
  }
};

export const updateAccount = async (dispatch, user, email, id) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.patch(`/auth/updateAccount/${id}`, user, email);
    dispatch(updateUser(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const update= async (dispatch, user, email, id) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.patch(`/auth/update/${id}`, user, email);
    dispatch(updateUser(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};
