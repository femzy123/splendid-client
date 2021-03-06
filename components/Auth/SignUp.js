import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Input, Button, message, Image } from "antd";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePhoneNumber,
  sendEmailVerification,
} from "firebase/auth";
import { db } from "../../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import UploadId from "./UploadId";
import axios from "axios";
import emailjs from "@emailjs/browser";

const { Item } = Form;
const { TextArea } = Input;

const uniqueId = "spl" + Math.round(Math.random() * 1000) + "c";

const SignUp = () => {
  const auth = getAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [idUrl, setIdUrl] = useState("");
  const [address, setAddress] = useState("");
  const [disableRegister, setDisableRegister] = useState(true)

useEffect(() => {
  if (
    name !== "" &&
    email !== "" &&
    phone !== "" &&
    password !== "" &&
    address !== "" &&
    state !== "" &&
    country !== "" &&
    idUrl !== ""
  ) {
    setDisableRegister(false);
  } else {
    setDisableRegister(true)
  }
}, [name, email, password, confirm, phone, state, country, idUrl, address])

  const handleRegister = async () => {
    if (confirm === password) {
      if (
        name === "" ||
        email === "" ||
        phone === "" ||
        password === "" ||
        address === "" ||
        state === "" ||
        country === "" ||
        idUrl === ""
      ) {
        message.error("Please fill all the fields");
      } else {
        await axios
          .post("/api/createUser", {
            name,
            email,
            password,
          })
          .then(async (res) => {
            if (res.status === 200) {
              const roledUser = await axios.post("/api/addCustomerUserRole", {
                uid: res.data.uid,
              });
              await addDoc(collection(db, "customers"), {
                userId: res.data.uid,
                uniqueId,
                phone,
                address,
                state,
                country,
                idUrl,
              });
              setName("");
              setEmail("");
              setPhone("");
              setPassword("");
              setIdUrl("");
              setAddress("");
              setState("");
              setCountry("");
              message.success("Account created successfully");
              sendWelcomeEmail();
              sendNotificationEmail();
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

  const sendWelcomeEmail = () => {
    const template_params = {
      client_name: name,
      client_email: email,
    };

    try {
      emailjs
        .send(
          "service_7v3uent",
          "template_e1f830t",
          template_params,
          process.env.NEXT_PUBLIC_FIREBASE_EMAILJS_PUBLIC_KEY
        )
        .then((result) => {
          console.log(result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sendNotificationEmail = () => {
    const template_params = {
      name,
      email,
      phone,
      address,
      state,
      country,
      idImage: idUrl
    };

    try {
      emailjs
        .send(
          "service_7v3uent",
          "template_b36laf4",
          template_params,
          process.env.NEXT_PUBLIC_FIREBASE_EMAILJS_PUBLIC_KEY
        )
        .then((result) => {
          console.log(result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen flex items-center justify-between">
      <div className="hidden w-[50%] h-full p-10 lg:flex item-center justify-center">
        <Image
          className="w-full h-full mt-4"
          src="https://res.cloudinary.com/femzy123/image/upload/v1645026870/splendid/auth_img.png"
          preview={false}
          alt="warehouse"
        />
      </div>
      <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center bg-[#F6F4F0] p-6">
        <div className="mt-6 mb-8 text-center">
          <h2 className="font-semibold text-2xl">
            Register
          </h2>
          <p className="text-red-600 text-xs">
            Please ensure to upload your ID and fill up all the fields
          </p>
        </div>
        <Form
          layout="vertical"
          onFinish={handleRegister}
          className="w-[100%] lg:w-[60%]"
        >
          <Item
            // label="Full Name"
            // name="name"
            rules={[{ required: true, message: "Please upload an ID!" }]}
          >
            <UploadId setIdUrl={setIdUrl} />
          </Item>
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

          <Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please enter your state!" }]}
          >
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </Item>

          <Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter your country!" }]}
          >
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Item>

          <Button
            className="bg-purple-600 text-white my-2"
            // type="primary"
            htmlType="submit"
            block
            disabled={disableRegister}
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
