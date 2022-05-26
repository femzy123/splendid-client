import React from "react";
import { Layout, Menu, Image, Avatar, Tooltip, Badge } from "antd";
import SideBar from "./SideBar";
import { useAuth } from "../contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { BellFilled } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const auth = getAuth();

  const onSignOut = () => {
    signOut(auth).catch((error) => {
      console.log(error);
    });
  };

  const year = new Date().getFullYear();

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
            <div>
              <Badge
                size="small"
                count={5}
                title="some notification"
                offset={[-1, 4]}
              >
                <BellFilled className="text-lg" />
              </Badge>
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
