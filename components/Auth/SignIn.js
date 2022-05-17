import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Form, Input, Button, message, Image } from "antd";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const { Item } = Form;

const SignIn = () => {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    try {
      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          router.push("/");
        }
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      message.error("Error " + errorCode + ": " + errorMessage);
    }
  };

  return (
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
        <h2 className="font-semibold text-2xl mb-8 text-center">Login</h2>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          className="w-[80%] lg:w-[60%]"
        >
          <Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Item>

          <Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Item>

          <Item wrapperCol={{ span: 24 }}>
            <Button
              className="bg-[#7A3868] text-white"
              type="primary"
              htmlType="submit"
              block
            >
              Submit
            </Button>
          </Item>
        </Form>
        <p className="text-blue-500 cursor-pointer" onClick={() => router.push("/forgotPassword")}>Forgot email?</p>
        <p className="text-center font-semibold">
          Don&apos;t have an account?{" "}
          <span className="text-blue-500">
            <Link href="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
