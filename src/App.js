import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { FaGem, FaHeart } from "react-icons/fa"
import 'react-pro-sidebar/dist/css/styles.css';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Blood from './Admin/blood';
import Donation from './donations';
import Staff from './Admin/staff'

function App() {
  return (
    <>
      <div id="navbar">
        <ProSidebar>
          <SidebarHeader>Blood Bank</SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem icon={<FaGem />}>
                Home
                <Link to="/" />
              </MenuItem>
              <SubMenu title="Admin" icon={<FaHeart />}>
                <MenuItem>
                  Staff
                  <Link to="/staff" />
                </MenuItem>
                <MenuItem>
                  Blood
                  <Link to="/blood" />
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            Copyright
          </SidebarFooter>
        </ProSidebar>
      </div>
      <div id="contentbar" style={{border: "1px solid yellow"}}>
        <Routes>
          <Route path="/" element={<Donation />}></Route>
          <Route path="/blood" element={<Blood />}></Route>
          <Route path="/staff" element={<Staff />}></Route>
        </Routes>
      </div>
    </>
    
  );
}

export default App;
