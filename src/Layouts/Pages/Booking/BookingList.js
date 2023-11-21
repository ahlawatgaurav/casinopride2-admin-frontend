import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getPackageDetails, deletePackage } from "../../../Redux/actions/users";
import { fetchUserbookings } from "../../../Redux/actions/booking";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import PackagesPage from "../Packages/PackagePage";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { updateBooking } from "../../../Redux/actions/booking";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { AddBillingDetails } from "../../../Redux/actions/billing";
import editpencil from "../../../assets/Images/editpencil.png";
import { FaBeer } from "react-icons/fa";

import { LiaFileInvoiceSolid } from "react-icons/lia";
import { CiCircleMore } from "react-icons/ci";

const BookingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);
  const [loader, setLoader] = useState(true);

  const [userBookings, setUserBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const [itemDetails, setItemDetails] = useState([]);
  const [futureDate, setFutureDate] = useState("");
  console.log("futureDate---->", futureDate);

  const [filteredUserBookings, setFilteredUserBookings] = useState([]);

  const fetchUserBookingFn = () => {
    dispatch(
      fetchUserbookings(
        loginDetails?.logindata?.Token,
        futureDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------get user bookings",
              callback?.response
            );
            setUserBookings(callback?.response?.Details);
            setFilteredUserBookings(callback?.response?.Details);
          } else {
            console.log(callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  useEffect(() => {
    fetchUserBookingFn();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  console.log("selectedUserDetails------------------->", selectedUserDetails);

  const handleViewMore = (userDetails) => {
    setSelectedUserDetails(userDetails);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilteredUserBookings([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = userBookings.filter((item) =>
        item?.FullName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredUserBookings(filtered);
    }
  };

  useEffect(() => {
    fetchUserBookingFn();
  }, [futureDate]);

  const [editBookingDetails, setEditBookingDetails] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const startEditing = (item) => {
    console.log("Item details from modal------------------->", item);
    setEditBookingDetails(item);
    setIsEditing(true);
  };
  const cancelEditing = () => setIsEditing(false);

  // const [guestName, setGuestName] = useState(
  //   editBookingDetails?.FullName ? editBookingDetails?.FullName : ""
  // );
  // const [address, setAddress] = useState(
  //   editBookingDetails?.Address ? editBookingDetails?.Address : ""
  // );
  // const [dateofbirth, setDateofbirth] = useState(
  //   editBookingDetails?.DOB ? editBookingDetails?.DOB : ""
  // );
  // const [gstNumber, setgstNumber] = useState(
  //   editBookingDetails.GSTNumber ? editBookingDetails.GSTNumber : ""
  // );

  const [guestName, setGuestName] = useState("");
  const [address, setAddress] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [gstNumber, setgstNumber] = useState("");

  // Use a single useEffect to initialize all fields when editBookingDetails changes
  useEffect(() => {
    if (editBookingDetails) {
      setGuestName(editBookingDetails?.FullName || "");
      setAddress(editBookingDetails?.Address || "");
      setDateofbirth(editBookingDetails?.DOB || "");
      setgstNumber(editBookingDetails?.GSTNumber || "");
    }
  }, [isEditing]);

  // Use a single useEffect to initialize all fields when editBookingDetails changes

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  const backendData = {
    selectedCountryName: editBookingDetails?.Country,
    selectedStateName: editBookingDetails?.State,
  };

  useEffect(() => {
    console.log(
      "backendData.selectedCountryName--------->",
      backendData.selectedCountryName
    );

    if (backendData.selectedCountryName) {
      setSelectedCountry({ name: backendData.selectedCountryName });
    } else {
      setSelectedCountry(null);
    }

    if (backendData.selectedStateName) {
      setSelectedState({ name: backendData.selectedStateName });
    } else {
      setSelectedState(null);
    }
    // setSelectedCountry({ name: backendData.selectedCountryName });
    // setSelectedState({ name: backendData.selectedStateName });
  }, [editBookingDetails]);

  console.log("Backend Data---------->", backendData);

  console.log("guestName============>", guestName);

  const updateBookingFn = () => {
    if (!guestName) {
      toast.error("Please enter the guest name");
    } else if (gstNumber && gstNumber?.length != 15) {
      console.log("Error");
      toast.error("Enter a valid GST number");
    } else {
      const data = {
        bookingId: editBookingDetails?.Id,
        guestName: guestName ? guestName : editBookingDetails?.FullName,
        address: address ? address : editBookingDetails?.Address,
        dob: dateofbirth ? dateofbirth : editBookingDetails?.DOB,
        country: selectedCountry?.name,
        state: selectedState?.name,
        city: selectedCity ? selectedCity : editBookingDetails.City,
        GSTNumber: gstNumber ? gstNumber : editBookingDetails.GSTNumber,
        isActive: 1,
      };

      dispatch(
        updateBooking(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            console.log(
              "update booking details --------------?",
              callback?.response?.Details
            );

            toast.success("Updated Booking details success");

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

  const today = moment().format("YYYY-MM-DD");
  console.log("Today------>", today);

  const GenerateBill = (item) => {
    console.log("Generate Bill--------->", item);

    const data = {
      bookingId: item.Id,
      packageId: item.PackageId,
      packageGuestCount: item.PackageGuestCount,
      totalGuestCount: item.TotalGuestCount,
      bookingDate: item.CreatedOn?.slice(0, 10),
      billingDate: today,
      teensCount: item.NumOfTeens,
      actualAmount: item.ActualAmount,
      amountAfterDiscount: item.AmountAfterDiscount,
      discount: item.PanelDiscount ? item.PanelDiscount : item.CouponDiscount,
      packageWeekdayPrice: JSON.stringify(item.PackageWeekdayPrice),
      packageWeekendPrice: JSON.stringify(item.PackageWeekendPrice),
    };

    dispatch(
      AddBillingDetails(loginDetails?.logindata?.Token, data, (callback) => {
        if (callback.status) {
          console.log(
            "Generate Bill --------------?",
            callback?.response?.Details[0]?.NumOfTeens,
            callback?.response?.Details[0]?.TotalGuestCount
          );

          if (
            callback?.response?.Details[0]?.NumOfTeens -
              callback?.response?.Details[0]?.TotalGuestCount ==
            0
          ) {
            navigate("/TeensBilling", {
              state: { BookingDetails: callback?.response?.Details },
            });
            setLoader(false);
          } else {
            navigate("/BillingDetails", {
              state: { BookingDetails: callback?.response?.Details },
            });
            setLoader(false);
          }

          toast.error(callback.error);
        } else {
          toast.error(callback.error);
          setLoader(false);
        }
      })
    );
  };

  console.log(
    "filteredUserBookings--------------------->",
    filteredUserBookings
  );

  const filterBookingDetails = (value) => {
    if (value?.trim() === "") {
      fetchUserBookingFn();
      // setFilteredManagerDetails([]);
    } else {
      const lowerCaseQuery = value?.toLowerCase();
      const filtered = filteredUserBookings?.filter(
        (item) =>
          item?.FullName?.toLowerCase()?.includes(lowerCaseQuery) ||
          item?.Phone?.includes(value)
      );
      setFilteredUserBookings(filtered);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h3 className="mb-4">Booking List</h3>
      <div>
        <div className="row">
          <div className="col-md-6 col-lg-6 mb-3">
            <p style={{ fontWeight: "bold" }}>Search</p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={(e) => {
                  // setSearchQuery(e.target.value);
                  // filterPackageDetailsFn();
                  filterBookingDetails(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="col-md-2 col-lg-2 mb-2">
            <p style={{ fontWeight: "bold" }}>Future Booking Date</p>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                placeholder="Search name"
                // onChange={(e) => {
                //   setSearchQuery(e.target.value);
                //   filterPackageDetailsFn();
                // }}
                onChange={(e) => setFutureDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-4 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/NewBooking"
                state={{ userType: "4" }}
                className="addLinks"
              >
                New Booking
              </Link>
            </button>
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Guest Name
            </th>
            <th scope="col" className="text-center table_heading">
              Guest Phone
            </th>
            <th scope="col" className="text-center table_heading">
              Packages
            </th>
            <th scope="col" className="text-center table_heading">
              Package Amount
            </th>
            <th scope="col" className="text-center table_heading">
              Total Amount
            </th>
            <th scope="col" className="text-center table_heading">
              Total Guest Count
            </th>
            <th scope="col" className="text-center table_heading">
              Generate Bill
            </th>
            <th scope="col" className="text-center table_heading">
              Update Booking
            </th>
            <th scope="col" className="text-center table_heading">
              View more
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Oval
                    height={80}
                    width={50}
                    color="#4fa94d"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              </td>
            </tr>
          ) : filteredUserBookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredUserBookings.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.FullName}</td>
                <td className="manager-list">{item.Phone}</td>
                <td className="manager-list" style={{ fontSize: "12px" }}>
                  {item && item?.PackageName && item?.PackageName ? (
                    JSON.parse(item?.PackageName).map((item, index) => (
                      <li key={index} style={{ listStyleType: "none" }}>
                        {item}{" "}
                      </li>
                    ))
                  ) : (
                    <span>No package name available</span>
                  )}
                </td>

                {/* <td className="manager-list">
                  {item?.FinalPrice?.map((price, index) => (
                    <li key={index} style={{ listStyleType: "none" }}>
                      {price}
                    </li>
                  ))}
                </td> */}
                <td className="manager-list">
                  {/* {item?.Items[0]?.FinalPrice?.map((price, index) => (
                              <li key={index} style={{ listStyleType: "none" }}>
                                {price}
                              </li>
                            ))} */}
                  {item?.TeensPrice === 0 && item?.FinalPrice.length !== 0 && (
                    // Display only price
                    <div>
                      {item?.FinalPrice?.map((price, index) => (
                        <li key={index} style={{ listStyleType: "none" }}>
                          {price}
                        </li>
                      ))}
                    </div>
                  )}
                  {item?.TeensPrice !== 0 && item?.FinalPrice.length !== 0 && (
                    <div>
                      {item?.FinalPrice?.map((price, index) => (
                        <li key={index} style={{ listStyleType: "none" }}>
                          {price}
                        </li>
                      ))}
                      <div>{item?.TeensPrice}</div>
                    </div>
                  )}
                  {item?.TeensPrice !== 0 && item?.FinalPrice.length === 0 && (
                    <div>{item?.TeensPrice}</div>
                  )}
                </td>

                <td className="manager-list">
                  {item?.ActualAmount - item?.AmountAfterDiscount ==
                  item?.ActualAmount
                    ? item?.ActualAmount
                    : item?.AmountAfterDiscount}
                </td>
                <td className="manager-list">{item.TotalGuestCount}</td>

                <td className="manager-list">
                  {item?.FutureDate == today ? (
                    <LiaFileInvoiceSolid
                      onClick={() => GenerateBill(item)}
                      style={{
                        height: "22px",
                        width: "22px",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p>-</p>
                  )}
                </td>
                <td className="manager-list">
                  <AiFillEdit
                    onClick={() => startEditing(item)}
                    style={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "white",
                    }}
                  />
                </td>

                {/* <td className="manager-list">
                  <Link
                    to="/AddPackage"
                    state={{ userData: item }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td> */}

                <td
                  className="manager-list"
                  // onClick={() => handleViewMore(item)}
                >
                  {/* <img src={more} className="more_img" /> */}
                  <CiCircleMore
                    onClick={() => handleViewMore(item)}
                    style={{
                      height: "22px",
                      width: "22px",
                      backgroundColor: "white",
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Guest Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="row">
            <div className="col-2">
              <p className="table-modal-list">Guest Name:</p>
            </div>
            <div className="col-9">
              <p className="table-modal-list">{selectedUserDetails.FullName}</p>
            </div>
          </div> */}
          <div className="col-6">
            <p className="table-modal-list">
              Guest Name: <span> {selectedUserDetails.FullName}</span>
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Guest Phone no: {selectedUserDetails.Phone}
            </p>
          </div>
          {!selectedUserDetails.Email == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Guest Email: {selectedUserDetails.Email}
              </p>
            </div>
          ) : (
            <></>
          )}{" "}
          <div className="col-6">
            <p className="table-modal-list ">
              Guest Count: {selectedUserDetails.TotalGuestCount}
            </p>
          </div>
          {!selectedUserDetails.Address == "" ? (
            <div className="col-12">
              <p className="table-modal-list ">
                Guest Address: {selectedUserDetails.Address}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.Country == "" ? (
            <div className={`col-${!selectedUserDetails.City == "" ? 4 : 6}`}>
              <p className="table-modal-list ">
                Country: {selectedUserDetails.Country}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.State == "" ? (
            <div className={`col-${!selectedUserDetails.City == "" ? 4 : 6}`}>
              <p className="table-modal-list ">
                State: {selectedUserDetails.State}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.City == "" ? (
            <div className="col-4">
              <p className="table-modal-list ">
                City: {selectedUserDetails.City}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="col-6">
            <p className="table-modal-list ">
              Total Amount: {selectedUserDetails.ActualAmount}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Booking Date :{" "}
              {moment(selectedUserDetails.BookingDate).format(
                "YYYY-MM-DD HH:mm"
              )}
            </p>
          </div>
          {selectedUserDetails.DOB == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Date of Birth: {selectedUserDetails.DOB}
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.PanelDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Panel Discount : {selectedUserDetails.PanelDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.WebsiteDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Website Discount : {selectedUserDetails.WebsiteDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.CouponDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Coupon Discount : {selectedUserDetails.CouponDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.ReferredBy === "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Referred By : {selectedUserDetails.ReferredBy}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="col-6">
            <p className="table-modal-list ">
              Package Name:{" "}
              {selectedUserDetails.PackageName ? (
                JSON.parse(selectedUserDetails.PackageName).map(
                  (item, index) => <span key={index}>{item} </span>
                )
              ) : (
                <span>No package name available</span>
              )}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Package Price:{" "}
              {selectedUserDetails.FinalPrice ? (
                selectedUserDetails.FinalPrice.map((item, index) => (
                  <span key={index}>{item} </span>
                ))
              ) : (
                <span>No package name available</span>
              )}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={isEditing}
        onHide={cancelEditing}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Update Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6 mt-3 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Guest Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2 "
                type="text"
                placeholder="Full Name"
                onChange={(e) => setGuestName(e.target.value)}
                defaultValue={editBookingDetails?.FullName}
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2"
                type="text"
                placeholder="Enter your address"
                onChange={(e) => setAddress(e.target.value)}
                defaultValue={editBookingDetails?.Address}
              />
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
                defaultValue={editBookingDetails?.DOB}
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
                onChange={(e) => setgstNumber(e.target.value)}
                defaultValue={editBookingDetails?.GSTNumber}
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label htmlFor="formGroupExampleInput" className="form_text mb-2">
                Country
              </label>
              <Select
                className="form_text"
                options={Country.getAllCountries()}
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["name"]}
                value={selectedCountry}
                onChange={(item) => setSelectedCountry(item)}
                placeholder="Select"
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label htmlFor="formGroupExampleInput" className="form_text mb-2">
                State
              </label>
              <Select
                className="form_text"
                options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["name"]}
                value={selectedState}
                onChange={(item) => setSelectedState(item)}
                placeholder="Select"
              />
            </div>

            {/* <div className="col-lg-6 mt-3">
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
            </div> */}
            <div className="col-lg-6 mt-3 ">
              <label for="formGroupExampleInput " className="form_text mb-2">
                City
              </label>

              <input
                class="form-control "
                type="text"
                placeholder="Enter your city"
                onChange={(e) => setSelectedCity(e.target.value)}
                defaultValue={editBookingDetails?.City}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelEditing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateBookingFn}>
            Update Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingList;
