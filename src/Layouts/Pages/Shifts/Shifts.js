import React, { useState } from "react";
import "../../../assets/global.css";
import checkcircle from "../../../assets/Images/checkcircle.png";
import xcircle from "../../../assets/Images/xcircle.png";

import { Card, Button, Modal } from "react-bootstrap";

const Shifts = () => {
  const [outletOpen, setOutletOpen] = useState(false);
  const [shift1Open, setShift1Open] = useState(false);
  const [shift2Open, setShift2Open] = useState(false);
  const [shift3Open, setShift3Open] = useState(false);

  const [shift1close, setShift1close] = useState(false);
  const [shift2Close, setShift2Close] = useState(false);
  const [shift3Close, setShift3close] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [outletModalOpen, setOutletModalOpen] = useState(false);

  const [closeOutlet, setCloseOutlet] = useState(false);

  const openOutletModal = () => {
    setOutletModalOpen(true);
  };

  const closeOutletModal = () => {
    setOutletModalOpen(false);
  };

  const openOutletFn = () => {
    setOutletOpen(true);
    setOutletModalOpen(false);
  };

  const openShiftOne = () => {
    setShift1Open(true);
  };

  const closeShiftOne = () => {
    setShift1Open(false);
    setShift1close(true);
  };

  const openShiftTwo = () => {
    setShift2Open(true);
  };

  const closeShiftTwo = () => {
    setShift2Open(false);
    setShift2Close(true);
  };

  const openSHiftThree = () => {
    setShift3Open(true);
  };

  const closeSHiftThree = () => {
    setShift3Open(false);
    setShift3close(true);
  };

  const closeOutletFn = () => {
    setCloseOutlet(true);
    setOutletOpen(false);
    setShift1Open(false);
    setShift2Open(false);
    setShift3Open(false);
    setShift1close(false);
    setShift2Close(false);
    setShift3close(false);
    setIsOpen(false);
    setOpenCloseOutletModal(false);
  };

  console.log("shift3Close", shift3Close);
  console.log("outletOpen", outletOpen);

  const [openCloseOtletModal, setOpenCloseOutletModal] = useState(false);

  const OpenCLoseOutletModalFn = () => {
    setOpenCloseOutletModal(true);
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row d-flex justify-content-end">
          <div className="col-md-4 mb-5 d-flex justify-content-end">
            <Button variant="primary" onClick={openOutletModal}>
              Open Outlet
            </Button>
          </div>

          {shift3Close === true ? (
            <div className="col-md-4 mb-5 d-flex justify-content-end">
              <Button
                variant="danger"
                disabled={shift3Close === false}
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
                {shift1Open == false
                  ? "Shift one is close"
                  : "Shift one is open"}
              </div>
              <div className="card-footer">
                {shift1Open == false ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={openShiftOne}
                    style={{ width: "100%" }}
                    disabled={outletOpen === false}
                  >
                    Open
                  </button>
                ) : (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeShiftOne}
                    style={{ width: "100%" }}
                    disabled={outletOpen === false}
                  >
                    Close
                  </button>
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
                {shift2Open == false
                  ? "Shift two is close"
                  : "Shift two is open"}
              </div>
              <div className="card-footer">
                {shift2Open == false ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={openShiftTwo}
                    style={{ width: "100%" }}
                    disabled={
                      (shift1Open === false &&
                        outletOpen === false &&
                        shift1close == true) ||
                      shift1close == false
                    }
                  >
                    Open
                  </button>
                ) : (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeShiftTwo}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div class="Shiftcard">
              <p className="outletTex">Shift Three</p>
            </div>
            <div className={`card ${isOpen ? "open" : "closed"}`}>
              <div className="card-header">
                <h5 className="mb-0">Open the shift Three</h5>
              </div>
              <div className="card-body">
                {shift3Open == false
                  ? "Shift three is close"
                  : "Shift three is open"}
              </div>
              <div className="card-footer">
                {shift3Open == false ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={openSHiftThree}
                    style={{ width: "100%" }}
                    // disabled={
                    //   shift1Open === true ||
                    //   shift2Open === false ||
                    //   outletOpen === false
                    // }

                    disabled={
                      (shift1Open === true &&
                        outletOpen === false &&
                        shift1close == true &&
                        shift2Close == true) ||
                      shift2Close == false
                    }
                  >
                    Open
                  </button>
                ) : (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={closeSHiftThree}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
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
