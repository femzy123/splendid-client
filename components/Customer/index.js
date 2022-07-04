/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Modal, Input, message, Form, Image } from 'antd';
import React, { useState, useEffect } from 'react';
import {EditOutlined, LockFilled} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { db, storage } from "../../config/firebase-config";
import {
  getAuth,
  updatePassword,
} from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";

const {Item} = Form;

const Customer = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const [editMode, setEditMode] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const deleteImage = () => {
    // Create a reference to the file to delete
    const desertRef = ref(
      storage,
      "https://firebasestorage.googleapis.com/v0/b/splendid-app.appspot.com/o/test.jpg?alt=media&token=2a480884-b53f-4704-aa44-31cf18760fdb"
    );

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted")
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("An error occured")
      });
  }

  const getCustomer = async () => {
    if(user) {
      const colRef = collection(db, "customers");
      const q = query(colRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setCustomer(
        querySnapshot.docs.map((doc) => ({ id: doc.id, name: user.displayName, email: user.email, ...doc.data() }))
      );
      console.log(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: user.displayName,
          email: user.email,
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

  const edit = () => {
    setPhone(customer[0].phone)
    setAddress(customer[0].address);
    setState(customer[0].state);
    setCountry(customer[0].country);
    setEditMode(true)
  }

  const onUpdate = async () => {
    const docRef = doc(db, "customers", customer[0].id);

    await updateDoc(docRef, {
     phone,
     address,
     state,
     country
    });
    setPhone("");
    setAddress("");
    setState("");
    setCountry("");
    setEditMode(false);
    message.success("Successfully updated!");
    getCustomer();
  };

  useEffect(() => {
    getCustomer();
  },[])

  return (
    <div className=" w-full flex items-center justify-center">
      {customer && (
        <div>
          <h1 className="text-2xl text-purple-600">Profile</h1>
          <Card className="rounded my-5 shadow-sm lg:w-max">
            <div className="flex items-center justify-end text-purple-600 space-x-3 font-semibold text-xs">
              {editMode ? (
                <Button onClick={onUpdate}>Update</Button>
              ) : (
                <Button
                  className="flex items-center"
                  icon={<EditOutlined />}
                  onClick={edit}
                >
                  Edit
                </Button>
              )}
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Name
              </div>
              <div className="text-brown-600">{customer[0].name}</div>
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Email
              </div>
              <div className="text-brown-600">{customer[0].email}</div>
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Phone
              </div>
              <div className="text-brown-600">
                {editMode ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <div className="text-brown-600">{customer[0].phone}</div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Address
              </div>
              {editMode ? (
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              ) : (
                <div className="text-brown-600">{customer[0].address}</div>
              )}
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                State
              </div>
              {editMode ? (
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              ) : (
                <div className="text-brown-600">{customer[0].state}</div>
              )}
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Country
              </div>
              {editMode ? (
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              ) : (
                <div className="text-brown-600">{customer[0].country}</div>
              )}
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                ID
              </div>
              <div className="text-brown-600">
                <Image
                  width={300}
                  preview={false}
                  src={customer[0].idUrl}
                  alt="ID"
                />
              </div>
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
        </div>
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
