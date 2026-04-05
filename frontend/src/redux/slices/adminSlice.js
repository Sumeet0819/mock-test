import { createSlice } from '@reduxjs/toolkit';

const adminToken = localStorage.getItem('admin_token');

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    token: adminToken || null,
    isAuthenticated: !!adminToken,
    resultsCache: {},
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
      state.resultsCache = {};
      localStorage.removeItem('admin_token');
    },
    setTestResults(state, action) {
      const { testId, attempts } = action.payload;
      state.resultsCache[testId] = attempts;
    }
  },
});

export const { setAdmin, logoutAdmin, setTestResults } = adminSlice.actions;
export default adminSlice.reducer;
