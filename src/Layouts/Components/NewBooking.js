import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getCouponsbyInitials,
  getPanelDiscounts,
  EditUsedCoupon,
} from "../../Redux/actions/users";
import { AddBookingFn } from "../../Redux/actions/booking";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import PackagesPage from "../Pages/Packages/PackagePage";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

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
  const [couponId, setCouponId] = useState("");

  const [discountToggle, setDiscountToggle] = useState(false);
  const [couponToggle, setCouponToggle] = useState(false);
  const [referredByToggle, setReferredByToggle] = useState(false);

  const [panelDiscounts, setPanelDiscounts] = useState("");

  const [usedCouponArr, setUsedCouponArr] = useState([]);

  const [remainingCoupons, setRemainingCoupons] = useState("");
  const [bookingData, setBookingData] = useState("");
  const [couponDiscount, setCouponDiscout] = useState("");
  const [totalteensPrice, setTotalTeensPrice] = useState("");

  const [teenpackageId, setTeenPackageId] = useState("");

  const handleToggle = (field) => {
    // Toggle the state of the corresponding field
    if (field === "discount") {
      setDiscountToggle(!discountToggle); // Toggle the state
      if (!discountToggle) {
        // If the discount toggle is being enabled, disable the others
        setCouponToggle(false);
        setReferredByToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
      } else if (discountToggle) {
        setamountAfterDiscount("");
        setCouponDiscout("");
      }
    } else if (field === "coupon") {
      setCouponToggle(!couponToggle);
      if (!couponToggle) {
        setDiscountToggle(false);
        setReferredByToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
      } else if (couponToggle) {
        setCouponDiscout("");
      }
    } else if (field === "referredBy") {
      setReferredByToggle(!referredByToggle);
      if (!referredByToggle) {
        setDiscountToggle(false);
        setCouponToggle(false);
        setCouponCode("");
        setSelectedOption("");
      }
    }
  };

  console.log("couponCode--------------->", couponCode);

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
          console.log("Callback---------get coupons", callback?.response);
        }
      })
    );
  };

  const fetchPanelDiscounts = () => {
    dispatch(
      getPanelDiscounts(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          setPanelDiscounts(callback?.response?.Details);
          console.log(
            "Panel Discounts----------------------->",
            callback?.response?.Details
          );
        }
      })
    );
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    fetchCouponCodes();
    fetchPanelDiscounts();
  }, [dispatch]);

  const separateInitials = () => {
    console.log("couponCode---------------->", couponCode);
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
                "Coupon Details ---------->",
                callback?.response?.Details
              );

              const discount =
                (amount * callback?.response?.Details?.CouponDiscount) / 100;
              const discountedAmount = amount - discount;
              setCouponDiscout(discountedAmount);

              setRemainingCoupons(
                callback?.response?.Details?.RemainingCoupons
              );
              setCouponId(callback?.response?.Details?.Id);
              setUsedCouponArr(
                callback?.response?.Details?.UsedCoupons.slice(1, -1).split(",")
              );

              const inputString = callback?.response?.Details?.UsedCoupons;
              const stringWithoutBrackets = inputString.slice(1, -1);
              const arrayFromString = stringWithoutBrackets.split(",");
              const isCouponUsed = arrayFromString.includes(couponCode);
              console.log("isCouponUsed-------------->", isCouponUsed);

              if (isCouponUsed) {
                toast.error("Coupon code is already used");
              } else {
                toast.success("Coupon code is available");
              }
            } else {
              toast.error("This Coupon does not exists");
            }
          }
        )
      );
    } else {
      toast.error("Coupon code format is invalid.");
    }
  };

  console.log("usedCouponArr-------------->", usedCouponArr);

  const togeneratBill = () => {};

  // setamountAfterDiscount

  const onsubmit = () => {
    if (guestName == "" || phone === "") {
      toast.warning("Please fill all the fields");
    } else if (phone.length > 10 || phone.length < 10) {
      toast.warning("Please enter a valid phone number (up to 10 digits)");
    } else if (!isValidEmail(email)) {
      toast.warning("Please enter a valid email address");
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
        teensPrice: totalteensPrice,
        // discountId:2,
        panelDiscountId: selectedOption,
        couponId: couponId,
        referredBy: referredBy,
        settledByCompany: 0,
        packageId:
          packageIds == []
            ? JSON.stringify(teenpackageId)
            : JSON.stringify(packageIds),
        packageGuestCount: JSON.stringify(packageGuestCount),
        userId: loginDetails?.logindata?.userId,
        userTypeId: loginDetails?.logindata?.UserType,
        // futureDate:2023-10-25,
        shiftId: 2,
        actualAmount: amount,
        amountAfterDiscount: amountAfterDiscount,
        isActive: 1,
      };

      dispatch(
        AddBookingFn(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            console.log(
              "booking details --------------?",
              callback?.response?.Details
            );

            setBookingData(callback?.response?.Details);

            toast.success("Booking details success");

            if (couponToggle) {
              couponCodeAppend();
            }

            navigate("/GenerateBill", {
              state: { userData: callback?.response?.Details },
            });
            // navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  console.log("numberofteens-------------------->", numberofteens);

  const couponCodeAppend = () => {
    const updatedCouponData = [...usedCouponArr, couponCode];
    const dataArray = Array.from(
      { length: updatedCouponData.length },
      (_, index) => updatedCouponData[index]
    );
    const stringRepresentation = "[" + dataArray.join(",") + "]";
    const couponData = {
      couponId: couponId,
      usedCoupons: stringRepresentation,
      remainingCoupons: remainingCoupons,
    };

    dispatch(
      EditUsedCoupon(couponData, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Coupon used updated");
          // navigate("/GenerateBill", { state: { userType: bookingData } });
          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    console.log("Discount valueeeeeeeeeee", e.target.value);

    const selectedPanelDiscount = panelDiscounts.find(
      (item) => item.Id == selectedValue
    );

    console.log(
      "selectedPanelDiscount------------------------------------->",
      selectedPanelDiscount
    );

    setSelectedOption(e.target.value);
    const discount = (amount * selectedPanelDiscount?.PanelDiscount) / 100;
    const discountedAmount = amount - discount;
    setamountAfterDiscount(discountedAmount);
  };

  console.log("Discount ----->", selectedOption);

  console.log("amountAfterDiscount-------->", amountAfterDiscount);

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
          amountAfterDiscount={amountAfterDiscount}
          couponDiscount={couponDiscount}
          setTotalTeensPrice={setTotalTeensPrice}
          setTeenPackageId={setTeenPackageId}
        />
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Guest Name <span style={{ color: "red" }}>*</span>
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
          <label for="formGroupExampleInput " className="form_text">
            Phone <span style={{ color: "red" }}>*</span>
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
          <label for="formGroupExampleInput " className="form_text mb-2">
            Country
          </label>
          <Select
            // className="form-control"
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
            // className="form-control"
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
        <div className="col-lg-6 mt-3 ">
          <label for="formGroupExampleInput " className="form_text mb-2">
            City
          </label>

          <input
            class="form-control "
            type="text"
            placeholder="Enter your city"
            onChange={(e) => setSelectedCity(e.target.value)}
            // defaultValue={userData?.Address}
          />
        </div>

        <div className="col-lg-6 mt-3">
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

        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Refrrred by
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder=" Refrrred by"
            onChange={(e) => settoalGuestCount(e.target.value)}
          />
        </div> */}

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
        <div className="row mt-3">
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
                  Settled by company
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

          <div className="row">
            {couponToggle ? (
              <div className="col-lg-6 mt-3">
                <div className="input-group">
                  <input
                    className="form-control mt-2"
                    type="text"
                    placeholder="Coupon Code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "8px" }}
                    type="button"
                    onClick={separateInitials}
                  >
                    Check
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          {discountToggle ? (
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput mt-3" className="form_text">
                Discount
              </label>
              <select
                className="form-select form-control mt-2"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="">Select an option</option>
                {panelDiscounts.map((item, index) => (
                  <option key={index} value={item?.Id}>
                    {item?.PanelDiscount}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <></>
          )}

          {referredByToggle || discountToggle ? (
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Referred By
              </label>
              <input
                class="form-control mt-2"
                type="text"
                placeholder="Referred By"
                onChange={(e) => setreferredBy(e.target.value)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
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
