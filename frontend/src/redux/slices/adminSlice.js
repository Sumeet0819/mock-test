import { createSlice } from '@reduxjs/toolkit';

const adminToken = localStorage.getItem('admin_token');

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    token: adminToken || null,
    isAuthenticated: !!adminToken,
  },
  reducers: {
    setAdmin(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('admin_token', action.payload);
    },
    logoutAdmin(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_token');
    },
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
