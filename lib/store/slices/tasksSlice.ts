import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ITaskDTO } from '@/lib/types/taskTypes';

type TTasksState = ITaskDTO[];

const initialState: TTasksState = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<ITaskDTO[]>) {
      return action.payload;
    },
    upsertTask(state, action: PayloadAction<ITaskDTO>) {
      const index = state.findIndex((task) => task._id === action.payload._id);

      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.unshift(action.payload);
      }
    },
    removeTask(state, action: PayloadAction<string>) {
      return state.filter((task) => task._id !== action.payload);
    },
  },
});

export const { setTasks, upsertTask, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
