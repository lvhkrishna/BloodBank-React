import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { FaGem, FaHeart } from "react-icons/fa"
import 'react-pro-sidebar/dist/css/styles.css';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Blood from './Admin/blood';
import Home from './home';
import Donation from './donations';
import Request from './requests'
import Staff from './Admin/staff'

function App() {
  return (
    <>
      <div id="navbar">
        <ProSidebar>
          <SidebarHeader>
            <div style={{marginLeft: "20px", pointerEvents: "none",
                fontSize: "calc(10px + 2vmin)", padding: "10px", color: "#4FE775"}}>
              Blood Bank
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem icon={<FaGem />}>
                Home
                <Link to="/" />
              </MenuItem>
              <MenuItem icon={<FaGem />}>
                Donations
                <Link to="/donation" />
              </MenuItem>
              <MenuItem icon={<FaGem />}>
                Requests
                <Link to="/Request" />
              </MenuItem>
              {/* <SubMenu title="Admin" icon={<FaHeart />}>
                <MenuItem>
                  Staff
                  <Link to="/staff" />
                </MenuItem>
                <MenuItem>
                  Blood
                  <Link to="/blood" />
                </MenuItem>
              </SubMenu> */}
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <div style={{marginLeft: "20px"}}>
              &copy;Copyright DB Comrades
            </div>
          </SidebarFooter>
        </ProSidebar>
      </div>
      <div id="contentbar">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/blood" element={<Blood />}></Route>
          <Route path="/staff" element={<Staff />}></Route>
          <Route path="/donation" element={<Donation />}></Route>
          <Route path="/request" element={<Request />}></Route>
        </Routes>
      </div>
    </>
    
  );
}

export default App;
