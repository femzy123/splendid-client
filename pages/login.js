import React, { useEffect } from 'react'
import Head from "next/head";
import { Image, message } from "antd";
import SignIn from '../components/Auth/SignIn';
import { app } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import router from "next/router";

const Login = () => {
   const auth = getAuth(app);

   useEffect(() => {
     auth.onAuthStateChanged(function (user) {
       if (user) {
         router.push("/");
       }
     });
   });

  return (
    <div className="relative h-screen w-screen">
      <Head>
        <title>Login | Splendid Packaging</title>
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

      <SignIn />
    </div>
  );
}

export default Login