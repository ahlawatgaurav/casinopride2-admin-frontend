import React, { useState } from "react";
import { Sidenav, Nav, Toggle } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import AdminIcon from "@rsuite/icons/Admin";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import PageIcon from "@rsuite/icons/Page";
import CouponIcon from "@rsuite/icons/Coupon";
import ExitIcon from "@rsuite/icons/Exit";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import CalendarIcon from "@rsuite/icons/Calendar";
import TagNumberIcon from "@rsuite/icons/TagNumber";
import logo from "../../assets/Images/logo.png";
import onlylogo from "../../assets/Images/onlylogo.png";
import { FaTimes } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../Redux/actions/auth";
import { ToastContainer, toast } from "react-toastify";
import ThreeColumnsIcon from "@rsuite/icons/ThreeColumns";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/NavBar.css";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState("1");

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const logoutFn = () => {
    const data = {
      UserId: loginDetails?.logindata?.userId,
    };

    dispatch(
      Logout(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          navigate("/");
        } else {
          toast.error("Invalid credentials");
        }
      })
    );
  };
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      {expanded ? (
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="logo-image"
            onClick={(expanded) => setExpanded(expanded)}
          />
        </div>
      ) : (
        <>
          {!expanded ? (
            <img
              src={onlylogo}
              alt="Logo"
              className="onlylogo-image"
              onClick={(expanded) => setExpanded(expanded)}
            />
          ) : (
            <FaTimes />
          )}
        </>
      )}
      <hr />
      <Sidenav expanded={expanded} defaultOpenKeys={["3", "4"]}>
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "3" ||
            loginDetails?.logindata?.UserType == "2" ? (
              <Nav.Item eventKey="10" icon={<TagNumberIcon />}>
                <Link to="/Shifts" className="links">
                  Shifts
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "3" ||
            loginDetails?.logindata?.UserType == "2" ? (
              <Nav.Item eventKey="1" icon={<PageIcon />}>
                <Link to="/BookingList" className="links">
                  Bookings
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "7" ||
            loginDetails?.logindata?.UserType == "3" ? (
              <Nav.Item eventKey="6" icon={<PageIcon />}>
                <Link to="/BillingList" className="links">
                  Billing
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}
            {loginDetails?.logindata?.UserType == "1" ? (
              <Nav.Menu
                placement="rightStart"
                eventKey="3"
                title="Users"
                icon={<AdminIcon />}
              >
                <Nav.Item eventKey="3-1">
                  <Link to="/ManagerList" className="links">
                    Manager
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-2">
                  <Link to="/GREList" className="links">
                    GRE
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-3">
                  {" "}
                  <Link to="/MasterAgent" className="links">
                    Master Agent
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-4">
                  <Link to="/AgentList" className="links">
                    Travel Agent
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-4">
                  <Link to="/DriverList" className="links">
                    Local Agent
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-4">
                  <Link to="/AccountsList" className="links">
                    Accounts
                  </Link>
                </Nav.Item>
              </Nav.Menu>
            ) : (
              <></>
            )}
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item eventKey="6" icon={<CouponIcon />}>
                <Link to="/CouponsList" className="links">
                  Coupons
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item eventKey="7" icon={<ThreeColumnsIcon />}>
                <Link to="/PackageList" className="links">
                  Packages
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item eventKey="7" icon={<CalendarIcon />}>
                <Link to="/FutureBookingDates" className="links">
                  Future Booking Dates
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ? (
              <Nav.Menu
                placement="rightStart"
                eventKey="10"
                title="Discounts"
                icon={<MagicIcon />}
              >
                {loginDetails?.logindata?.UserType == "4" ||
                loginDetails?.logindata?.UserType == "1" ? (
                  <Nav.Item eventKey="3-1">
                    <Link to="/Discountonwebsite" className="links">
                      Website Discounts
                    </Link>
                  </Nav.Item>
                ) : (
                  <></>
                )}
                <Nav.Item eventKey="3-2">
                  <Link to="/DiscountOnPanel" className="links">
                    Panel Discounts
                  </Link>
                </Nav.Item>
              </Nav.Menu>
            ) : (
              <></>
            )}

            <Nav.Item eventKey="6" icon={<ExitIcon />} onClick={logoutFn}>
              Logout
            </Nav.Item>
          </Nav>
          <ToastContainer />
        </Sidenav.Body>
        <Sidenav.Toggle
          expanded={expanded}
          onToggle={(expanded) => setExpanded(expanded)}
        />
      </Sidenav>
    </div>
  );
};

export default SideNav;
