import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCouponsbyInitials } from "../../Redux/actions/users";
import { AddBookingFn } from "../../Redux/actions/booking";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import PackagesPage from "../Pages/Packages/PackagePage";

const NewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  console.log("loginDetails-------------->", loginDetails);

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState(userData?.Email ? userData?.Email : "");
  const [phone, setPhone] = useState(userData?.Phone ? userData?.Phone : "");
  const [address, setAddress] = useState(
    userData?.Address ? userData?.Address : ""
  );
  const [totalGuestCount, settoalGuestCount] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [numberofteens, setNumberofteens] = useState("");
  const [settlementBycompany, setSettlementbycompany] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [governmentId, setgovernmentId] = useState("");
  const [gstNumber, setgstNumber] = useState("");
  const [amount, setamount] = useState("");
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState("");
  const [referredBy, setreferredBy] = useState("");

  const [discountToggle, setDiscountToggle] = useState(false);
  const [couponToggle, setCouponToggle] = useState(false);
  const [referredByToggle, setReferredByToggle] = useState(false);

  const handleToggle = (field) => {
    setDiscountToggle(field === "discount");
    setCouponToggle(field === "coupon");
    setReferredByToggle(field === "referredBy");
  };

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  const fetchCouponCodes = () => {
    dispatch(
      getCouponsbyInitials(loginDetails?.logindata?.Token, 4, (callback) => {
        if (callback.status) {
          // setLoading(false);
          console.log("Callback---------get coupons", callback?.response);
        }
      })
    );
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  console.log(formattedDate);

  useEffect(() => {
    fetchCouponCodes();
  }, [dispatch]);

  const separateInitials = () => {
    if (!couponCode) {
      toast.error("Coupon code is empty.");
      return;
    }

    const initialsMatch = couponCode.match(/^[A-Za-z]+/);
    const numericMatch = couponCode.match(/\d+$/);

    if (initialsMatch && numericMatch) {
      const initials = initialsMatch[0];
      const numericPart = numericMatch[0];
      dispatch(
        getCouponsbyInitials(
          loginDetails?.logindata?.Token,
          initials,
          numericPart,
          formattedDate,
          (callback) => {
            if (callback.status) {
              console.log(
                "Callback---------Coupun initail details",
                callback?.response
              );
              toast.success("Coupon is valid");
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    } else {
      toast.error("Coupon code format is invalid.");
    }
  };

  const onsubmit = () => {
    if (guestName == "" || phone == "") {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        guestName: guestName,
        address: address,
        phone: phone,
        email: email,
        dob: dateofbirth,
        country: selectedCountry?.name,
        state: selectedState?.name,
        city: selectedCity?.name,
        GSTNumber: gstNumber,
        governmentId: governmentId,
        totalGuestCount: totalGuestCount,
        numOfTeens: numberofteens,
        // discountId:2,
        // panelDiscountId:1,
        // couponId:1,
        referredBy: referredBy,
        settledByCompany: 0,
        packageId: JSON.stringify(packageIds),
        packageGuestCount: JSON.stringify(packageGuestCount),
        userId: loginDetails?.logindata?.userId,
        userTypeId: loginDetails?.logindata?.UserType,
        // futureDate:2023-10-25,
        shiftId: 1,
        actualAmount: amount,
        amountAfterDiscount: amount,
        isActive: 1,
      };

      console.log("data--------->", data);
      console.log("tojken--------->", loginDetails);

      dispatch(
        AddBookingFn(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            toast.success("Booking details success");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  console.log("numberofteens", numberofteens);
  console.log("totalGuestCount", totalGuestCount);

  return (
    <div>
      <ToastContainer />
      <div className="row">
        <h3 className="mb-4">New Booking</h3>

        <PackagesPage
          setamount={setamount}
          setPackageIds={setPackageIds}
          setPackageGuestCount={setPackageGuestCount}
          setNumberofteens={setNumberofteens}
          settoalGuestCount={settoalGuestCount}
        />
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Guest Name
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            placeholder="Full Name"
            onChange={(e) => setGuestName(e.target.value)}
            // defaultValue={userData?.Name}
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
          <label for="formGroupExampleInput " className="form_text mb-2">
            Country
          </label>
          <Select
            className="form-control"
            options={Country.getAllCountries()}
            getOptionLabel={(options) => {
              return options["name"];
            }}
            getOptionValue={(options) => {
              return options["name"];
            }}
            value={selectedCountry}
            onChange={(item) => {
              setSelectedCountry(item);
            }}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text mb-2">
            State
          </label>
          <Select
            className="form-control"
            options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
            getOptionLabel={(options) => {
              return options["name"];
            }}
            getOptionValue={(options) => {
              return options["name"];
            }}
            value={selectedState}
            onChange={(item) => {
              setSelectedState(item);
            }}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text mb-2">
            City
          </label>
          <Select
            className="form-control"
            options={City.getCitiesOfState(
              selectedState?.countryCode,
              selectedState?.isoCode
            )}
            getOptionLabel={(options) => {
              return options["name"];
            }}
            getOptionValue={(options) => {
              return options["name"];
            }}
            value={selectedCity}
            onChange={(item) => {
              setSelectedCity(item);
            }}
          />
        </div>

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

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            GST Details
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter GST number"
            onChange={(e) => setAddress(e.target.value)}
            defaultValue={userData?.Address}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Referred By
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Referred By"
            onChange={(e) => setAddress(e.target.value)}
            defaultValue={userData?.Address}
          />
        </div>

        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Total Guest Count
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder=" Total Guest Count"
            onChange={(e) => settoalGuestCount(e.target.value)}
            // defaultValue={userData?.Username}
          />
        </div> */}

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Settled by company
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder=" Total Guest Count"
            onChange={(e) => settoalGuestCount(e.target.value)}
            // defaultValue={userData?.Username}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Coupon Code
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Coupon Code"
            onChange={(e) => setCouponCode(e.target.value)}
            // defaultValue={userData?.Username}
          />
          <button onClick={separateInitials}>Check</button>
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Date of birth
          </label>
          <input
            class="form-control mt-2"
            type="date"
            placeholder="Enter Start Date"
            onChange={(e) => setDateofbirth(e.target.value)}
            // defaultValue={userData?.StartDate}
          />
        </div>
        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            No of teens
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder=" No of teens"
            onChange={(e) => setNumberofteens(e.target.value)}
            // defaultValue={userData?.Password}
          />
        </div> */}

        <div className="col-lg-6 mt-3">
          <div className="row">
            <div className="col-4">
              <label for="formGroupExampleInput " className="form_text">
                Dicount
              </label>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="discountSwitch"
                  checked={discountToggle}
                  onChange={() => handleToggle("discount")}
                />
              </div>
            </div>

            <div className="col-4">
              <label for="formGroupExampleInput " className="form_text">
                Coupon
              </label>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="couponSwitch"
                  checked={couponToggle}
                  onChange={() => handleToggle("coupon")}
                />
              </div>
            </div>

            <div className="col-4">
              <label for="formGroupExampleInput " className="form_text">
                Referred By
              </label>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="referredBySwitch"
                  checked={referredByToggle}
                  onChange={() => handleToggle("referredBy")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Settlement by company
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Settlement by company"
            onChange={(e) => setSettlementbycompany(e.target.value)}
            // defaultValue={userData?.Username}
          />
        </div> */}
      </div>
      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={onsubmit}
        >
          To payments
        </button>
      </div>
    </div>
  );
};

export default NewBooking;
