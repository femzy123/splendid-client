import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Input, Button, message, Image } from "antd";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePhoneNumber,
} from "firebase/auth";
import { db } from "../../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import UploadId from "./UploadId";
import axios from "axios";

const { Item } = Form;
const { TextArea } = Input;

const SignUp = () => {
  const auth = getAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [idUrl, setIdUrl] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async () => {
    if (confirm === password) {
      if (
        name === "" ||
        email === "" ||
        phone === "" ||
        password === "" ||
        address === ""
      ) {
        message.error("Please fill all the fields");
      } else {
        await axios
          .post("/api/createUser", {
            name,
            email,
            phone,
            password,
          })
          .then(async (res) => {
            if (res.status === 200) {
              const roledUser = await axios.post("/api/addCustomerUserRole", {
                uid: res.data.uid,
              });
              await addDoc(collection(db, "customers"), {
                userId: res.data.uid,
                address,
                idUrl,
              });
              setName("");
              setEmail("");
              setPhone("");
              setPassword("");
              setIdUrl("");
              setAddress("");
              message.success("Account created successfully");
              router.push("/welcome");
            }
          })
          .catch((err) => {
            message.error(err.message);
          });
      }
    } else {
      message.error("Passwords do not match");
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
        <h2 className="font-semibold text-2xl mt-6 mb-8 text-center">
          Register
        </h2>

        <Form
          layout="vertical"
          onFinish={handleRegister}
          className="w-[100%] lg:w-[60%]"
        >
          <Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your fullname!" }]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Item>

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

          <Item
            label="Confirm Password"
            name="confirm password"
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <Input.Password
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Item>

          <Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Item>

          <Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <TextArea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Item>

          <div className="mb-4">
            <UploadId setIdUrl={setIdUrl} />
          </div>

          
            <Button
              className="bg-purple-600 text-white my-2"
              // type="primary"
              htmlType="submit"
              block
            >
              Register
            </Button>
        </Form>
        <p className="text-center font-semibold">
          Already have an account?{" "}
          <span className="text-blue-500">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
