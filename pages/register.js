import React, { useEffect } from "react";
import Head from "next/head";
import { Image, message } from "antd";
import SignUp from "../components/Auth/SignUp";
import { app } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import router from "next/router";

export default function Register() {
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        message.info("Already logged in!!");
        router.push("/");
      }
    });
  });

  return (
    <div className="w-screen">
      <Head>
        <title>Sign Up | Splendid Packaging</title>
      </Head>

      <div className="relative">
        <div className="absolute top-5 left-11 z-10">
          <Image
            src="https://res.cloudinary.com/femzy123/image/upload/v1645026327/splendid/logo.png"
            width={59.53}
            height={57.94}
            preview={false}
            alt="logo"
          />
        </div>
      </div>

      <div>
        <SignUp />
      </div>
    </div>
  );
}
