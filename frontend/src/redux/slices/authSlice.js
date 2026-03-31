import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('user_auth') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored?.user || null,
    token: stored?.token || null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user_auth', JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user_auth');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
