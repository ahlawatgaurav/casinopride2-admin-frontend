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
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import PackagesPage from "../Packages/PackagePage";

const BookingList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

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

  return (
    <div>
      <ToastContainer />
      <h3 className="mb-4">Booking List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 mb-3">
            <p style={{ fontWeight: "bold" }}>Search By Full Name</p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search name"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterPackageDetailsFn();
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
              Full Name
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
                  onClick={() => handleViewMore(item)}
                >
                  <img src={more} className="more_img" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <p className="table-modal-list ">
                Full Name: {selectedUserDetails.FullName}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Phone: {selectedUserDetails.Phone}
              </p>
            </div>
            {!selectedUserDetails.Email == "" ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Email: {selectedUserDetails.Email}
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
                  Address: {selectedUserDetails.Address}
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
                Actual Amount: {selectedUserDetails.ActualAmount}
              </p>
            </div>{" "}
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
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingList;
