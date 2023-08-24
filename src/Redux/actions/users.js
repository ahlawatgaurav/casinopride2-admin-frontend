import api2 from "../../Service/api2";

export const AddUserDetails = (data, token, callback) => async (dispatch) => {
  api2
    .post("/core/user", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Add user details ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const EditUserDetails = (data, token, callback) => async (dispatch) => {
  api2
    .put("/core/user", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Edit user details ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const getUserDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api2
      .get(`/core/user?userType=${usertype}`, {
        headers: { AuthToken: token },
      })
      .then((response) => {
        console.log("Get users details ->", response.data);
        if (response.data?.Details) {
          console.log(response.data?.Details);
          callback({
            status: true,
            response: response?.data,
          });
        } else if (response.data?.Error) {
          callback({
            status: false,
            error: response.data?.Error?.ErrorMessage,
          });
        }
      })
      .catch((err) => {
        {
          console.log("error", err);
        }
      });
  };

export const deleteUser = (token, userId, callback) => async (dispatch) => {
  console.log(token);
  console.log(userId);

  api2
    .delete(`/core/user?userId=${userId}`, {
      headers: { AuthToken: token },
    })
    .then((response) => {
      console.log("Delete users details ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({
          status: false,
          error: response.data?.Error?.ErrorMessage,
        });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};
