import React, {useState, useEffect} from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  DashboardOutlined,
  DropboxOutlined,
  HomeFilled,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const logoutStyle = {
  marginTop: "100px",
  position: "absolute",
  bottom: -100,
  width: "100%",
}

const {Item} = Menu;

const SideBar = ({ signOut }) => {
  const { user } = useAuth();


  return (
    <div className="text-[16px] relative">
      <Menu
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        className="mt-6 space-y-8 text-[16px]"
        selectedKeys={[1]}
      >
        <Item
          key="1"
          icon={<DashboardOutlined />}
          className="hover:bg-purple-100"
        >
          <Link href="/">Dashboard</Link>
        </Item>
        <Item
          key="2"
          icon={<UserOutlined />}
          className="hover:bg-purple-100"
        >
          <Link href="/shipments">Shipments</Link>
        </Item>
        <Item
          key="3"
          icon={<DropboxOutlined />}
          className="hover:bg-purple-100"
        >
          <Link href="/profile">Profile</Link>
        </Item>
        <Item
          key="4"
          onClick={() => signOut()}
          icon={<LogoutOutlined style={{ color: "red" }} />}
          className="hover:bg-purple-100"
          style={logoutStyle}
          // className="flex items-center ml-6 space-x-4 mt-24 text-red-600 cursor-pointer"
        >
          <p className="text-red-600 hover:text-red-600">Logout</p>
        </Item>
      </Menu>
    </div>
  );
};

export default SideBar;
