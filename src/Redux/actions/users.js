import api from "../../Service/api";

export const AddUserDetails = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.post("/core/user", data, { headers: { AuthToken: token } })
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
  api.CORE_PORT.put("/core/user", data, { headers: { AuthToken: token } })
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

    api.CORE_PORT.get(`/core/user?userType=${usertype}`, {
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

  api.CORE_PORT.delete(`/core/user?userId=${userId}`, {
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

export const getPackageDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/package", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get Package details ->", response.data);
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

export const AddPackageDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/package", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add package Details ->", response.data);
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

export const deletePackage =
  (token, packageId, callback) => async (dispatch) => {
    console.log(token);
    console.log(packageId);

    api.CORE_PORT.delete(`/core/package?packageId=${packageId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Package details ->", response.data);
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

export const editPackage = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.put("/core/package", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Edit package details -------------->", response.data);
      if (response.data?.Details) {
        console.log(response.data);
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

export const getCouponDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/coupon", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get coupon details ->", response.data);
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

export const deleteCoupon =
  (token, packageId, callback) => async (dispatch) => {
    console.log(token);
    console.log(packageId);

    api.CORE_PORT.delete(`/core/coupon?couponId=${packageId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Coupon details ->", response.data);
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

export const AddCouponDetails = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.post("/core/coupon", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Add Coupon Details ->", response.data);
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

export const EditCouponDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/coupon", data, { headers: { AuthToken: token } })
      .then((response) => {
        console.log("Edit Coupon Details ->", response.data);
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

export const getWebsiteDiscounts =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/websiteDiscount", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get website Discount details ->", response.data);
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

export const getPanleDiscounts =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/panelDiscount", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get Panel Discount details ->", response.data);
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

export const AddDiscountOnWebsiteDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/websiteDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add websiteDiscount Details ->", response.data);
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

export const AddDiscountOnPanelFn =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/panelDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add panel discount Details ->", response.data);
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

export const deleteWebsiteDiscount =
  (token, discountId, callback) => async (dispatch) => {
    console.log(token);
    console.log(discountId);

    api.CORE_PORT.delete(`/core/websiteDiscount?discountId=${discountId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Website discount details ->", response.data);
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

export const EditWebsiteDiscounts =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/websiteDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Edit website Discount Details ->", response.data);
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

export const EditPanelDiscounts =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/panelDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Edit Panel Discount Details ->", response.data);
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

export const getCouponsbyInitials =
  (token, initial, numeric, date, callback) => async (dispatch) => {
    api.CORE_PORT.get(
      `/core/couponByInitial?initial=${initial}&numeric=${numeric}&currentDate=${date}`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("Get Couponss ->", response.data);
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

export const getPanelDiscounts = (token, callback) => async (dispatch) => {
  api.CORE_PORT.get("/core/panelDiscount", {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Get panelDiscount ->", response.data);
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
