/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react";
import { Layout, Menu, Image, Avatar, Tooltip, Badge, Dropdown } from "antd";
import SideBar from "./SideBar";
import { useAuth } from "../contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { BellFilled } from "@ant-design/icons";
import {
  doc,
  onSnapshot,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const auth = getAuth();
  const [shipments, setShipments] = useState(null);

  const getShipments = async () => {
    if (user) {
      const colRef = collection(db, "shipments");
      const q = query(colRef, where("customer.id", "==", user.uid), where("paymentStatus", "!=", "paid"));
      const querySnapshot = await getDocs(q);
      setShipments(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
  };

  useEffect(() => {
    getShipments();
  }, [user]);

  const onSignOut = () => {
    signOut(auth).catch((error) => {
      console.log(error);
    });
  };

  const year = new Date().getFullYear();

  const menu = (
    <Menu
      items={[
        {
          label: <p className="text-red-500 text-xs">You have {shipments && shipments.length} unpaid shipments!</p>,
          key: "0",
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        className="bg-white"
      >
        <SideBar signOut={onSignOut} />
      </Sider>

      <Layout>
        <Header className="bg-white py-2 px-6">
          <div className="h-full flex items-center justify-between bg-white">
            <Image
              src="https://res.cloudinary.com/femzy123/image/upload/v1645026327/splendid/logo.png"
              width={50}
              height={48}
              preview={false}
              alt="logo"
            />

            <div className="flex items-center text-[16px] space-x-4 capitalize">
              <div className="cursor-pointer">
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Badge
                    size="small"
                    count={shipments && shipments.length}
                    title="some notification"
                    offset={[-1, 4]}
                  >
                    <BellFilled className="text-lg" />
                  </Badge>
                </Dropdown>
              </div>
              {user && (
                <Tooltip title={user.displayName.toUpperCase()}>
                  <Avatar className="bg-purple-600 text-white font-semibold">
                    {user.displayName.charAt(0)}
                  </Avatar>
                </Tooltip>
              )}
            </div>
          </div>
        </Header>
        <Content className="scrollbar-hide py-10 px-6">{children}</Content>
        <Footer
          className="p-0 my-4 text-purple-600 font-light"
          style={{
            textAlign: "center",
          }}
        >
          Splendid Packaging © {year}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
