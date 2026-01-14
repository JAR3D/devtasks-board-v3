import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { getRequestErrorMessage } from './helper';

import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

type TaskPayload = {
  title: string;
  description: string;
  status: TStatus;
  priority: TPriority;
  tags: string[];
};

export const createTask = createAsyncThunk<
  ITaskDTO,
  TaskPayload,
  { rejectValue: string }
>('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/tasks', payload);
    return response.data as ITaskDTO;
  } catch (err) {
    return rejectWithValue(getRequestErrorMessage(err));
  }
});

export const updateTask = createAsyncThunk<
  ITaskDTO,
  { id: string; data: TaskPayload },
  { rejectValue: string }
>('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/tasks/${id}`, data);
    return response.data as ITaskDTO;
  } catch (err) {
    return rejectWithValue(getRequestErrorMessage(err));
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/tasks/${id}`);
    if (!response.data?.ok) {
      return rejectWithValue('Delete failed');
    }
    return id;
  } catch (error) {
    return rejectWithValue(getRequestErrorMessage(error));
  }
});
