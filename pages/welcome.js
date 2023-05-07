import React from "react";
import Head from "next/head";
import { Image } from "antd";
import router from "next/router";
import Link from "next/link";

const Login = () => {
  return (
    <div className="relative h-screen w-screen bg-brown-100">
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

      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl mb-4">
          <span className="text-purple-600 font-bold">Congratulations!</span>{" "}
          Your Account has been created!
        </h1>
        <h3 className="text-xl mb-2 text-red-600">
          Please check your email for account details.
        </h3>

        <p>
          <Link href="/login">
            <a className="text-purple-600 text-sm font-semibold underline">
              Login
            </a>
          </Link>{" "}
          to your account.
        </p>
      </div>
    </div>
  );
};

export default Login;
