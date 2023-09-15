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

import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";

const BillingDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;

  console.log("Booking Details------------------->", BookingDetails);

  const [qrCodeData, setQrCodeData] = useState("www.facebook.com");

  const [qrCodeImage, setQRCodeImage] = useState(null);

  // Your data array (assuming it's named 'data')

  useEffect(() => {
    // Generate the QR code
    QRCode.toCanvas(
      document.createElement("canvas"),
      qrCodeData,
      (error, canvas) => {
        if (error) {
          console.error("QR code generation error:", error);
        } else {
          // Convert the canvas to a data URL
          const qrCodeDataURL = canvas.toDataURL("image/png");

          // Set the QR code image in the state
          setQRCodeImage(qrCodeDataURL);
        }
      }
    );
  }, [qrCodeData]);

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const a = document.createElement("a");
      a.href = qrCodeImage;
      a.download = "qrcode.png";
      a.click();
    } else {
      console.error("QR code image is not available yet.");
    }
  };

  // useEffect(() => {
  //   downloadQRCode();
  // }, []);

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

  const generatePDFw = () => {
    const element = document.querySelector(".thermal-billw");
    const opt = {
      margin: 10,
      filename: "bill.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  const twoPdfs = () => {
    generatePDF();
    generatePDFw();
  };

  return (
    <div>
      <div className="container-fluid">
        {BookingDetails &&
          BookingDetails?.map((item) => (
            <div className="thermal-bill" style={{ height: "1120px" }}>
              <div className="text-center">
                <img
                  src={logo}
                  alt="Casino Pride Logo"
                  className="logo-image"
                />
              </div>
              <div className="row">
                <div className="col-6 bill-details">
                  <p>
                    GUEST NAME :
                    <span style={{ fontWeight: "bold" }}>{item.GuestName}</span>{" "}
                  </p>
                  {item.guestGSTIN ? (
                    <p>
                      GUEST GSTIN :{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {item.guestGSTIN}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p>
                    GUEST Mobile :
                    <span
                      className="guest-mobile"
                      style={{ fontWeight: "bold" }}
                    >
                      {item.Phone}
                    </span>
                  </p>
                  {item.guestState ? (
                    <p>
                      GUEST STATE :
                      <span
                        className="guest-state"
                        style={{ fontWeight: "bold" }}
                      >
                        {item.guestState}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p>
                    NO OF GUESTS :{" "}
                    <span style={{ fontWeight: "bold" }}>
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
                  <p>
                    Date :
                    <span style={{ fontWeight: "bold" }}>
                      {" "}
                      {moment(item?.BillingDate).format("YYYY-MM-DD")}
                    </span>
                  </p>

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
                        {item?.ItemDetails &&
                          item?.ItemDetails?.ItemName.map((item) => (
                            <p>{item}</p>
                          ))}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {item?.ItemDetails &&
                          item?.ItemDetails?.packageGuestCount.map((item) => (
                            <p>{item}</p>
                          ))}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {item?.ItemDetails &&
                          item?.ItemDetails?.Rate.map((item) => (
                            <p>{parseFloat(item).toFixed(2)}</p>
                          ))}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {item?.ItemDetails &&
                          item?.ItemDetails?.packageGuestCount.map(
                            (count, index) => (
                              <p key={index}>
                                {parseFloat(
                                  count * item?.ItemDetails?.Rate[index]
                                ).toFixed(2)}
                              </p>
                            )
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  {/* <h6>
                      Total Amount:
                      {item?.ItemDetails && (
                        <span>
                          {parseFloat(
                            (
                              item?.ItemDetails?.packageGuestCount.reduce(
                                (acc, count, index) => {
                                  return (
                                    acc + count * item?.ItemDetails?.Rate[index]
                                  );
                                },
                                0
                              ) + parseFloat(BookingDetails[0]?.TeensPrice)
                            ).toFixed(2)
                          )}
                        </span>
                      )}
                    </h6> */}

                  <h6>
                    Total Amount:
                    {item?.ItemDetails && (
                      <span>
                        {parseFloat(
                          item?.ItemDetails?.packageGuestCount
                            .reduce((acc, count, index) => {
                              return (
                                acc + count * item?.ItemDetails?.Rate[index]
                              );
                            }, 0)
                            .toFixed(2)
                        )}
                      </span>
                    )}
                  </h6>

                  <h6>
                    Discount:
                    {item?.ItemDetails && (
                      <span>
                        {parseFloat(
                          (
                            item?.ItemDetails?.packageGuestCount.reduce(
                              (acc, count, index) => {
                                return (
                                  acc + count * item?.ItemDetails?.Rate[index]
                                );
                              },
                              0
                            ) *
                            (BookingDetails[0]?.PanelDiscount / 100)
                          ).toFixed(2)
                        )}
                      </span>
                    )}
                  </h6>

                  <h6>
                    Amount After Discount:{" "}
                    {(
                      item?.ItemDetails?.packageGuestCount.reduce(
                        (acc, count, index) => {
                          return acc + count * item?.ItemDetails?.Rate[index];
                        },
                        0
                      ) +
                      parseFloat(BookingDetails[0]?.TeensPrice) -
                      (item?.ItemDetails &&
                        item?.ItemDetails?.packageGuestCount.reduce(
                          (acc, count, index) => {
                            return acc + count * item?.ItemDetails?.Rate[index];
                          },
                          0
                        ) *
                          (BookingDetails[0]?.PanelDiscount / 100))
                    ).toFixed(2)}
                  </h6>

                  {/* <h6>
                    Amount After Discount:{" "}
                    {item?.ItemDetails && (
                      <span>
                        {parseFloat(
                          item?.ItemDetails?.packageGuestCount
                            .reduce((acc, count, index) => {
                              return (
                                acc + count * item?.ItemDetails?.Rate[index]
                              );
                            }, 0)
                            .toFixed(2)
                        )}
                      </span>
                    )}
                  </h6> */}

                  {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                    <>
                      <h6>CGST: {item?.ItemDetails.ItemTax / 2} %</h6>
                      <h6>SGST: {item?.ItemDetails.ItemTax / 2} %</h6>
                      <h6>
                        Bill Amount:{" "}
                        {item?.ItemDetails && (
                          <span>
                            {parseFloat(
                              (
                                (item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Rate[index]
                                    );
                                  },
                                  0
                                ) -
                                  (item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Rate[index]
                                      );
                                    },
                                    0
                                  ) *
                                    BookingDetails[0]?.PanelDiscount) /
                                    100) *
                                (1 + item?.ItemDetails.ItemTax / 100)
                              ).toFixed(0)
                            )}
                          </span>
                        )}
                      </h6>
                    </>
                  ) : (
                    <></>
                  )}

                  {item?.ItemDetails?.ItemTaxName[0] == "VAT" ? (
                    <>
                      <h6>VAT: {item?.ItemDetails.ItemTax} %</h6>
                      <h6>
                        Bill Amount:{" "}
                        {item?.ItemDetails && (
                          <span>
                            {parseFloat(
                              (
                                (item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Rate[index]
                                    );
                                  },
                                  0
                                ) -
                                  (item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Rate[index]
                                      );
                                    },
                                    0
                                  ) *
                                    BookingDetails[0]?.PanelDiscount) /
                                    100) *
                                (1 + item?.ItemDetails.ItemTax / 100)
                              ).toFixed(0)
                            )}
                          </span>
                        )}
                      </h6>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className="terms"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  <h6 style={{ textAlign: "center", fontSize: "16px" }}>
                    TERMS AND CONDITIONS
                  </h6>
                  <p style={{ fontSize: "12px" }}>
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                    1:30AM DURING WEEKDAYS.
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                    2:00AM DURING WEEKEND.
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                    GAMING AREA & PURCHASE CHIPS SEPARATELY.
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
                    OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                    SELECTIVE LIQUOR PACKAGES.
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* <button onClick={generatePDF}>Generate PDF</button> */}

      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default BillingDetails;
