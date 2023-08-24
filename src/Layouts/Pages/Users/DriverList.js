import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getUserDetails, deleteUser } from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";

const DriverList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [driver, setDriver] = useState([]);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const fetchDriverDetails = () => {
    dispatch(
      getUserDetails(loginDetails?.logindata?.Token, 6, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log(
            "Callback---------get MasterAgent list",
            callback?.response
          );
          setDriver(callback?.response?.Details);
          setFilterDriverList(callback?.response?.Details);
        }
      })
    );
  };

  useEffect(() => {
    fetchDriverDetails();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredManagerDetails, setFilteredManagerDetails] = useState([]);
  const [filterDriverList, setFilterDriverList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const filterDriverDetails = () => {
    if (searchQuery.trim() === "") {
      setFilterDriverList([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = driver.filter(
        (item) =>
          item.Name.toLowerCase().includes(lowerCaseQuery) ||
          item.Phone.includes(searchQuery) ||
          item.Email.toLowerCase().includes(lowerCaseQuery)
      );
      setFilterDriverList(filtered);
    }
  };

  const deleteUserFunction = () => {
    dispatch(
      deleteUser(loginDetails?.logindata?.Token, userId, (callback) => {
        if (callback.status) {
          console.log("Callback---------get Delete user ", callback?.response);
          setShowModal(false);
          fetchDriverDetails();
          toast.success("Master Agent Deleted");
        }
      })
    );
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

  return (
    <div>
      <h3 className="mb-4">Drivers List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterDriverDetails();
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link to="/AddUser" state={{ userType: "6" }} className="links">
                Add Driver
              </Link>
            </button>
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Name
            </th>
            <th scope="col" className="text-center table_heading">
              Phone Number
            </th>
            <th scope="col" className="text-center table_heading">
              Email
            </th>
            <th scope="col" className="text-center table_heading">
              Action
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
          ) : filterDriverList.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filterDriverList.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.Name}</td>
                <td className="manager-list">{item.Phone}</td>
                <td className="manager-list">{item.Email}</td>
                <td className="manager-list">
                  <div className="row">
                    <div className="col-lg-4">
                      <Link
                        to="/AddUser"
                        state={{ userData: item }}
                        className="links"
                      >
                        <AiFillEdit />
                      </Link>
                    </div>
                    <div
                      className="col-lg-4"
                      onClick={() => handleShow(item.Id)}
                    >
                      <AiFillDelete />
                    </div>
                    <div
                      className="col-lg-4"
                      onClick={() => handleViewMore(item)}
                    >
                      View more
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Driver Agent?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteUserFunction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Driver Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="manager-list ">Name: {selectedUserDetails.Name}</p>
          <p className="manager-list ">Phone: {selectedUserDetails.Phone}</p>
          <p className="manager-list ">Email: {selectedUserDetails.Email}</p>
          <p className="manager-list ">
            Address: {selectedUserDetails.Address}
          </p>
          <p className="manager-list ">
            Password: {selectedUserDetails.Password}
          </p>
          <p className="manager-list ">
            Username: {selectedUserDetails.Username}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewMore}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DriverList;
