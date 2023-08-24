import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AddUserDetails, EditUserDetails } from "../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";

const AddUser = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;

  console.log("Data from edit Manager", userData?.UserType);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("loginDetails", loginDetails?.logindata?.Token);

  console.log(userType);

  const [fullName, setFullName] = useState(
    userData?.Name ? userData?.Name : ""
  );
  const [address, setAddress] = useState(
    userData?.Address ? userData?.Address : ""
  );
  const [email, setEmail] = useState(userData?.Email ? userData?.Email : "");
  const [phone, setPhone] = useState(userData?.Phone ? userData?.Phone : "");
  const [userName, setUsername] = useState(
    userData?.Username ? userData?.Username : ""
  );
  const [password, setPassword] = useState(
    userData?.Password ? userData?.Password : ""
  );
  const [discountPercent, setDiscountPercent] = useState(
    userData?.DiscountPercent ? userData?.DiscountPercent : 0
  );
  const [monthlysettlement, setMonrhtlysettlement] = useState(
    userData?.MonthlySettlement ? userData?.MonthlySettlement : 0
  );

  const onsubmit = () => {
    if (
      fullName == "" ||
      address == "" ||
      email == "" ||
      phone == "" ||
      userName == "" ||
      password == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        firebaseUUID: "9876590",
        name: fullName,
        address: address,
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        userType: userType,
        discountPercent: discountPercent,
        monthlySettlement: monthlysettlement,
        isActive: 1,
      };

      dispatch(
        AddUserDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("User Added");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  const onSubmitEdit = () => {
    if (
      fullName == "" ||
      address == "" ||
      email == "" ||
      phone == "" ||
      userName == "" ||
      password == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        userId: userData?.Id,
        firebaseUUID: "9876590",
        name: fullName,
        address: address,
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        userType: userData?.UserType,
        discountPercent: discountPercent,
        monthlySettlement: monthlysettlement,
        userRef: userData?.Ref,
        isActive: 1,
      };

      dispatch(
        EditUserDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("User Edited");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="row">
        <h3 className="mb-4">Add User</h3>
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Full Name
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            defaultValue={userData?.Name}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Email
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            defaultValue={userData?.Email}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Phone
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Enter phone"
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={userData?.Phone}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Username
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            defaultValue={userData?.Username}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Password
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            defaultValue={userData?.Password}
          />
        </div>
        {userType == "5" ||
        userType == "6" ||
        userData?.UserType == "5" ||
        userData?.UserType == "6" ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Discount Percentage
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Discount Percentage"
              onChange={(e) => setDiscountPercent(e.target.value)}
              defaultValue={userData?.DiscountPercent}
            />
          </div>
        ) : (
          <></>
        )}
        {userType == "5" ||
        userType == "6" ||
        userData?.UserType == "5" ||
        userData?.UserType == "6" ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Monthly settlement
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Monthly settlement"
              onChange={(e) => setMonrhtlysettlement(e.target.value)}
              defaultValue={userData?.MonthlySettlement}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="col-lg-12 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Address
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter your address"
            onChange={(e) => setAddress(e.target.value)}
            defaultValue={userData?.Address}
          />
        </div>
      </div>
      {!userData ? (
        <div className="mt-5">
          <button onClick={onsubmit} className="btn btn-primary">
            Add user
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <button onClick={onSubmitEdit} className="btn btn-primary">
            Edit user
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
