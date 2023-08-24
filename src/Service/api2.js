import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9004/api",
  headers: {
    Authorization: "Qm94d1I5MFA6U3BMSlQ1NFFk",
  },
});
