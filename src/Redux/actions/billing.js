import { compose } from "@reduxjs/toolkit";
import api from "../../Service/api";

export const AddBillingDetails =
  (token, data, callback) => async (dispatch) => {
    console.log("Data for add billing details---------->", data);
    api.BILLING_PORT.post("/billing/addBillingDetails", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Billin Details ---------->", response.data);
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

// export const GetBillingDetails =
//   (token, futureDate, shiftId, userId, callback) => async (dispatch) => {
//     const queryParams = {
//       futureDate: futureDate,
//       userId: userId,
//       shiftId: shiftId,
//     };

//     api.BILLING_PORT.get(`/billing/getBillingDetails`, {
//       headers: { AuthToken: token },
//     })
//       .then((response) => {
//         console.log("Get Billing Details ->", response.data);
//         if (response.data?.Details) {
//           console.log(response.data?.Details);
//           callback({
//             status: true,
//             response: response?.data,
//           });
//         } else if (response.data?.Error) {
//           callback({
//             status: false,
//             error: response.data?.Error?.ErrorMessage,
//           });
//         }
//       })
//       .catch((err) => {
//         {
//           console.log("error", err);
//         }
//       });
//   };

export const GetBillingDetails =
  (token, futureDate, userId, shiftId, billId, searchBillId, callback) =>
  async (dispatch) => {
    // const parsedBillId = parseInt(billId);
    // const parsedShiftId = parseInt(shiftId);
    // const parsedUserId = parseInt(userId);

    console.log("searchBillId--->", parseInt(searchBillId));

    api.BILLING_PORT.get(
      `/billing/getBillingDetails?billId=${parseInt(searchBillId)}&userId=${
        userId ? parseInt(userId) : 0
      }&billingDate=${futureDate}&shiftId=${shiftId ? parseInt(shiftId) : 0}`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("Get Billing Details -> ->", response.data);
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
