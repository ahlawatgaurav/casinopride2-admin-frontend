import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetailsAfterLogin: {},
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.userDetailsAfterLogin = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveLoginData } = userSlice.actions;

export default userSlice.reducer;
