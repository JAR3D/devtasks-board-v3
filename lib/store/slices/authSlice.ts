import { createSlice } from '@reduxjs/toolkit';

import { appLogout, appLogin, appRegister } from '../thunks/authThunks';

type TAuthState = {
  loggedIn: boolean;
};

const initialState: TAuthState = {
  loggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state) {
      state.loggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(appLogout.fulfilled, (state) => {
        state.loggedIn = false;
      })
      .addCase(appLogin.fulfilled, (state) => {
        state.loggedIn = true;
      })
      .addCase(appRegister.fulfilled, (state) => {
        state.loggedIn = true;
      });
  },
});

export const { setLoggedIn } = authSlice.actions;

export default authSlice.reducer;
