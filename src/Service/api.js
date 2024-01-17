import axios from "axios";

const api = {
  BILLING_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_BILLING_PORT}/api`,
    headers: {
      Authorization:process.env.AUTHORIZATION,
    },
  }),

  BOOKING_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_BOOKING_PORT}/api`,
    headers: {
      Authorization: process.env.AUTHORIZATION,
    },
  }),

  CORE_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CORE_PORT}/api`,
    headers: {
      Authorization: process.env.AUTHORIZATION,
    },
  }),

  AUTH_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_AUTH_PORT}/api`,
    headers: {
      Authorization: process.env.AUTHORIZATION,
    },
  }),
};

export default api;
