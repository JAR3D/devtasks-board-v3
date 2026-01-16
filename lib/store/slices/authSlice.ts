import { createSlice } from '@reduxjs/toolkit';

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
    setLoggedOut(state) {
      state.loggedIn = false;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;

export default authSlice.reducer;
