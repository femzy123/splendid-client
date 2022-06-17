/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Modal, Input, message, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import {EditOutlined, LockFilled} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import {
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import {
  getAuth,
  updatePassword,
} from "firebase/auth";

const {Item} = Form;

const Customer = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const [customer, setCustomer] = useState(null);
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getCustomer = async () => {
    if(user) {
      const colRef = collection(db, "customers");
      const q = query(colRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setCustomer(
        querySnapshot.docs.map((doc) => ({ name: user.displayName, email: user.email, ...doc.data() }))
      );
      console.log(
        querySnapshot.docs.map((doc) => ({
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          ...doc.data(),
        }))
      );
    }
  }

  const changePassword = async () => {
    const user = auth.currentUser;

    updatePassword(user, password)
      .then(() => {
        message.success("Password changed successfully");
        setIsPasswordModalOpen(false);
        setPassword("");
      })
      .catch((error) => {
        message.error(error.message)
        console.log(error);
      });
  }

  

  useEffect(() => {
    getCustomer();
  },[])

  return (
    <div>
      <h1 className="text-2xl text-purple-600">Profile</h1>
      {customer && (
        <Card className="rounded my-5 shadow-sm lg:w-max">
          <div className="flex items-center justify-end text-purple-600 space-x-3 font-semibold text-xs">
            <EditOutlined /> <p>Edit</p>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">Name</div>
            <div className="text-brown-600">{customer[0].name}</div>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">Email</div>
            <div className="text-brown-600">{customer[0].email}</div>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">Phone</div>
            <div className="text-brown-600">{customer[0].phone}</div>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">Address</div>
            <div className="text-brown-600">{customer[0].address}</div>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">State</div>
            <div className="text-brown-600">{customer[0].state}</div>
          </div>
          <div className="flex items-center justify-start space-x-6 mb-4">
            <div className="text-white bg-purple-600 px-1 text-sm">Country</div>
            <div className="text-brown-600">{customer[0].country}</div>
          </div>
          <div className="flex items-center justify-end my-6">
            <Button
              className="bg-purple-600 text-white hover:text-white rounded hover:bg-purple-500 flex items-center"
              icon={<LockFilled style={{ color: "white" }} />}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </Card>
      )}
      <Modal
        title="Change Password"
        centered
        visible={isPasswordModalOpen}
        onOk={() => {
          return null;
        }}
        onCancel={() => {
          setIsPasswordModalOpen(false);
        }}
        footer={[
          <Button key="back" onClick={() => setIsPasswordModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            className="bg-purple-600 text-white hover:text-white rounded hover:bg-purple-500"
            key="submit"
            type="primary"
            onClick={changePassword}
          >
            Change Password
          </Button>,
        ]}
      >
        <h6 className="text-purple-600 text-sm font-semibold mb-2">
          Enter a new Password
        </h6>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Customer;
