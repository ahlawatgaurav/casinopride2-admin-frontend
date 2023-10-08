import React, { useEffect, useState } from "react";
import "../../../assets/global.css";
import checkcircle from "../../../assets/Images/checkcircle.png";
import xcircle from "../../../assets/Images/xcircle.png";

import { Card, Button, Modal } from "react-bootstrap";
import { openOutletFunction } from "../../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { checkShiftForUser } from "../../../Redux/actions/users";
import { recentShiftForOutlet } from "../../../Redux/actions/users";
import { openShiftFn } from "../../../Redux/actions/users";
import { closeShiftFn } from "../../../Redux/actions/users";
import { closeOutletFunction } from "../../../Redux/actions/users";
import { reopenShiftFunction } from "../../../Redux/actions/users";

const Shifts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

  console.log(
    "validateDetails===========================================================>",
    validateDetails?.Details
  );

  console.log(
    "Outelt details-------------------------------------------------->",
    outletOpenDetails?.Details[0]?.Id
  );

  const formattedDate = moment().format("YYYY-MM-DD");

  const parsedDate = moment(outletOpenDetails?.Details[0]?.Date);
  const outletFormattedData = parsedDate.format("YYYY-MM-DD");

  const [outletOpen, setOutletOpen] = useState(false);
  const [shift1Open, setShift1Open] = useState(false);
  const [shift2Open, setShift2Open] = useState(false);
  const [shift3Open, setShift3Open] = useState(false);

  const [reCloseShift1, setReCloseShift1] = useState(false);
  const [reCloseShift2, setReCloseShift2] = useState(false);
  const [reCloseShift3, setReCloseShift3] = useState(false);

  const [shift1close, setShift1close] = useState(false);
  const [shift2Close, setShift2Close] = useState(false);
  const [shift3Close, setShift3close] = useState(false);

  const [checkShift1, setSheckShift1] = useState(false);

  //from api integration ---------------->

  const [outletId, setOutletId] = useState("");

  const [checkOutletOpen, setCheckOutletOpen] = useState(false);

  const [checkShift1Open, setCheckShift1Open] = useState(false);
  const [checkShift1Close, setCheckShift1Close] = useState(false);
  const [checkShift2Open, setCheckShift2open] = useState(false);
  const [checShift2Close, setCheckShift2Close] = useState(false);
  const [checkShift3Open, setCheckShift3Open] = useState(false);
  const [checkShift3Close, setCheckShift3Close] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [outletModalOpen, setOutletModalOpen] = useState(false);

  const [shiftDetails, setShiftDetails] = useState("");
  const [outletDetails, setOutletDetails] = useState("");

  const [closeOutlet, setCloseOutlet] = useState(false);

  //reopen logic----------------->
  const [reopenShift1, setReopenShift1] = useState(false);
  const [reopenShift2, setReopenShift2] = useState(false);
  const [reopenShift3, setReopenShift3] = useState(false);

  const openOutletModal = () => {
    setOutletModalOpen(true);
  };

  const closeOutletModal = () => {
    setOutletModalOpen(false);
  };

  const openOutletFn = () => {
    setOutletOpen(true);
    setOutletModalOpen(false);
    onsubmit();
  };

  const date = moment(); // Current date and time
  const time = date.format("HH:mm");

  const openShiftOne = () => {
    const data = {
      outletDate: outletFormattedData,
      shiftTypeId: 1,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Ope outlet called------------->", callback);
          setCheckShift1Open(true);
          setCheckOutletOpen(false);
          setShiftDetails(callback?.response?.Details);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeShiftOne = () => {
    const data = {
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 1,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close shift called------------->", callback);
          setCheckShift1Close(true);
          setShiftDetails(callback?.response?.Details[0]);
          setCheckShift2open(true);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const openShiftTwo = () => {
    const data = {
      outletDate: outletFormattedData,
      shiftTypeId: 2,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open shift 2  called------------->", callback);
          setShiftDetails(callback?.response?.Details);
          setCheckShift2open(false);
          setReopenShift1(true);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeShiftTwo = () => {
    // setShift2Open(false);
    // setShift2Close(true);

    const data = {
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 2,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close 2 shift called------------->", callback);
          // setCheckShift1Close(true);
          setShiftDetails(callback?.response?.Details[0]);
          setCheckShift2Close(false);
          setCheckShift3Open(true);
          setReopenShift2(true);

          setReopenShift1(false);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const openSHiftThree = () => {
    // setShift3Open(true);

    const data = {
      outletDate: outletFormattedData,
      shiftTypeId: 3,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open shift 2  called------------->", callback);
          // setSheckShift1(true);
          // setCheckShift2open(true);
          setShiftDetails(callback?.response?.Details);
          setCheckShift3Open(true);
          setCheckShift2open(false);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeSHiftThree = () => {
    const data = {
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 3,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close shift called------------->", callback);
          setCheckShift3Close(true);
          setShiftDetails(callback?.response?.Details[0]);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeOutletFn = () => {
    const data = {
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
    };

    dispatch(
      closeOutletFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close outlet called------------->", callback);
          setOpenCloseOutletModal(false);
          setShiftDetails("");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  console.log("shift3Close", shift3Close);
  console.log("outletOpen", outletOpen);

  const [openCloseOtletModal, setOpenCloseOutletModal] = useState(false);

  const OpenCLoseOutletModalFn = () => {
    setOpenCloseOutletModal(true);
  };

  const onsubmit = () => {
    const data = {
      outletDate: formattedDate,
    };

    dispatch(
      openOutletFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open outlet called------------->", callback);
          setOutletId(callback?.response?.Details?.Id);
          setCheckOutletOpen(true);
          setOutletDetails(callback?.response?.Details?.OutletStatus);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [recentShiftOpen, setRecentShiftOpen] = useState([]);

  useEffect(() => {
    dispatch(
      checkShiftForUser(
        outletFormattedData,
        validateDetails?.Details?.Id,
        validateDetails?.Details?.UserType,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback) {
            console.log(
              "Callback from shifts for user -------------->",
              callback?.response
            );

            if (callback?.response?.Details == null) {
              dispatch(
                recentShiftForOutlet(
                  outletFormattedData,

                  loginDetails?.logindata?.Token,
                  (callback) => {
                    if (callback) {
                      console.log(
                        "Recent shift for outlet--------------------------------------- ->",
                        callback?.response
                      );
                      setRecentShiftOpen(callback?.response?.Details);

                      toast.error(callback.error);
                    } else {
                      toast.error(callback.error);
                    }
                  }
                )
              );
            }

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  }, []);

  console.log(
    "Outlet ID------------------>",
    outletOpenDetails?.Details[0]?.Id
  );

  console.log("Outlet id from outlet open--------------->", outletId);

  console.log(
    "Shift Details--------shiftopen-------->",
    shiftDetails?.ShiftOpen
  );
  console.log(
    "Shift Details--------ShiftTypeId-------->",
    shiftDetails?.ShiftTypeId
  );

  const reopenShiftOneFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 1,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log(
            "Reopen  shift 1 called------------->",
            callback?.response?.Details[0]
          );

          setShiftDetails(callback?.response?.Details[0]);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const reopenShiftTwoFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 2,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Reopen  shift 2 called------------->", callback);

          setShiftDetails(callback?.response?.Details[0]);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const reopenShiftThreeFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletOpenDetails?.Details[0]?.Id
        ? outletOpenDetails?.Details[0]?.Id
        : outletId,
      shiftId: 3,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Reopen  shift 3 called------------->", callback);

          setShiftDetails(callback?.response?.Details[0]);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row d-flex justify-content-end">
          {!outletOpenDetails?.Details[0]?.OutletStatus == 1 ||
          checkOutletOpen == false ? (
            <div className="col-md-4 mb-5 d-flex justify-content-end">
              <Button variant="primary" onClick={openOutletModal}>
                Open Outlet
              </Button>
            </div>
          ) : (
            <></>
          )}

          {shift3Close === true || checkShift3Close ? (
            <div className="col-md-4 mb-5 d-flex justify-content-end">
              <Button
                variant="danger"
                disabled={!checkShift3Close}
                onClick={OpenCLoseOutletModalFn}
              >
                Close Outlet
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="row">
          <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift One</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift one</h5>
              </div>
              <div className="card-body">
                {recentShiftOpen.length == 0
                  ? "Shift one is close"
                  : "Shift one is open"}
              </div>
              <div className="card-footer">
                {shiftDetails?.ShiftOpen == 1 &&
                shiftDetails?.ShiftTypeId == 1 ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeShiftOne}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Close
                  </button>
                ) : (
                  <></>
                )}

                {outletDetails === 1 && !checkShift1Open ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={openShiftOne}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Open
                  </button>
                ) : (
                  <></>
                )}

                {(shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 1) ||
                (shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 2) ||
                (shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 2) ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                    disabled={reopenShift1}
                  >
                    Reopen
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift Two</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift Two</h5>
              </div>
              <div className="card-body">
                {recentShiftOpen.length == 0
                  ? "Shift one is close"
                  : "Shift one is open"}
              </div>
              <div className="card-footer">
                {shiftDetails?.ShiftOpen == 1 &&
                shiftDetails?.ShiftTypeId == 2 ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeShiftTwo}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Close
                  </button>
                ) : (
                  <></>
                )}

                {(outletDetails === 1 && checkShift2Open) ||
                (shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 2 &&
                  !reopenShift2) ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={openShiftTwo}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Open
                  </button>
                ) : (
                  <></>
                )}

                {(shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 2 &&
                  checkShift2Open) ||
                (shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 3) ||
                (shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 2 &&
                  reopenShift2) ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                    // disabled={checkShift3Open}
                  >
                    Reopen
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          {/* <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift Two</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift Two</h5>
              </div>
              <div className="card-body">
                {checkShift1Close === false
                  ? "Shift two is close"
                  : "Shift two is open"}
              </div>
              <div className="card-footer">
                {shiftDetails?.ShiftOpen == 1 &&
                shiftDetails?.ShiftTypeId == 2 ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeShiftTwo}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                ) : (
                  <button
                    className={`btn ${
                      checkShift1Close === false
                        ? "btn-secondary"
                        : "btn-primary"
                    } mr-2`}
                    onClick={openShiftTwo}
                    style={{ width: "100%" }}
                    disabled={
                      (shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 2) ||
                      (shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 3) ||
                      outletDetails == 0
                    }
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          </div> */}

          <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift Three</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift Three</h5>
              </div>
              <div className="card-body">
                {recentShiftOpen.length == 0
                  ? "Shift one is close"
                  : "Shift one is open"}
              </div>
              <div className="card-footer">
                {shiftDetails?.ShiftOpen == 1 &&
                shiftDetails?.ShiftTypeId == 3 ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeSHiftThree}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Close
                  </button>
                ) : (
                  <></>
                )}

                {outletDetails === 1 &&
                shiftDetails?.ShiftOpen == 0 &&
                shiftDetails?.ShiftTypeId == 2 ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={openSHiftThree}
                    style={{ width: "100%" }}
                    disabled={
                      shiftDetails?.ShiftOpen == 0 &&
                      shiftDetails?.ShiftTypeId == 0
                    }
                  >
                    Open
                  </button>
                ) : (
                  <></>
                )}

                {shiftDetails?.ShiftOpen == 0 &&
                shiftDetails?.ShiftTypeId == 3 ? (
                  <button
                    className={`btn ${
                      outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                    onClick={reopenShiftThreeFn}
                    style={{ width: "100%" }}
                    disabled={
                      outletDetails === 0 ||
                      (shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 3)
                    }
                  >
                    Reopen
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          {/* <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift Three</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift Three</h5>
              </div>
              <div className="card-body">
                {checShift2Close == false
                  ? "Shift three is close"
                  : "Shift three is open"}
              </div>
              <div className="card-footer">
                {shiftDetails?.ShiftOpen == 1 &&
                shiftDetails?.ShiftTypeId == 3 ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeSHiftThree}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                ) : (
                  <button
                    className={`btn ${
                      !checShift2Close == true ? "btn-secondary" : "btn-primary"
                    } mr-2`}
                    onClick={openSHiftThree}
                    style={{ width: "100%" }}
                    disabled={
                      outletDetails == 0 ||
                      (shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 1) ||
                      (shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 3) ||
                      !shiftDetails
                    }
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <Modal show={outletModalOpen} onHide={closeOutletModal} centered>
        <Modal.Body>
          <div className="row">
            <img
              src={checkcircle}
              alt="Check Circle"
              className="check-circle"
            />
            <p className="outletTitle">Open Outlet </p>
            <p className="outletTex">Do you want to open the outlet ?</p>
          </div>
          <div className="row">
            <div>
              <Button onClick={openOutletFn} className="confirmbtn">
                Yes
              </Button>
            </div>
            <div>
              <Button onClick={closeOutletModal} className="cancelBtn">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openCloseOtletModal}
        onHide={OpenCLoseOutletModalFn}
        centered
      >
        <Modal.Body>
          <div className="row">
            <img src={xcircle} alt="Check Circle" className="check-circle" />
            <p className="outletTitle">Close Outlet </p>
            <p className="outletTex">Do you want to close the outlet ?</p>
          </div>
          <div className="row">
            <div>
              <Button onClick={closeOutletFn} className="closeConfirmBtn">
                Yes
              </Button>
            </div>
            <div>
              <Button onClick={closeOutletModal} className="closecancelBtn">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Shifts;
