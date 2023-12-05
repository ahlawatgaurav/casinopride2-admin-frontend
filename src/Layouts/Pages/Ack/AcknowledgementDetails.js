import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchBookingDetailsById,
  updateBookingForPayAtCounterFn,
} from "../../../Redux/actions/booking";
import {
  AddBillingDetails,
  AddupdateAgentSettlement,
} from "../../../Redux/actions/billing";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { getUserById } from "../../../Redux/actions/users";

const AcknowledgementDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [partCash, setPartCash] = useState("");
  const [partCard, setPartCard] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setamount] = useState("");
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [cardHoldersName, setcardHoldersName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");

  const [paymentOption, setPaymentOption] = useState("");
  const handlePaymentSelection = (event) => {
    // Update the selected option when the user makes a selection
    setPaymentOption(event.target.value);

    console.log("payment selection----->", event.target.value);

    const DiscountedAmount = bookingData?.amountAfterDiscount;
    setcardHoldersName("");
    setCardNumber("");
    setCardType("");

    if (event.target.value == "Cash") {
      setCashAmount(DiscountedAmount);
      setUpiAmount("");
      setCardAmount("");
    } else if (event.target.value == "UPI") {
      setUpiAmount(DiscountedAmount);
      setCashAmount("");
      setCardAmount("");
    } else if (event.target.value == "Card") {
      setCardAmount(DiscountedAmount);
      setCashAmount("");
      setUpiAmount("");
    }
  };
  const [show, setShow] = useState(false);

  const [payAT, setPay] = useState(false);

  const [futureDate, setFutureDate] = useState();

  const [dateFromBackend, setDateFromBackend] = useState();

  const [comparisonResult, setComparisonResult] = useState("");
  const [disabledBtn, setDisableBtn] = useState(false);
  const [isDateInPast, setIsDateInPast] = useState(false);
  const [isDateInFuture, setIsDateInFuture] = useState(false);
  const [isPresentDate, setIsPresentDate] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const outletOpenDate = useSelector(
    (state) => state.users?.saveOutletDate?.Details?.OutletDate
  );

  const handleShow = () => setShow(true);
  const handleClose = () => {
    // navigate("/NewBooking");
    window.close();
    setShow(false);
  };

  const [loader, setLoader] = useState(false);
  const today = moment().format("YYYY-MM-DD");
  const todayOutletDate = moment(outletOpenDate).format("YYYY-MM-DD");

  console.log("today----------->", dateFromBackend);
  useEffect(() => {
    compareDates();
  }, [dateFromBackend, today]);

  function compareDates() {
    const backendDate = moment(dateFromBackend).startOf("day");
    const today = moment().startOf("day");

    if (backendDate.isBefore(today)) {
      // Condition 1: If the backendDate is before today
      setComparisonResult("Past date.");
      setIsDateInPast(true);
      setIsDateInFuture(false);
      setDisableBtn(true);
      setIsPresentDate(false);
    } else if (backendDate.isAfter(today)) {
      // Condition 2: If the backendDate is after today
      setComparisonResult("Future date");
      setIsDateInFuture(true);
      setIsDateInPast(false);
      setIsPresentDate(false);
      setDisableBtn(true);
    } else {
      // Condition 3: If the backendDate is neither before nor after today (i.e., they match)
      setComparisonResult("Dates match");
      setIsDateInPast(false);
      setIsDateInFuture(false);
      setDisableBtn(false);
      setIsPresentDate(true);
    }
  }

  console.log("comparisonResult------------>", comparisonResult);
  const [localAgentDetails, setLocalAgentDetails] = useState("");
  const [localAgentId, setLocalAgentId] = useState();
  useEffect(() => {
    if (!loginDetails) {
      navigate("/");
    } else {
      //.log("Hi");
      //setShow(true);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const BookingId = url.searchParams.get("BookingId");
    console.log("BookingId++++", BookingId);

    dispatch(
      fetchBookingDetailsById(
        loginDetails?.logindata?.Token,
        BookingId,
        (callback) => {
          if (callback.status) {
            console.log(
              "Callback---------get user bookings",
              callback?.response?.Details
            );
            console.log(
              "callback?.response?.Details?.FutureDate",
              callback?.response?.Details?.FutureDate
            );
            setDateFromBackend(callback?.response?.Details?.FutureDate);

            const data = {
              bookingId: callback?.response?.Details.Id,
              packageId: callback?.response?.Details.PackageId,
              packageGuestCount: callback?.response?.Details.PackageGuestCount,
              totalGuestCount: callback?.response?.Details.TotalGuestCount,
              bookingDate: callback?.response?.Details?.FutureDate,
              // billingDate: today,
              billingDate: todayOutletDate,
              teensCount: callback?.response?.Details.NumOfTeens,
              actualAmount: callback?.response?.Details.ActualAmount,
              amountAfterDiscount:
                callback?.response?.Details.AmountAfterDiscount,
              discount: callback?.response?.Details.PanelDiscount
                ? callback?.response?.Details.PanelDiscount
                : callback?.response?.Details.WebsiteDiscount
                ? callback?.response?.Details.WebsiteDiscount
                : callback?.response?.Details.CouponDiscount
                ? callback?.response?.Details.CouponDiscount
                : callback?.response?.Details.AgentPanelDiscount
                ? callback?.response?.Details.AgentPanelDiscount
                : 0,

              packageWeekdayPrice:
                callback?.response?.Details.PackageWeekdayPrice,
              packageWeekendPrice:
                callback?.response?.Details.PackageWeekendPrice,
              payAtCounter: callback?.response?.Details?.PayAtCounter,
            };

            if (callback?.response?.Details?.PayAtCounter != 1) {
              setShow(true);
            } else {
              if (
                callback?.response?.Details?.PayAtCounter == 1 &&
                callback?.response?.Details?.PaymentMode == null
              ) {
                setPay(true);
              } else {
                setPay(false);

                setShow(true);
              }
            }
            console.log("Data-----from ack booking>", data);
            setBookingData(data);
            dispatch(
              getUserById(callback?.response?.Details?.UserId, (callback) => {
                console.log("hii get user by Id>>callabck>>", callback);
                if (callback.status) {
                  console.log(
                    "callabck.response.details>>",
                    callback?.response?.Details
                  );
                  setLocalAgentId(callback?.response?.Details?.Id);
                  setLocalAgentDetails(callback?.response?.Details);
                } else {
                  toast.error(callback.error);
                }
              })
            );
            // dispatch(
            //   AddBillingDetails(
            //     loginDetails?.logindata?.Token,
            //     data,
            //     (callback) => {
            //       if (callback.status) {
            //         console.log(
            //           "Generate Bill --------------",
            //           callback?.response?.Details
            //         );

            //         if (
            //           callback?.response?.Details[0]?.NumOfTeens -
            //             callback?.response?.Details[0]?.TotalGuestCount ==
            //           0
            //         ) {
            //           navigate("/TeensBilling", {
            //             state: { BookingDetails: callback?.response?.Details },
            //           });
            //           setLoader(false);
            //         } else {
            //           navigate("/BillingDetails", {
            //             state: { BookingDetails: callback?.response?.Details },
            //           });
            //           setLoader(false);
            //         }

            //         toast.error(callback.error);
            //       } else {
            //         toast.error(callback.error);
            //         setLoader(false);
            //       }
            //     }
            //   )
            // );
          } else {
            console.log(callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  }, []);

  console.log("futureDate------------>", futureDate);
  console.log("today------->", today);

  const confirmBilling = () => {
    console.log("bookingData?.data--->", bookingData);
    dispatch(
      AddBillingDetails(
        loginDetails?.logindata?.Token,
        bookingData,
        (callback) => {
          if (callback.status) {
            console.log(
              "Generate Bill --------------",
              callback?.response?.Details
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
        }
      )
    );
  };

  const handleShowR = () => {
    // setShow(true)

    if (paymentOption == "") {
      toast.warning("Please select the payment option");
      setLoader(false);
    } else if (
      paymentOption == "Card" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == ""
    ) {
      toast.warning("Please enter all card details");
      setLoader(false);
    } else if (paymentOption == "UPI" && upiAmount == "") {
      toast.warning("Please enter upi details");
      setLoader(false);
    } else if (
      paymentOption == "Part Card / Part Cash" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == "" &&
      cashAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (
      paymentOption == "Part Card / Part UPI" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == "" &&
      upiAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (
      paymentOption == "Part Cash / Part UPI" &&
      cashAmount == "" &&
      upiAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (paymentOption == "Cash" && cashAmount == "") {
      toast.warning("Please enter the cash amount");
      setLoader(false);
    } else {
      onsubmit();
    }
  };

  const onsubmit = () => {
    setLoader(true);

    const data = {
      paymentMode: paymentOption,
      cardAmount: cardAmount,

      partCash: partCash,
      partCard: partCard,

      cashAmount: cashAmount,
      cardAmount: cardAmount,
      UPIAmount: upiAmount,
      cardHoldersName: cardHoldersName,
      cardNumber: cardNumber,
      cardType: cardType,
      UPIId: upiId,

      bookingId: bookingData?.bookingId,
    };

    console.log("Data from booking ------->", data);

    dispatch(
      updateBookingForPayAtCounterFn(
        loginDetails?.logindata?.Token,
        data,
        (callback) => {
          if (callback.status) {
            console.log(
              "booking details --------------?",
              callback?.response?.Details
            );

            setBookingData(callback?.response?.Details);

            toast.success("Booking details success");

            const data = {
              bookingId: callback?.response?.Details?.Id,
              packageId: callback?.response?.Details?.PackageId,
              packageGuestCount: callback?.response?.Details?.PackageGuestCount,
              totalGuestCount: callback?.response?.Details?.TotalGuestCount,
              bookingDate: callback?.response?.Details?.CreatedOn?.slice(0, 10),
              // billingDate: today,
              billingDate: todayOutletDate,
              teensCount: callback?.response?.Details?.NumOfTeens,
              actualAmount: callback?.response?.Details?.ActualAmount,
              amountAfterDiscount:
                callback?.response?.Details?.AmountAfterDiscount,
              // discount: callback?.response?.Details?.PanelDiscount
              //   ? callback?.response?.Details?.PanelDiscount
              //   : callback?.response?.Details?.CouponDiscount,
              discount: callback?.response?.Details.PanelDiscount
                ? callback?.response?.Details.PanelDiscount
                : callback?.response?.Details.WebsiteDiscount
                ? callback?.response?.Details.WebsiteDiscount
                : callback?.response?.Details.CouponDiscount
                ? callback?.response?.Details.CouponDiscount
                : callback?.response?.Details.AgentPanelDiscount
                ? callback?.response?.Details.AgentPanelDiscount
                : 0,
              packageWeekdayPrice:
                callback?.response?.Details?.PackageWeekdayPrice,
              packageWeekendPrice:
                callback?.response?.Details?.PackageWeekendPrice,
            };

            console.log("data------------>", data);

            dispatch(
              AddBillingDetails(
                loginDetails?.logindata?.Token,
                data,
                (callback4) => {
                  if (callback4.status) {
                    console.log(
                      "Generate Bill --------------?",
                      callback4?.response?.Details[0]?.NumOfTeens,
                      callback4?.response?.Details[0]?.TotalGuestCount
                    );

                    const AgentSettlemetDiscount =
                      localAgentDetails?.DiscountPercent -
                      callback?.response?.Details?.AgentPanelDiscount;

                    console.log(
                      "AgentSettlemetDiscount-------->",
                      AgentSettlemetDiscount
                    );

                    const calculateAmountAfterDiscount =
                      callback?.response?.Details?.ActualAmount *
                      (1 -
                        callback?.response?.Details?.AgentPanelDiscount / 100);

                    console.log(
                      "calculateAmountAfterDiscount",
                      calculateAmountAfterDiscount
                    );

                    const AgentSettlementAmount =
                      (calculateAmountAfterDiscount * AgentSettlemetDiscount) /
                      100;

                    const agentData = {
                      userId: localAgentDetails?.Id,
                      agentName: localAgentDetails?.Name,
                      userTypeId: localAgentDetails?.UserType,
                      settlementAmount: AgentSettlementAmount,
                      bookingDate:
                        callback?.response?.Details?.CreatedOn?.slice(0, 10),
                      bookingId: callback?.response?.Details?.Id,
                    };
                    dispatch(
                      AddupdateAgentSettlement(
                        agentData,
                        loginDetails?.logindata?.Token,
                        (callback2) => {
                          if (callback2.status) {
                            if (
                              callback4?.response?.Details[0]?.NumOfTeens -
                                callback4?.response?.Details[0]
                                  ?.TotalGuestCount ==
                              0
                            ) {
                              navigate("/TeensBilling", {
                                state: {
                                  BookingDetails: callback4?.response?.Details,
                                },
                              });
                              setLoader(false);
                            } else {
                              navigate("/BillingDetails", {
                                state: {
                                  BookingDetails: callback4?.response?.Details,
                                },
                              });
                              setLoader(false);
                            }

                            console.log(
                              "Callback add update details of agent discount seetlement amopunt---->",
                              callback2?.response?.Details
                            );

                            setLoader(false);

                            // resolve(callback);
                          } else {
                            toast.error(callback2.error);
                            // reject(callback);
                          }
                        }
                      )
                    );

                    toast.error(callback.error);
                  } else {
                    toast.error(callback.error);
                    setLoader(false);
                  }
                }
              )
            );

            // navigate("/GenerateBill", {
            //   state: { userData: callback?.response?.Details },
            // });
            // navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {isPresentDate ? (
            <Modal.Title>Confirm Booking</Modal.Title>
          ) : (
            <Modal.Title>Error</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {isPresentDate ? (
            <p>Do you want to continue with the booking?</p>
          ) : (
            <p></p>
          )}
          {isDateInFuture ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Sorry, this booking cannot be processed as it is scheduled for a
              future date.
            </p>
          ) : (
            <p></p>
          )}
          {isDateInPast ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Sorry, this booking cannot be processed as it was scheduled for a
              past date.
            </p>
          ) : (
            <p></p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isPresentDate ? (
            <Button variant="primary" onClick={confirmBilling}>
              Confirm
            </Button>
          ) : (
            <></>
          )}
        </Modal.Footer>
      </Modal>

      {payAT && (
        <div>
          <h2>Pay At Counter</h2>
          <div style={{ flexDirection: "row" }} className=" mt-5 col-lg-12">
            <h4 className=" ">
              {"         "}Amount Payable
              <span style={{ color: "red" }}>
                {" "}
                Rs. {bookingData?.amountAfterDiscount}{" "}
              </span>
            </h4>
          </div>
          <div className="col-lg-6">
            <br />
            <br />
            <label for="formGroupExampleInput " className="form_text">
              Payment Option <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="dropdown"
              class="form-control mt-2"
              value={paymentOption} // Set the selected option based on the state
              onChange={handlePaymentSelection} // Handle changes to the dropdown
            >
              <option value="">Select...</option>
              <option value="Cash">Cash </option>
              <option value="Card">Card </option>
              <option value="UPI">UPI </option>
              <option value="Part Card / Part Cash">
                Part Card / Part Cash
              </option>
              <option value="Part Card / Part UPI">Part Card / Part UPI</option>
              <option value="Part Cash / Part UPI">Part Cash / Part UPI</option>

              <option value="Company Settlement">Company Settlement </option>
            </select>
          </div>

          {paymentOption == "Cash" ? (
            <div className="row">
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Cash Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  // onChange={(e) => setCashAmount(e.target.value)}

                  defaultValue={cashAmount}
                  value={cashAmount}
                />
              </div>
            </div>
          ) : (
            <></>
          )}

          {paymentOption == "Card" ? (
            <>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Card Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => setCardAmount(e.target.value)}
                  value={cardAmount}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
                  onChange={(e) => setcardHoldersName(e.target.value)}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Card Type <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="dropdown"
                  class="form-control mt-2"
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          {paymentOption == "UPI" ? (
            <div className="row">
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  UPI Amount
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setUpiAmount(e.target.value)}
                  value={upiAmount}
                  defaultValue={upiAmount}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  UPI Id
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the UPI Id"
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}

          {paymentOption == "Part Card / Part Cash" ? (
            <>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Card Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setCardAmount(e.target.value)}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Cash Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
                  onChange={(e) => setcardHoldersName(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Card Type <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="dropdown"
                  class="form-control mt-2"
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          {paymentOption == "Part Card / Part UPI" ? (
            <>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Card Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setCardAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Online(UPI) Amount{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setUpiAmount(e.target.value)}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  UPI Id
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the UPI Id"
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
                  onChange={(e) => setcardHoldersName(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Card Type <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="dropdown"
                  class="form-control mt-2"
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          {paymentOption == "Part Cash / Part UPI" ? (
            <>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Cash <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Online(UPI) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the amount"
                  onChange={(e) => setUpiAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  UPI Id
                </label>
                <input
                  class="form-control mt-2"
                  type="text"
                  placeholder="Enter the UPI Id"
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <button
            onClick={handleShowR}
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            className="btn btn_colour mt-5 btn-lg"
          >
            {" "}
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default AcknowledgementDetails;
