import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

type TaskPayload = {
  title: string;
  description: string;
  status: TStatus;
  priority: TPriority;
  tags: string[];
};

export const createTask = createAsyncThunk(
  'tasks/create',
  async (payload: TaskPayload) => {
    const response = await axios.post('/api/tasks', payload);
    return response.data as ITaskDTO;
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: TaskPayload }) => {
    const response = await axios.patch(`/api/tasks/${id}`, data);
    return response.data as ITaskDTO;
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string) => {
    const response = await axios.delete(`/api/tasks/${id}`);
    if (!response.data?.ok) {
      throw new Error('Delete failed');
    }
    return id;
  },
);
