import { configureStore } from '@reduxjs/toolkit';

import tasksReducer from './slices/tasksSlice';
import tasksUiReducer from './slices/tasksUISlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tasksUi: tasksUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
