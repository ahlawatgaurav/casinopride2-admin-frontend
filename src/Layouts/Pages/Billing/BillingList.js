import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getPackageDetails, deletePackage } from "../../../Redux/actions/users";
import { fetchUserbookings } from "../../../Redux/actions/booking";
import { useDispatch } from "react-redux";
import {
  GetBillingDetails,
  getVoidBillingList,
  getNoShowGuestList,
} from "../../../Redux/actions/billing";
import { getUserDetails } from "../../../Redux/actions/users";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import PackagesPage from "../Packages/PackagePage";
import Select from "react-select";
import moment from "moment";

const BillingList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log(
    "loginDetails--------------{{{{{{{{{{{}}}}}}}}}}}}}}-------->",
    loginDetails?.logindata?.UserType
  );

  const [userBookings, setUserBookings] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [userName, setUserName] = useState([]);
  const [searchQuery, setSearchQuery] = useState(0);
  const [searchBillId, setSearhBillId] = useState("");
  const [loading, setLoading] = useState(true);

  const [disableInput, setDisableInput] = useState(false);

  const [itemDetails, setItemDetails] = useState([]);

  const [filteredUserBookings, setFilteredUserBookings] = useState([]);
  const [filteredBillingList, setFilteredBillingList] = useState([]);

  const todayDate = moment().format("YYYY-MM-DD");

  const [futureDate, setFutureDate] = useState(
    loginDetails?.logindata?.UserType == "2" ||
      loginDetails?.logindata?.UserType == "3"
      ? todayDate
      : ""
  );

  console.log(
    "<------------------filtered Billing List-------------->",
    filteredBillingList
  );

  const [shiftId, setShitId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [billId, setBillId] = useState(0);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [showViewMoreNoShowListModal, setShowViewMoreNoShowListModal] =
    useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  const [selectedNoShowListDetails, setSelectedNoShowListDetails] = useState(
    {}
  );
  const [allBill, setAllBill] = useState(true);
  const [voidBillList, setVoidBillList] = useState(false);
  const [noShowGuestList, setNoShowGuestList] = useState(false);
  const [voidBillingList, setVoidBillingList] = useState([]);
  const [displayNoShowGuestList, setDisplayNoShowGuestList] = useState([]);
  const [eventDate, setEventDate] = useState(null);

  const fetchBillingDetailsFn = () => {
    dispatch(
      GetBillingDetails(
        loginDetails?.logindata?.Token,
        futureDate,
        userId,
        shiftId,
        billId,
        searchBillId,

        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log("Callback---------get billings", callback?.response);
            setBillingDetails(callback?.response?.Details);
            setFilteredBillingList(callback?.response?.Details);
          } else {
            console.log("Callback---------get billings--error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const fetchUsersDetails = () => {
    dispatch(
      getUserDetails(loginDetails?.logindata?.Token, 0, (callback) => {
        if (callback.status) {
          setLoading(false);
          setUserName(callback?.response?.Details);
          console.log("Callback---------User details", callback?.response);
        } else {
          console.log("Callback---------User details--error", callback.error);
          toast.error(callback.error);
        }
      })
    );
  };

  useEffect(() => {
    console.log("Called when id changed");
    fetchBillingDetailsFn();
    fetchUsersDetails();
    fetchVoidBillList();
    fetchNoShowGuestList();
    if (loginDetails?.logindata?.UserType == "1") {
      const today = moment().format("YYYY-MM-DD");
      setFutureDate(today);
    }
  }, [dispatch]);

  const handleShiftChange = (selectedOption) => {
    setShitId(selectedOption?.value);
  };

  const handleViewMore = (item) => {
    setSelectedUserDetails(item);
    setShowViewMoreModal(true);
  };
  const handleNoShowListViewMore = (item) => {
    console.log("handleNoShowListViewMore-->", item);
    setSelectedNoShowListDetails(item);
    setShowViewMoreNoShowListModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };
  const handleCloseNoShowListViewMore = () => {
    setShowViewMoreNoShowListModal(false);
    setSelectedNoShowListDetails({});
  };

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilteredBillingList([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = billingDetails.filter((item) =>
        item?.GuestName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredBillingList(filtered);
    }
  };

  const handleSelectChange = (selectedOption) => {
    setUserId(selectedOption?.value);
  };

  const options = userName.map((user) => ({
    value: user.Id,
    label: user.Username,
  }));

  const shiftOptions = [
    { value: "", label: "Select a shift" },
    { value: "1", label: "Shift 1" },
    { value: "2", label: "Shift 2" },
    { value: "3", label: "Shift 3" },
  ];

  const searchBtn = () => {
    if (searchBillId && (futureDate || userId || shiftId)) {
      toast.error(
        "If Bill ID is selected, other filters should not be selected."
      );
      return;
    }

    if (shiftId && !futureDate) {
      toast.error("Please select a date when choosing shifts.");

      return;
    } else {
      fetchBillingDetailsFn();
    }
  };

  useEffect(() => {
    searchBtn();
  }, [searchBillId, futureDate, userId, shiftId]);

  useEffect(() => {
    setDisableInput(true);
  }, [futureDate, handleSelectChange, handleShiftChange]);

  // const clearFilters = () => {
  //   console.log("All clear");
  //   setFutureDate("");
  //   setShitId(0);
  //   setUserId(0);
  //   setBillId(0);
  //   setSearhBillId(0);
  //   fetchBillingDetailsFn();
  // };

  const fetchVoidBillList = () => {
    dispatch(
      getVoidBillingList(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log(
            "Callback---------getVoidBillingList",
            callback?.response
          );
          setVoidBillingList(callback?.response?.Details);
          // setFilteredBillingList(callback?.response?.Details);
        } else {
          console.log(
            "Callback---------getVoidBillingList>>error",
            callback.error
          );
          toast.error(callback.error);
        }
      })
    );
  };
  const fetchNoShowGuestList = () => {
    dispatch(
      getNoShowGuestList(
        loginDetails?.logindata?.Token,
        eventDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------getNoShowGuestList",
              callback?.response
            );
            setDisplayNoShowGuestList(callback?.response?.Details);
            // setFilteredBillingList(callback?.response?.Details);
          } else {
            console.log(
              "Callback---------getNoShowGuestList>>error",
              callback.error
            );
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const handleToggle = (field) => {
    // Toggle the state of the corresponding field
    if (field === "allBill") {
      setAllBill(!allBill); // Toggle the state
      setVoidBillList(false);
      setNoShowGuestList(false);
    } else if (field === "voidBillList") {
      setVoidBillList(!voidBillList);
      setAllBill(false);
      setNoShowGuestList(false);
    } else if (field === "noShowGuestList") {
      setNoShowGuestList(!noShowGuestList);
      setAllBill(false);
      setVoidBillList(false);
    }
  };
  // Function to get the current date in the format 'YYYY-MM-DD'
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = (today.getDate() - 1).toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchNoShowGuestList();
  }, [eventDate]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [allBill]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [voidBillList]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [noShowGuestList]);

  console.log(
    "Hi --------------> Welcome to the future dateeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    futureDate
  );

  return (
    <div>
      <ToastContainer />
      <h3 className="mb-4">Billing List</h3>

      <div className="row mt-3">
        <div className="row">
          <div className="col-lg-4">
            <label for="formGroupExampleInput " className="form_text">
              Display All Bills
            </label>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="discountSwitch"
                checked={allBill}
                onChange={() => handleToggle("allBill")}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <label for="formGroupExampleInput " className="form_text">
              Display Void Bills
            </label>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="couponSwitch"
                checked={voidBillList}
                onChange={() => handleToggle("voidBillList")}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <label for="formGroupExampleInput " className="form_text">
              Display No Show Guest List
            </label>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="referredBySwitch"
                checked={noShowGuestList}
                onChange={() => handleToggle("noShowGuestList")}
              />
            </div>
          </div>
        </div>
      </div>
      {allBill === true &&
        voidBillList === false &&
        noShowGuestList === false && ( //show all bills with filters
          <>
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-lg-3 mb-3">
                  <p style={{ fontWeight: "bold" }}>Search By Bill Id</p>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Search Bill Id"
                      onChange={(e) => {
                        setSearhBillId(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {searchBillId == 0 ? (
                  <div className="col-md-3 col-lg-2 mb-2">
                    <p style={{ fontWeight: "bold" }}>Search By Date</p>
                    <div className="input-group">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Search name"
                        onChange={(e) => setFutureDate(e.target.value)}
                        value={futureDate}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <p style={{ fontWeight: "bold" }}>Search By Shift</p>
                  <div className="input-group">
                    <Select
                      className="custom-select"
                      options={shiftOptions}
                      onChange={handleShiftChange}
                    />
                  </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6">
                  <p style={{ fontWeight: "bold" }}>Search By User</p>
                  <div className="input-group">
                    <Select
                      className="custom-select"
                      options={options}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>

                {/* <div className="col-md-1 col-lg-1 d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={searchBtn}>
              Search
            </button>
          </div> */}
                {/* <div className="col-md-3 col-lg-3 d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear
            </button>
          </div> */}
                {/* <div className="col-md-2 col-lg-2 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/NewBooking"
                state={{ userType: "4" }}
                className="addLinks"
              >
                New Booking
              </Link>
            </button>
          </div> */}
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col" className="text-center table_heading">
                    Bill Id
                  </th>
                  <th scope="col" className="text-center table_heading">
                    Guest Name
                  </th>
                  <th scope="col" className="text-center table_heading">
                    Phone
                  </th>

                  <th scope="col" className="text-center table_heading">
                    Users Name
                  </th>

                  <th scope="col" className="text-center table_heading">
                    Shift
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
                ) : billingDetails.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  billingDetails.map((item) => (
                    <tr key={item.id}>
                      <td className="manager-list">{item.BillingId}</td>
                      <td className="manager-list ">{item.GuestName}</td>
                      <td className="manager-list">{item.Phone}</td>
                      <td className="manager-list">
                        {item.UsersName ? item.UsersName : "-"}
                      </td>
                      <td className="manager-list">
                        {item.ShiftId === 0 ? "-" : item.ShiftId}
                      </td>
                      <td
                        className="manager-list"
                        onClick={() => handleViewMore(item)}
                      >
                        <img src={more} className="more_img" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

      {allBill === false &&
        voidBillList === true &&
        noShowGuestList === false && ( // show void bill list
          <table class="table">
            <thead>
              <tr>
                <th scope="col" className="text-center table_heading">
                  Bill Id
                </th>
                <th scope="col" className="text-center table_heading">
                  Guest Name
                </th>
                <th scope="col" className="text-center table_heading">
                  Phone
                </th>

                <th scope="col" className="text-center table_heading">
                  Users Name
                </th>

                <th scope="col" className="text-center table_heading">
                  Shift
                </th>
                <th scope="col" className="text-center table_heading">
                  Status
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
              ) : voidBillingList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data found.
                  </td>
                </tr>
              ) : (
                voidBillingList.map((item) => (
                  <tr key={item.id}>
                    <td className="manager-list">{item.BillingId}</td>
                    <td className="manager-list ">{item.GuestName}</td>
                    <td className="manager-list">{item.Phone}</td>
                    <td className="manager-list">{item.UsersName}</td>
                    <td className="manager-list">{item.ShiftId}</td>
                    <td
                      className="manager-list"
                      style={{ color: item.IsVoid === 1 ? "red" : "green" }}
                    >
                      {item.IsVoid == 1 ? "Void" : "Active"}
                    </td>
                    <td
                      className="manager-list"
                      onClick={() => handleViewMore(item)}
                    >
                      <img src={more} className="more_img" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      {allBill === false &&
        voidBillList === false &&
        noShowGuestList === true && ( //show no show guest list
          <>
            <div className="col-md-3 col-lg-2 mb-2">
              <p style={{ fontWeight: "bold" }}>Search By Event Date</p>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Search name"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setEventDate(null);
                    } else {
                      setEventDate(e.target.value);
                    }
                  }}
                  value={eventDate}
                  max={getCurrentDate()} // Set the max attribute to disable dates after today
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" className="text-center table_heading">
                    Guest Name
                  </th>
                  <th scope="col" className="text-center table_heading">
                    Phone
                  </th>
                  <th scope="col" className="text-center table_heading">
                    Total Amount
                  </th>
                  <th scope="col" className="text-center table_heading">
                    Total Guest Count
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
                ) : displayNoShowGuestList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  displayNoShowGuestList.map((item) => (
                    <tr key={item.id}>
                      <td className="manager-list ">{item.GuestName}</td>
                      <td className="manager-list">{item.Phone}</td>
                      <td className="manager-list">{item.ActualAmount}</td>
                      <td className="manager-list">{item.TotalGuestCount}</td>

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
                        onClick={() => handleNoShowListViewMore(item)}
                      >
                        <img src={more} className="more_img" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Billing Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <img src={selectedUserDetails?.BillingFile} />
            <div className="col-6">
              <p className="table-modal-list ">
                Item Details :
                <ui>
                  {selectedUserDetails?.ItemDetails?.ItemName.map((item) => (
                    <li> {item}</li>
                  ))}
                </ui>
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Billing Date & Time: {selectedUserDetails.BillingDate}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Email: {selectedUserDetails.Email}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                User Name: {selectedUserDetails.UsersName}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                shift: {selectedUserDetails.ShiftId}
              </p>
            </div>
            {!selectedUserDetails.NumOfTeens == 0 ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Teens: {selectedUserDetails.NumOfTeens}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedUserDetails.Address == null ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Address: {selectedUserDetails.Address}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedUserDetails.City == null ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  City: {selectedUserDetails.City}
                </p>
              </div>
            ) : (
              <></>
            )}
            <div className="col-6">
              <p className="table-modal-list ">
                Bill Number: {selectedUserDetails.BillNumber}
              </p>
            </div>{" "}
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
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={showViewMoreNoShowListModal}
        onHide={handleCloseNoShowListViewMore}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <p className="table-modal-list ">
                Full Name: {selectedNoShowListDetails.GuestName}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Phone: {selectedNoShowListDetails.Phone}
              </p>
            </div>
            {!selectedNoShowListDetails.Email == "" ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Email: {selectedNoShowListDetails.Email}
                </p>
              </div>
            ) : (
              <></>
            )}{" "}
            <div className="col-6">
              <p className="table-modal-list ">
                Guest Count: {selectedNoShowListDetails.TotalGuestCount}
              </p>
            </div>
            {!selectedNoShowListDetails.Address == "" ? (
              <div className="col-12">
                <p className="table-modal-list ">
                  Address: {selectedNoShowListDetails.Address}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedNoShowListDetails.Country == "" ? (
              <div
                className={`col-${
                  !selectedNoShowListDetails.City == "" ? 4 : 6
                }`}
              >
                <p className="table-modal-list ">
                  Country: {selectedNoShowListDetails.Country}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedNoShowListDetails.State == "" ? (
              <div
                className={`col-${
                  !selectedNoShowListDetails.City == "" ? 4 : 6
                }`}
              >
                <p className="table-modal-list ">
                  State: {selectedNoShowListDetails.State}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedNoShowListDetails.City == "" ? (
              <div className="col-4">
                <p className="table-modal-list ">
                  City: {selectedNoShowListDetails.City}
                </p>
              </div>
            ) : (
              <></>
            )}
            <div className="col-6">
              <p className="table-modal-list ">
                Actual Amount: {selectedNoShowListDetails.ActualAmount}
              </p>
            </div>{" "}
            {selectedNoShowListDetails.DOB == "" ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Date of Birth: {selectedNoShowListDetails.DOB}
                </p>
              </div>
            ) : (
              <></>
            )}
            {selectedNoShowListDetails.PanelDiscount > 0 ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Panel Discount : {selectedNoShowListDetails.PanelDiscount} %
                </p>
              </div>
            ) : (
              <></>
            )}
            {selectedNoShowListDetails.WebsiteDiscount > 0 ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Website Discount : {selectedNoShowListDetails.WebsiteDiscount}{" "}
                  %
                </p>
              </div>
            ) : (
              <></>
            )}
            {selectedNoShowListDetails.CouponDiscount > 0 ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Coupon Discount : {selectedNoShowListDetails.CouponDiscount} %
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedNoShowListDetails.ReferredBy === "" ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Referred By : {selectedNoShowListDetails.ReferredBy}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default BillingList;
