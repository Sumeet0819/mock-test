import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import testReducer from './slices/testSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    test: testReducer,
  },
});
