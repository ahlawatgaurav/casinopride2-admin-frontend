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

  console.log(
    "AMount after discount---------------------->",
    BookingDetails[0]?.AmountAfterDiscount
  );
  console.log(
    "Actual amount---------------------->",
    BookingDetails[0]?.AmountAfterDiscount
  );

  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    let calculatedDiscount = 0;

    BookingDetails.forEach((bill) => {
      let billDiscount = 0;

      bill.ItemDetails.Price.forEach((itemPrice, index) => {
        const teensPrice = bill.TeensPrice || 0;
        const numOfTeens = bill.NumOfTeens || 0;
        const totalItemPrice = itemPrice + teensPrice * numOfTeens;

        const discountPercentage = bill.PanelDiscount / 100;
        const itemDiscount = totalItemPrice * discountPercentage;

        billDiscount += itemDiscount;
      });

      calculatedDiscount += billDiscount;
    });

    console.log("calculatedDiscount------------->", calculatedDiscount);
    setTotalDiscount(calculatedDiscount);
  }, [BookingDetails]);

  console.log("Booking Details------------------->", BookingDetails);

  console.log("totalDiscount------------------->", totalDiscount);

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
                    <span style={{ fontWeight: "bold" }}>{item.GuestName}</span>{" "}
                  </p>
                  {item.guestGSTIN ? (
                    <p className="BillPrintFont">
                      GUEST GSTIN :{" "}
                      <span
                        style={{ fontWeight: "bold" }}
                        className="BillPrintFont"
                      >
                        {item.guestGSTIN}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p className="BillPrintFont">
                    GUEST Mobile :
                    <span
                      className="guest-mobile"
                      style={{ fontWeight: "bold" }}
                    >
                      {item.Phone}
                    </span>
                  </p>
                  {item.guestState ? (
                    <p className="BillPrintFont">
                      GUEST STATE :
                      <span
                        className="guest-state BillPrintFont"
                        style={{ fontWeight: "bold" }}
                      >
                        {item.guestState}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p className="BillPrintFont">
                    Total Number of Guests :{" "}
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
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
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
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
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        ITEM NAME
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        Guest Count
                      </th>

                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        RATE
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        VALUE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails &&
                          item?.ItemDetails?.ItemName.map((item) => (
                            <p>{item}</p>
                          ))}
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        {item?.TotalGuestCount - item?.NumOfTeens}
                      </td>

                      <td
                        style={{ textAlign: "right" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails &&
                          item?.ItemDetails?.Rate.map((item) => (
                            <p>{parseFloat(item).toFixed(2)}</p>
                          ))}
                      </td>

                      <td
                        style={{ textAlign: "right" }}
                        className="BillPrintFont"
                      >
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

                    {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                      item?.TeensPrice > 0 && (
                        <tr>
                          <td
                            style={{ textAlign: "center" }}
                            className="BillPrintFont"
                          >
                            {item?.ItemDetails &&
                              item?.ItemDetails?.ItemName.map((item) => (
                                <p>Teens</p>
                              ))}
                          </td>

                          <td
                            style={{ textAlign: "center" }}
                            className="BillPrintFont"
                          >
                            {item?.NumOfTeens}
                          </td>

                          <td
                            style={{ textAlign: "right" }}
                            className="BillPrintFont"
                          >
                            {item?.TeensRate.toFixed(2)}
                          </td>

                          <td
                            style={{ textAlign: "right" }}
                            className="BillPrintFont"
                          >
                            {item?.TeensRate.toFixed(2)}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                  item?.TeensPrice > 0 ? (
                    <h6 className="BillPrintFont">
                      Total Amount:{" "}
                      {item?.ItemDetails && item?.TeensRate && (
                        <span className="BillPrintFont">
                          {(
                            parseFloat(
                              item?.ItemDetails?.packageGuestCount.reduce(
                                (acc, count, index) => {
                                  return (
                                    acc + count * item?.ItemDetails?.Rate[index]
                                  );
                                },
                                0
                              )
                            ) + item?.TeensRate
                          ).toFixed(2)}
                        </span>
                      )}
                    </h6>
                  ) : (
                    <h6 className="BillPrintFont">
                      Total Amount:
                      {item?.ItemDetails && (
                        <span className="BillPrintFont">
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
                  )}

                  {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                  item?.TeensPrice > 0 ? (
                    <>
                      {!item?.PackageName === null ? (
                        <></>
                      ) : (
                        <>
                          <h6 className="BillPrintFont">
                            CGST: {item?.ItemDetails.ItemTax / 2} %
                          </h6>
                          <h6 className="BillPrintFont">
                            SGST: {item?.ItemDetails.ItemTax / 2} %
                          </h6>{" "}
                        </>
                      )}
                      <h6 className="BillPrintFont">
                        Teens CGST: {item?.TeensTax / 2} %
                      </h6>
                      <h6 className="BillPrintFont">
                        Teens SGST: {item?.TeensTax / 2} %
                      </h6>
                      {/* <h6 className="BillPrintFont">
                        Bill Amount:{" "}
                        {item?.ItemDetails && (
                          <span>
                            {(
                              parseFloat(
                                (item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Rate[index]
                                    );
                                  },
                                  0
                                ) -
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Rate[index]
                                      );
                                    },
                                    0
                                  ) *
                                    (!BookingDetails[0]?.PanelDiscount == 0
                                      ? BookingDetails[0]?.PanelDiscount / 100
                                      : BookingDetails[0]?.CouponDiscount /
                                        100)) *
                                  (1 + item?.ItemDetails.ItemTax / 100)
                              ) +
                              ((item?.TeensRate * item?.TeensTax) / 100 +
                                item?.TeensRate)
                            ).toFixed(2)}
                          </span>
                        )}
                      </h6> */}

                      {item?.AmountAfterDiscount == 0 ? (
                        <h6 className="BillPrintFont">
                          Bill Amount :{" "}
                          {item?.ItemDetails && (
                            <span>
                              {parseFloat(
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Price[index]
                                    );
                                  },
                                  0
                                ) + (item?.TeensPrice || 0)
                              ).toFixed(2)}
                            </span>
                          )}
                        </h6>
                      ) : (
                        <h6 className="BillPrintFont">
                          Bill Amount :{" "}
                          {item?.ItemDetails && (
                            <span>
                              {parseFloat(
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Price[index]
                                    );
                                  },
                                  0
                                ) +
                                  (item?.TeensPrice || 0) -
                                  (item?.ActualAmount -
                                    item?.AmountAfterDiscount)
                              ).toFixed(2)}
                            </span>
                          )}
                        </h6>
                      )}
                    </>
                  ) : (
                    <>
                      {/* <h6 className="BillPrintFont">
                        CGST: {item?.ItemDetails.ItemTax / 2} %
                      </h6>
                      <h6 className="BillPrintFont">
                        SGST: {item?.ItemDetails.ItemTax / 2} %
                      </h6>
                      <h6 className="BillPrintFont">
                        Bill Amountt idk:{" "}
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
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Rate[index]
                                      );
                                    },
                                    0
                                  ) *
                                    (!BookingDetails[0]?.PanelDiscount == 0
                                      ? BookingDetails[0]?.PanelDiscount / 100
                                      : BookingDetails[0]?.CouponDiscount /
                                        100)) *
                                (1 + item?.ItemDetails.ItemTax / 100)
                              ).toFixed(0)
                            )}
                          </span>
                        )}
                      </h6> */}
                    </>
                  )}

                  {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                    <>
                      <h6 className="BillPrintFont">
                        VAT: {item?.ItemDetails.ItemTax} %
                      </h6>
                      <h6 className="BillPrintFont">
                        CGST: {item?.ItemDetails.ItemTax / 2} %
                      </h6>
                      <h6 className="BillPrintFont">
                        SGST: {item?.ItemDetails.ItemTax / 2} %
                      </h6>
                      <h6 className="BillPrintFont">
                        Bill Amount :{" "}
                        {item?.ItemDetails && (
                          <span>
                            {parseFloat(
                              (
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Rate[index]
                                    );
                                  },
                                  0
                                ) *
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
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    TERMS AND CONDITIONS
                  </h6>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                    1:30AM DURING WEEKDAYS.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                    2:00AM DURING WEEKEND.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                    GAMING AREA & PURCHASE CHIPS SEPARATELY.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
                    OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                    SELECTIVE LIQUOR PACKAGES.
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

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
