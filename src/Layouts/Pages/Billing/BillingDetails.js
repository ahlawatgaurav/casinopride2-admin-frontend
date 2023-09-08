import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode.react";
import "../../../assets/Billing.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PDFDocument } from "pdf-lib";
import logo from "../../../assets/Images/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BillingDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;

  const [AllBookingDetails, setAllBookingDetails] = useState([]);

  console.log("Booking Details------------------->", BookingDetails);

  BookingDetails?.map((item) => {
    console.log("item--->", item?.ItemDetails);
  });

  const billRef = React.useRef();

  // const generatePDF = async () => {
  //   const elements = document.querySelectorAll(".thermal-bill");
  //   const container = document.createElement("div");

  //   elements.forEach((element) => {
  //     container.appendChild(element.cloneNode(true));
  //   });

  //   document.body.appendChild(container);

  //   // Add a delay to allow time for the QR code to render
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay time as needed

  //   const opt = {
  //     margin: 10,
  //     filename: "combined_bill.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   html2pdf().from(container).set(opt).save();

  //   document.body.removeChild(container);
  // };

  const generatePDF = async () => {
    const element = document.querySelector(".thermal-bill");
    const canvas = await html2canvas(element);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 10, 10, 180, 227); // Adjust the dimensions as needed

    pdf.save("bill.pdf");
  };

  // const generatePDF = () => {
  //   const element = document.querySelector(".thermal-bill");
  //   const opt = {
  //     margin: 10,
  //     filename: "bill.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   html2pdf().from(element).set(opt).save();
  // };

  const qrCodeData = "www.google.com";

  return (
    <div>
      <div className="container-fluid">
        {BookingDetails?.map((item) => (
          <div className="thermal-bill">
            <div className="text-center">
              <img src={logo} alt="Casino Pride Logo" className="logo-image" />
            </div>
            <div className="row">
              <div className="col-6 bill-details">
                <p>GUEST NAME: {item.GuestName}</p>
                <p>GUEST GSTIN: {item.guestGSTIN}</p>
                <p>
                  GUEST STATE & MOB:
                  <span className="guest-state">{item.guestState}</span>
                  <span className="guest-mobile">{item.Phone}</span>
                </p>
                <p>NO OF GUESTS: {item.TotalGuestCount}</p>
              </div>
              <div className="col-6">
                <div className="d-flex justify-content-end">
                  {qrCodeData && <QRCode value={qrCodeData} />}
                </div>
              </div>
            </div>
            <div className="bill-details">
              <div className="date-time-bill-row">
                <p>Date & Time: {item.BillingDate}</p>

                <p className="bill-number">BILL#: {item.BillNumber}</p>
              </div>
              <hr />
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>ITEM NAME</th>
                    <th style={{ textAlign: "center" }}>Guest Count</th>
                    <th style={{ textAlign: "center" }}>RATE</th>
                    <th style={{ textAlign: "center" }}>VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {item.ItemDetails &&
                        item.ItemDetails.ItemName.map((item) => <p>{item}</p>)}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {item.ItemDetails &&
                        item.ItemDetails.packageGuestCount.map((item) => (
                          <p>{parseFloat(item).toFixed(2)}</p>
                        ))}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {item.ItemDetails &&
                        item.ItemDetails.ItemWeekdayRate.map((item) => (
                          <p>{parseFloat(item).toFixed(2)}</p>
                        ))}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {item.ItemDetails &&
                        item.ItemDetails.packageGuestCount.map(
                          (count, index) => (
                            <p key={index}>
                              {parseFloat(
                                count * item.ItemDetails.ItemWeekdayRate[index]
                              ).toFixed(2)}
                            </p>
                          )
                        )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="totals" style={{ textAlign: "right" }}>
                <h6>
                  Total Amount:{" "}
                  {item.ItemDetails && (
                    <span>
                      {parseFloat(
                        item.ItemDetails.packageGuestCount
                          .reduce((acc, count, index) => {
                            return (
                              acc +
                              count * item.ItemDetails.ItemWeekdayRate[index]
                            );
                          }, 0)
                          .toFixed(2)
                      )}
                    </span>
                  )}
                </h6>
                <h6>CGST: {item?.ItemDetails.ItemTax / 2}</h6>
                <h6>SGST: {item?.ItemDetails.ItemTax / 2}</h6>
                <h6>
                  Bill Amount:{" "}
                  {item.ItemDetails && (
                    <span>
                      {item.ItemDetails.packageGuestCount.reduce(
                        (acc, count, index) => {
                          return (
                            acc +
                            count * item.ItemDetails.ItemWeekdayPrice[index]
                          );
                        },
                        0
                      )}
                    </span>
                  )}
                </h6>
              </div>
              <div className="terms">
                <h6 style={{ textAlign: "center" }}>TERMS AND CONDITIONS</h6>
                <p>
                  (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                  1:30AM DURING WEEKDAYS.
                </p>
                <p>
                  (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                  2:00AM DURING WEEKEND.
                </p>
                <p>
                  (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                  GAMING AREA & PURCHASE CHIPS SEPARATELY.
                </p>
                <p>
                  (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS OR
                  ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                  SELECTIVE LIQUOR PACKAGES.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default BillingDetails;
