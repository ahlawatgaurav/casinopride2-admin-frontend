import "./App.css";
import LoginPage from "./Layouts/Pages/LoginPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Layouts/Pages/HomePage";
import CrudDemoPage from "./Layouts/Pages/CrudDemoPage";
import Layout from "./Layouts/Components/Layout";
import "rsuite/styles/index.less"; // or 'rsuite/dist/rsuite.min.css'
import ManagerList from "./Layouts/Pages/Users/ManagerList";
import AddUser from "./Layouts/Components/AddUser";
import GREList from "./Layouts/Pages/Users/GREList";
import MasterAgent from "./Layouts/Pages/Users/MasterAgent";
import AgentList from "./Layouts/Pages/Users/AgentList";
import DriverList from "./Layouts/Pages/Users/DriverList";
import AccountsList from "./Layouts/Pages/Users/AccountsList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/HomePage"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/CrudDemoPage"
          element={
            <Layout>
              <CrudDemoPage />
            </Layout>
          }
        />

        <Route
          path="/ManagerList"
          element={
            <Layout>
              <ManagerList />
            </Layout>
          }
        />

        <Route
          path="/AddUser"
          element={
            <Layout>
              <AddUser />
            </Layout>
          }
        />
        <Route
          path="/GREList"
          element={
            <Layout>
              <GREList />
            </Layout>
          }
        />

        <Route
          path="/DriverList"
          element={
            <Layout>
              <DriverList />
            </Layout>
          }
        />

        <Route
          path="/MasterAgent"
          element={
            <Layout>
              <MasterAgent />
            </Layout>
          }
        />

        <Route
          path="/AgentList"
          element={
            <Layout>
              <AgentList />
            </Layout>
          }
        />

        <Route
          path="/AccountsList"
          element={
            <Layout>
              <AccountsList />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
