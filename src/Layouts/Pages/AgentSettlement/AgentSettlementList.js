import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getCouponDetails,
  deleteCoupon,
  fetchAgentSettlement,
  updateAgentSettlement,
} from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import moment from "moment";

const AgentSettlementList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [couponDetails, setCouponDetails] = useState([]);

  const [agentDetails, setAgentDetails] = useState([]);
  const [filteredAgentDetails, setFilteredAgentDetails] = useState([]);
  const [filteredCouponDetails, setFilteredCouponDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const currentDate = moment().format("YYYY-MM-DD");

  const fetchAgentSettlementDetails = () => {
    dispatch(
      fetchAgentSettlement(
        loginDetails?.logindata?.Token,
        currentDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------Agent settt details",
              callback?.response
            );
            setAgentDetails(callback?.response?.Details);

            setFilteredAgentDetails(callback?.response?.Details);
          }
        }
      )
    );
  };

  useEffect(() => {
    fetchAgentSettlementDetails();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const filterCouponListDetails = () => {
    if (searchQuery.trim() === "") {
      setFilteredAgentDetails([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = agentDetails.filter((item) =>
        item?.Name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredAgentDetails(filtered);
    }
  };

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

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (PackageId) => {
    console.log("PackageId", PackageId);
  };

  const originalDate = "2023-09-08T18:30:00.000Z";

  // Use moment to parse the original date string
  const parsedDate = moment(originalDate);

  // Add a week to the parsed date
  const newDate = parsedDate.add(7, "days");

  // Format the new date as 'YYYY-MM-DD'
  const formattedDate = newDate.format("YYYY-MM-DD");

  console.log("startDate--------------->", formattedDate);

  const addWeekToDate = (dateString) => {
    const parsedDate = moment(dateString);
    const newDate = parsedDate.add(7, "days");
    return newDate.format("YYYY-MM-DD");
  };

  const [referenceNumber, setReferenceNumber] = useState("");

  const updateAgentSettlementFn = () => {
    if (referenceNumber == "") {
      toast.warning("Please enter reference number");
    } else {
      const data = {
        id: selectedUserDetails?.Id,
        userId: selectedUserDetails?.UserId,
        referenceNum: referenceNumber,
        isSettled: 1,
      };

      dispatch(
        updateAgentSettlement(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Settlement Done");
              fetchAgentSettlementDetails();
              handleCloseViewMore();
              toast.error(callback.error);
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    }
  };

  return (
    <div>
      <h3 className="mb-4">Travel Agent settlement List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search name"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterCouponListDetails();
                }}
              />
            </div>
          </div>
          {/* <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/AddCoupon"
                state={{ userType: "4" }}
                className="addLinks"
              >
                Add Coupon
              </Link>
            </button>
          </div> */}
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Name
            </th>
            <th scope="col" className="text-center table_heading">
              Settlement
            </th>

            <th scope="col" className="text-center table_heading">
              Settle Payment
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
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
          ) : filteredAgentDetails.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredAgentDetails.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.Name}</td>
                <td className="manager-list">{item.Settlement}</td>

                {item.IsSettled == 0 ? (
                  <td
                    className="manager-list"
                    onClick={() => handleViewMore(item)}
                  >
                    <img src={more} className="more_img" />
                  </td>
                ) : (
                  <td className="manager-list" style={{ color: "green" }}>
                    Amount Settled
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Agent Settlement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Reference Number"
            onChange={(e) => {
              setReferenceNumber(e.target.value);
            }}
          />

          <buttom
            className="btn btn-primary text-center mt-3"
            onClick={updateAgentSettlementFn}
          >
            Submit Settlement
          </buttom>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AgentSettlementList;
