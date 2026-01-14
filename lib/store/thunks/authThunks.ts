import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { getRequestErrorMessage } from './helper';

type UserPayload = {
  email: string;
  password: string;
};

export const appLogout = createAsyncThunk<
  { ok: boolean },
  void,
  { rejectValue: string }
>('auth/logout', async (_payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      '/api/auth/logout',
      {},
      { withCredentials: true },
    );

    return response.data as { ok: boolean };
  } catch (err) {
    return rejectWithValue(getRequestErrorMessage(err));
  }
});

export const appLogin = createAsyncThunk<
  { ok: boolean },
  UserPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { email, password } = payload;

    const response = await axios.post(
      '/api/auth/login',
      { email: email.trim(), password },
      { withCredentials: true },
    );
    return response.data as { ok: boolean };
  } catch (err) {
    return rejectWithValue(getRequestErrorMessage(err));
  }
});

export const appRegister = createAsyncThunk<
  { ok: boolean },
  UserPayload,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { email, password } = payload;

    const response = await axios.post(
      '/api/auth/register',
      { email: email.trim(), password },
      { withCredentials: true },
    );
    return response.data as { ok: boolean };
  } catch (error) {
    return rejectWithValue(getRequestErrorMessage(error));
  }
});
