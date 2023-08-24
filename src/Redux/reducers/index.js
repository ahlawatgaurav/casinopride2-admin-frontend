// src/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import auth from "./auth";
import users from "./users";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: auth,
  users: users,

  // Add more reducers here
});

export default rootReducer;
