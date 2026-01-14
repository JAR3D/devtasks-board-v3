import { configureStore } from '@reduxjs/toolkit';

import tasksReducer from './slices/tasksSlice';
import tasksUiReducer from './slices/tasksUISlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tasksUi: tasksUiReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
