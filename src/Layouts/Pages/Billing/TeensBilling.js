import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
// import QRCode from "qrcode.react";
import "../../../assets/Billing.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../../assets/Images/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePDF } from "react-to-pdf";
import moment from "moment";
import "../../../assets/global.css";
import { uploadBillFile } from "../../../Redux/actions/billing";

import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";

const TeensBilling = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [totalDiscount, setTotalDiscount] = useState(0);

  const [qrCodeData, setQrCodeData] = useState(
    "https://smartkhoj.nyc3.digitaloceanspaces.com/Module/BillFile_04-10-2023_09-42-14_combined_bill_%2854%29.pdf"
  );

  const [qrCodeImage, setQRCodeImage] = useState(null);

  useEffect(() => {
    QRCode.toCanvas(
      document.createElement("canvas"),
      qrCodeData,
      (error, canvas) => {
        if (error) {
          console.error("QR code generation error:", error);
        } else {
          const qrCodeDataURL = canvas.toDataURL("image/png");
          setQRCodeImage(qrCodeDataURL);
        }
      }
    );
  }, [qrCodeData]);

  const generatePDFAndSend = async () => {
    const elements = document.querySelectorAll(".thermal-bill");

    if (elements.length === 0) {
      console.log("No elements found with the class 'thermal-bill'");
      return;
    }

    // Create a container div and clone the elements into it
    const container = document.createElement("div");
    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    const opt = {
      margin: [10, 0, 0, 0],
      filename: "bill.pdf", // Change the filename as needed
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      const pdfBlob = await html2pdf().from(container).set(opt).outputPdf();

      console.log("PDF Blob:::::::::::::::::::", pdfBlob);

      const formData = new FormData();
      formData.append(
        "File",
        new Blob([pdfBlob], { type: "application/pdf" }),
        "bill.pdf"
      );
      formData.append("bookingId", 69);

      const callback = await new Promise((resolve, reject) => {
        dispatch(
          uploadBillFile(
            loginDetails?.logindata?.Token,
            formData,
            (callback) => {
              if (callback.status) {
                console.log(
                  "Callback pdf details---->",
                  callback?.response?.Details
                );
                resolve(callback);
              } else {
                toast.error(callback.error);
                reject(callback);
              }
            }
          )
        );
      });

      if (callback.status) {
        console.log("Upload successful.");
      } else {
        console.error("Upload failed:", callback.error);
      }
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    }
  };

  const generatePDF = async () => {
    const elements = document.querySelectorAll(".thermal-bill");
    const container = document.createElement("div");

    console.log("Container properties", container);

    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    document.body.appendChild(container);

    const opt = {
      margin: [10, 0, 0, 0],
      filename: "combined_bill.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(container).set(opt).save();

    document.body.removeChild(container);
  };

  const pdfRef = useRef(null);

  // Your component or function
  // const handleDownload = () => {
  //   const content = pdfRef.current;

  //   const doc = new jsPDF({
  //     orientation: "portrait", // or 'landscape'
  //     unit: "mm",
  //     format: [100, 1220], // [width, height]
  //     margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Adjust margins
  //   });

  //   const opt = {
  //     margin: [10, 10], // Adjust margins for html2canvas
  //     filename: "sample.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 1 }, // Adjust scale as needed
  //   };

  //   doc.html(content, {
  //     callback: function () {
  //       doc.save("sample.pdf");
  //     },
  //     ...opt,
  //   });
  // };

  return (
    <div>
      <div className="container-fluid">
        {BookingDetails && BookingDetails.length > 0 ? (
          BookingDetails?.map((item) => (
            <div
              className="thermal-bill"
              // style={{ height: "1120px", width: "80px" }}
              ref={pdfRef}
            >
              <div className="text-center">
                <img
                  src={logo}
                  alt="Casino Pride Logo"
                  className="logo-image"
                />
              </div>
              <p
                style={{
                  marginBottom: "20px",
                }}
                className="BillPrintFont"
              >
                A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
              </p>
              <div className="row">
                <div className="col-6 bill-details">
                  <p className="BillPrintFont">
                    GUEST NAME :
                    <span className="BillPrintFont">{item.GuestName}</span>{" "}
                  </p>
                  {item.guestGSTIN ? (
                    <p className="BillPrintFont">
                      GUEST GSTIN :{" "}
                      <span className="BillPrintFont">{item.guestGSTIN}</span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p className="BillPrintFont">
                    GUEST Mobile :
                    <span className="guest-mobile BillPrintFont">
                      {item.Phone}
                    </span>
                  </p>
                  {item.guestState ? (
                    <p className="BillPrintFont">
                      GUEST STATE :
                      <span className="guest-state BillPrintFont">
                        {item.guestState}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p className="BillPrintFont">
                    Total Number of Guests :{" "}
                    <span className="BillPrintFont">
                      {item.TotalGuestCount}
                    </span>
                  </p>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-end qr-code">
                    {qrCodeImage && (
                      <div className="qr-code-image">
                        <img src={qrCodeImage} alt="QR Code" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bill-details">
                <div className="date-time-bill-row">
                  <p className="BillPrintFont">
                    Date :
                    <span className="BillPrintFont">
                      {" "}
                      {moment(item?.BillingDate).format("YYYY-MM-DD")}
                    </span>
                  </p>

                  <p className="bill-number BillPrintFont">
                    BILL#: {item.BillNumber}
                  </p>
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
                        <p className="BillPrintFont">Teens</p>
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TotalGuestCount}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TeensRate.toFixed(2)}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TeensRate.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  <h6>Total Amount: {item?.TeensRate.toFixed(2)}</h6>

                  <h6>Teens CGST: {item?.TeensTax / 2} %</h6>
                  <h6>Teens SGST: {item?.TeensTax / 2} %</h6>

                  {item?.AmountAfterDiscount == 0 ? (
                    <h4>Bill Amountt: {item?.TeensPrice}</h4>
                  ) : (
                    <h4>
                      Bill Amountt:{" "}
                      {item?.TeensPrice -
                        (item?.ActualAmount - item?.AmountAfterDiscount)}
                    </h4>
                  )}
                </div>

                <div
                  className="terms"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    TERMS AND CONDITIONS
                  </h6>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                    1:30AM DURING WEEKDAYS.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                    2:00AM DURING WEEKEND.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                    GAMING AREA & PURCHASE CHIPS SEPARATELY.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
                    OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                    SELECTIVE LIQUOR PACKAGES.
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>

      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={generatePDFAndSend}
        >
          Complete Booking
        </button>
      </div>
    </div>
  );
};

export default TeensBilling;
