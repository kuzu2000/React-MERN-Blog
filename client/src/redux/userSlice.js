import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isFetching: false,
    isError: null,
    error: '',
  },
  reducers: {
    registerPending: (state) => {
      state.isFetching = true;
      state.isError = false;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isFetching = false;
      state.isError = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.isFetching = true;
      state.isError = false;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.isError = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isError = false;
      state.error = null;
      state.isFetching = false;
    },
  },
});

export const {
  registerPending,
  registerSuccess,
  registerFailure,
  registerError,
  loginError,
  loginSuccess,
  loginStart,
  loginFailure,
  updateUser,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
