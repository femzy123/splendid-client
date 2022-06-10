import { Form, Input, Button, message } from "antd";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Refer = ({client_name}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  

  const sendEmail = () => {
    if (name !== "" && email !== "") {
      const template_params = {
        client_name: client_name,
        invitee_name: name,
        invitee_email: email,
      };

      try {
        emailjs
          .send(
            "service_7v3uent",
            "template_upclt8c",
            template_params,
            process.env.NEXT_PUBLIC_FIREBASE_EMAILJS_PUBLIC_KEY
          )
          .then((result) => {
            message.success("Thank you! Referral sent successfully.");
            setName("");
            setEmail("");
            console.log(result);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      message.warning("Please fill all the referall fields")
    }
  };

  return (
    <div className="mt-4 rounded-[20px] bg-white p-4">
      <h4 className="text-sm font-semibold">Refer a Friend</h4>
      <hr className="my-2" />

      <Form layout="vertical" onFinish={sendEmail}>
        <Form.Item label="Name">
          <Input required value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <div className="space-x-4 my-4">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Refer Friend
          </button>
          <button className="text-purple-600 border border-purple-600 px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Refer;
