import { Form, Input, Button, message } from "antd";
import React, { useState } from "react";

const Refer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onFinish = () => {
    console.log("Success");
    setName("");
    setEmail("");
    message.success("Referral sent successfully");
  }

  return (
    <div className="mt-4 rounded-[20px] bg-white p-4">
      <h4 className="text-sm font-semibold">Refer a Friend</h4>
      <hr className="my-2" />

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name">
          <Input />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>

        <div className="space-x-4 my-4">
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
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
