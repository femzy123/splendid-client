import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Image, message, Form, Input, Button } from "antd";
import SignIn from "../components/Auth/SignIn";
import { app } from "../config/firebase-config";
import {
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import router from "next/router";

const { Item } = Form;

const ForgotPassword = () => {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        message.info("Already logged in!");
        router.push("/");
      }
    });
  });

  const sendPasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        message.success("Email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode === "auth/user-not-found") {
          message.error("Email not found in our records!");
        } else {
          message.error("Something went wrong! Please try again later");
        }
      });
  };

  return (
    <div className="relative h-screen w-screen">
      <Head>
        <title>Forgot Password | Splendid Packaging</title>
      </Head>

      <div className="absolute top-5 left-11 z-10">
        <Image
          src="https://res.cloudinary.com/femzy123/image/upload/v1645026327/splendid/logo.png"
          width={59.53}
          height={57.94}
          preview={false}
          alt="logo"
        />
      </div>

      <div className="h-screen w-screen flex items-center justify-between">
        <div className="hidden w-[50%] h-full p-10 lg:flex item-center justify-center">
          <Image
            className="w-full h-full mt-4"
            src="https://res.cloudinary.com/femzy123/image/upload/v1645026870/splendid/auth_img.png"
            preview={false}
            alt="warehouse"
          />
        </div>
        <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center bg-[#F6F4F0] p-6">
          <h2 className="font-semibold text-2xl mb-8 text-center">
            Reset Password
          </h2>

          <Form
            layout="vertical"
            onFinish={sendPasswordReset}
            className="w-[80%] lg:w-[60%]"
          >
            <Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Item>

            <Item wrapperCol={{ span: 24 }}>
              <Button
                className="bg-[#7A3868] text-white"
                type="primary"
                htmlType="submit"
                block
              >
                Reset Password
              </Button>
            </Item>
          </Form>
          <p
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
