import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createTask,
  updateTask,
  deleteTask,
} from '@/lib/store/thunks/tasksThunks';

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
    // TODO: remove saveTask and removeTask
    removeTask(state, action: PayloadAction<string>) {
      return state.filter((task) => task._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.findIndex(
          (task) => task._id === action.payload._id,
        );
        if (index >= 0) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        return state.filter((task) => task._id !== action.payload);
      });
  },
});

export const { setTasks, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
