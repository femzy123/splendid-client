import { Button, Card, Modal, Input, message, Form, Image } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { EditOutlined, LockFilled } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { getAuth, updatePassword } from "firebase/auth";

const { Item } = Form;

const Customer = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const [editMode, setEditMode] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getCustomer = useCallback(async () => {
    if (!user) {
      setCustomer(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const colRef = collection(db, "customers");
      const q = query(colRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const customerRecord = querySnapshot.docs[0];

      if (!customerRecord) {
        setCustomer(null);
        return;
      }

      setCustomer({
        id: customerRecord.id,
        name: user.displayName || "",
        email: user.email || "",
        ...customerRecord.data(),
      });
    } catch (error) {
      message.error("Unable to load your profile right now");
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const changePassword = async () => {
    const currentUser = auth.currentUser;

    updatePassword(currentUser, password)
      .then(() => {
        message.success("Password changed successfully");
        setIsPasswordModalOpen(false);
        setPassword("");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const edit = () => {
    if (!customer) {
      return;
    }

    setPhone(customer.phone || "");
    setAddress(customer.address || "");
    setState(customer.state || "");
    setCountry(customer.country || "");
    setEditMode(true);
  };

  const onUpdate = async () => {
    if (!customer) {
      return;
    }

    const docRef = doc(db, "customers", customer.id);

    await updateDoc(docRef, {
      phone,
      address,
      state,
      country,
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
  }, [getCustomer]);

  const renderValue = (value) => value || "-";

  return (
    <div className="w-full flex items-center justify-center">
      {isLoading ? (
        <p className="text-purple-600">Loading profile...</p>
      ) : customer ? (
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
              <div className="text-brown-600">{renderValue(customer.name)}</div>
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                Email
              </div>
              <div className="text-brown-600">{renderValue(customer.email)}</div>
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
                  <div className="text-brown-600">
                    {renderValue(customer.phone)}
                  </div>
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
                <div className="text-brown-600">
                  {renderValue(customer.address)}
                </div>
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
                <div className="text-brown-600">{renderValue(customer.state)}</div>
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
                <div className="text-brown-600">
                  {renderValue(customer.country)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-start space-x-6 mb-4">
              <div className="w-[80px] text-white font-semibold text-center bg-purple-600 px-1 py-1 text-sm">
                ID
              </div>
              <div className="text-brown-600">
                {customer.idUrl ? (
                  <Image width={300} preview={false} src={customer.idUrl} alt="ID" />
                ) : (
                  <span>-</span>
                )}
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
      ) : (
        <div className="text-center">
          <h1 className="text-2xl text-purple-600">Profile</h1>
          <p className="mt-4 text-gray-500">
            No customer profile record was found for this account.
          </p>
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
};

export default Customer;
