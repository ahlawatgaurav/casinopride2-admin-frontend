import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

const Shifts = () => {
  const [outletOpen, setOutletOpen] = useState(false);
  const [shift1Open, setShift1Open] = useState(false);
  const [shift2Open, setShift2Open] = useState(false);
  const [shift3Open, setShift3Open] = useState(false);

  const handleToggleOutlet = () => {
    setOutletOpen(!outletOpen);
    setShift1Open(false);
    setShift2Open(false);
    setShift3Open(false);
  };

  const handleOpenShift = (shiftNumber) => {
    if (outletOpen) {
      if (shiftNumber === 1) {
        setShift1Open(true);
        setShift2Open(false);
        setShift3Open(false);
      } else if (shiftNumber === 2) {
        setShift2Open(true);
        setShift3Open(false);
      } else if (shiftNumber === 3) {
        setShift3Open(true);
      }
    }
  };

  const handleCloseShift = (shiftNumber) => {
    if (shiftNumber === 1) {
      setShift1Open(false);
    } else if (shiftNumber === 2) {
      setShift2Open(false);
    } else if (shiftNumber === 3) {
      setShift3Open(false);
    }
  };

  return (
    <div>
      <Card>
        <Card.Header>Outlet</Card.Header>
        <Card.Body>
          {outletOpen ? (
            <Button variant="danger" onClick={handleToggleOutlet}>
              Close Outlet
            </Button>
          ) : (
            <Button variant="success" onClick={handleToggleOutlet}>
              Open Outlet
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Shift 1</Card.Header>
        <Card.Body>
          {shift1Open ? (
            <>
              <p>Shift 1 is open.</p>
              <Button variant="danger" onClick={() => handleCloseShift(1)}>
                Close Shift
              </Button>
            </>
          ) : (
            <Button
              variant={
                outletOpen && !shift2Open && !shift3Open
                  ? "success"
                  : "secondary"
              }
              onClick={() => handleOpenShift(1)}
              disabled={!outletOpen || shift2Open || shift3Open}
            >
              {shift2Open || shift3Open ? "Shift Closed" : "Open Shift"}
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Shift 2</Card.Header>
        <Card.Body>
          {shift2Open ? (
            <>
              <p>Shift 2 is open.</p>
              <Button variant="danger" onClick={() => handleCloseShift(2)}>
                Close Shift
              </Button>
            </>
          ) : (
            <Button
              variant={outletOpen && !shift3Open ? "success" : "secondary"}
              onClick={() => handleOpenShift(2)}
              disabled={!outletOpen || shift3Open}
            >
              {shift3Open ? "Shift Closed" : "Open Shift"}
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Shift 3</Card.Header>
        <Card.Body>
          {shift3Open ? (
            <>
              <p>Shift 3 is open.</p>
              <Button variant="danger" onClick={() => handleCloseShift(3)}>
                Close Shift
              </Button>
            </>
          ) : (
            <Button
              variant={outletOpen ? "success" : "secondary"}
              onClick={() => handleOpenShift(3)}
              disabled={!outletOpen}
            >
              {shift2Open ? "Shift Closed" : "Open Shift"}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Shifts;
