import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {},
    login: false,
  },
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      return { ...state, userData: user, login: true };
    },
    logOut: (state, action) => {
      return { ...state, userData: {}, login: false }
    }
  }
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;