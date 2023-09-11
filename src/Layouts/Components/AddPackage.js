import React, { useState, useEffect } from "react";
import { AddPackageDetails, editPackage } from "../../Redux/actions/users";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cancel from "../../assets/Images/cancel.png";

const AddPackage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("userData", userData);

  const formattedData = userData?.packageItems.map((item) => ({
    itemId: item?.Id,
    itemRef: item?.Ref,
    itemName: item.ItemName,
    itemWeekdayPrice: item.ItemWeekdayPrice,
    itemWeekendPrice: item.ItemWeekendPrice,
    itemWeekdayRate: item?.ItemWeekdayRate,
    itemWeekendRate: item?.ItemWeekendRate,
    itemTax: item.ItemTax,
    isDeductable: item.IsDeductable,
  }));

  console.log(formattedData);

  const [packageName, setPackageName] = useState(
    userData?.PackageName ? userData?.PackageName : ""
  );
  const [packageDescription, setPackageDescription] = useState(
    userData?.PackageDescription ? userData?.PackageDescription : ""
  );
  const [packageWeekdayPrice, setPackageWeekdayPrice] = useState(
    userData?.PackageWeekdayPrice ? userData?.PackageWeekdayPrice : 0
  );
  const [packageWeekendPrice, setPackageWeekendPrice] = useState(
    userData?.PackageWeekendPrice ? userData?.PackageWeekendPrice : 0
  );
  const [packageItems, setPackageItems] = useState(
    formattedData ? formattedData : []
  );
  const [packageTeensPrice, setPackageTeensPrice] = useState(
    userData?.PackageTeensPrice ? userData?.PackageTeensPrice : ""
  );

  const [packageEnabled, setPackageEnabled] = useState(
    userData?.packageEnabled ? userData?.packageEnabled : 0
  );

  const [packageActive, setPackageActive] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [itemWeekendPrice, setItemWeekendPrice] = useState();
  const [itemWeekdayPrice, setItemWeekdayPrice] = useState();
  const [itemName, setItemName] = useState();
  const [itemTax, setItemTax] = useState();

  const handleAddItem = () => {
    setPackageItems([
      ...packageItems,
      {
        itemName: "",
        itemWeekdayPrice: 0,
        itemWeekendPrice: 0,
        itemTax: 0,
        isDeductable: 0,
        itemWeekdayRate: 0,
        itemWeekendRate: 0,
      },
    ]);
  };

  const handleItemInputChange = (index, field, value) => {
    const updatedItems = [...packageItems];
    updatedItems[index][field] = value;

    if (
      field === "itemWeekdayPrice" ||
      field === "itemWeekendPrice" ||
      field === "itemTax"
    ) {
      const { itemWeekdayPrice, itemWeekendPrice, itemTax } =
        updatedItems[index];
      const calculatedWeekdayRate = calculateInvoiceAmount(
        itemWeekdayPrice,
        itemTax
      );
      const calculatedWeekendRate = calculateInvoiceAmount(
        itemWeekendPrice,
        itemTax
      );

      console.log("calculatedWeekdayRate----------->", calculatedWeekdayRate);
      console.log("calculatedWeekendRate----------->", calculatedWeekendRate);

      updatedItems[index].itemWeekdayRate =
        Math.round(calculatedWeekdayRate * 100) / 100;
      updatedItems[index].itemWeekendRate =
        Math.round(calculatedWeekendRate * 100) / 100;
    }
    console.log("updatedItems------------->", updatedItems);
    setPackageItems(updatedItems);
  };

  const areFieldsFilled = () => {
    return (
      packageName !== "" &&
      packageDescription !== "" &&
      packageItems.length > 0 &&
      packageItems[0]?.itemName !== "" &&
      packageItems[0]?.itemWeekdayPrice !== 0 &&
      packageItems[0]?.itemWeekendPrice !== 0 &&
      packageItems[0]?.itemTax !== 0 &&
      packageWeekdayPrice !== "" &&
      packageWeekendPrice !== ""
    );
  };

  useEffect(() => {
    setIsButtonDisabled(!areFieldsFilled());
  }, [
    packageName,
    packageDescription,
    packageItems,
    packageWeekdayPrice,
    packageWeekendPrice,
  ]);

  const [isChecked, setIsChecked] = useState(
    userData?.IsPackageEnabled ? userData?.IsPackageEnabled : 0
  );

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const taxRate = 28;
  const packagePrice = 2000;
  function calculateInvoiceAmount(packagePrice, taxRate) {
    // Ensure taxRate is a percentage (e.g., 28% as 0.28)
    // Calculate the invoice amount
    const invoiceAmount = (packagePrice * 100) / (100 + taxRate);
    console.log("<---------------invoiceAmount------------->", invoiceAmount);
    return invoiceAmount;
  }
  const invoiceAmount = calculateInvoiceAmount(packagePrice, taxRate);

  // console.log("package price--->", packagePrice);
  // console.log("tax--->", taxRate);
  // console.log("tax amount--->", invoiceAmount.toFixed(2));

  const handleSubmit = () => {
    if (
      packageName == "" ||
      packageDescription == "" ||
      packageItems == "" ||
      packageWeekdayPrice == "" ||
      packageWeekendPrice == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        packageName: packageName,
        packageDescription: packageDescription,
        packageWeekdayPrice: parseInt(packageWeekdayPrice),
        packageWeekendPrice: parseInt(packageWeekendPrice),
        numOfItems: packageItems.length,
        packageItems: packageItems,
        packageTeensPrice: packageTeensPrice,
        isPackageEnabled: 1,
      };

      dispatch(
        AddPackageDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("Package Added");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };
  const handlePackageEdit = () => {
    const data = {
      packageId: userData?.Id,
      packageRef: userData?.Ref,
      packageName: packageName,
      packageDescription: packageDescription,
      packageWeekdayPrice: parseInt(packageWeekdayPrice),
      packageWeekendPrice: parseInt(packageWeekendPrice),
      numOfItems: packageItems.length,
      packageItems: packageItems,
      packageTeensPrice: packageTeensPrice,
      isPackageEnabled: isChecked == "1" ? 1 : 0,
    };
    console.log("dataaaaa------------>", data);
    console.log(
      "<------------packageItems----------->",
      loginDetails?.logindata?.Token
    );

    dispatch(
      editPackage(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Package Edited");
          navigate(-1);
          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const handleRemoveItem = (indexToRemove) => {
    console.log("Handle remove item", indexToRemove);
    const updatedItems = packageItems.filter(
      (_, index) => index !== indexToRemove
    );
    setPackageItems(updatedItems);
    console.log("Updated Items------------------>", updatedItems);
  };

  return (
    <div>
      {" "}
      <div className="row">
        <ToastContainer />
        <h3 className="mb-4">Add Package</h3>
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Name
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            placeholder="Full Name"
            disabled={userData ? true : false}
            onChange={(e) => setPackageName(e.target.value)}
            defaultValue={userData?.PackageName}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Package Description
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Description"
            onChange={(e) => setPackageDescription(e.target.value)}
            defaultValue={userData?.PackageDescription}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Weekdays Price
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Package Weekdays Price"
            onChange={(e) => setPackageWeekdayPrice(e.target.value)}
            defaultValue={userData?.PackageWeekdayPrice}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Weekend Price
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Package Weekend Price"
            onChange={(e) => setPackageWeekendPrice(e.target.value)}
            defaultValue={userData?.PackageWeekendPrice}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Teens Price
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Package Weekend Price"
            onChange={(e) => setPackageTeensPrice(e.target.value)}
            defaultValue={userData?.PackageTeensPrice}
          />
        </div>

        <div className="col-lg-6 mt-5">
          <div className="form-check form-switch">
            <label for="formGroupExampleInput " className="form_text">
              Is package active
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="switch"
              checked={isChecked}
              onChange={handleToggle}
            />
          </div>
        </div>

        {!userData ? (
          <div className="row mt-4">
            {packageItems.map((item, index) => (
              <div key={index} className="col-lg-6 mb-5">
                <div className="row">
                  <div className="col-lg-6">
                    <h4 className="mb-3">Item {index + 1}</h4>
                  </div>
                  <div className="col-lg-6 d-flex justify-content-end">
                    <img
                      src={cancel}
                      className="cancel_img"
                      onClick={() => handleRemoveItem(index)}
                    />
                  </div>
                </div>

                <label for="formGroupExampleInput " className="form_text">
                  Item Name
                </label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemInputChange(index, "itemName", e.target.value)
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekday Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekday Price"
                  value={item.itemWeekdayPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekdayPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekend Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekend Price"
                  value={item.itemWeekendPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekendPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Tax %
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Tax"
                  value={item.itemTax}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemTax",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Discount to be deducted
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.isDeductable}
                    onChange={(e) =>
                      handleItemInputChange(
                        index,
                        "isDeductable",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                  <label className="form-check-label">Deductable</label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {userData ? (
          <div className="row mt-4">
            {packageItems?.map((item, index) => (
              <div key={index} className="col-lg-6 mb-5">
                <div className="row">
                  <div className="col-lg-6">
                    <h4 className="mb-3">Item {index + 1}</h4>
                  </div>
                  {!userData ? (
                    <div className="col-lg-6 d-flex justify-content-end">
                      <img
                        src={cancel}
                        className="cancel_img"
                        onClick={() => handleRemoveItem(index)}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <label for="formGroupExampleInput " className="form_text">
                  Item Name
                </label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Name"
                  defaultValue={item.itemName}
                  onChange={(e) =>
                    handleItemInputChange(index, "itemName", e.target.value)
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  weekday Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekday Price"
                  defaultValue={item.itemWeekdayPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekdayPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekend Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekend Price"
                  defaultValue={item.itemWeekendPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekendPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Tax
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Tax"
                  defaultValue={item.itemTax}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemTax",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Discount to be deducted
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={item.IsDeductable}
                    onChange={(e) =>
                      handleItemInputChange(
                        index,
                        "IsDeductable",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                  <label className="form-check-label">Deductable</label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="col-lg-12 mt-3">
            <button
              type="button"
              className="btn btn_colour mb-3"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="row mx-auto">
            <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
              <button
                style={{ paddingLeft: "150px", paddingRight: "150px" }}
                type="submit"
                className="btn btn_colour mt-5 btn-lg"
                onClick={handleSubmit}
                disabled={isButtonDisabled}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="row mx-auto">
            <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
              <button
                style={{ paddingLeft: "150px", paddingRight: "150px" }}
                type="submit"
                className="btn btn_colour mt-5 btn-lg"
                onClick={handlePackageEdit}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPackage;
