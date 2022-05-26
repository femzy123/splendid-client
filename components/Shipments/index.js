import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import DataCard from "./DataCard";
import { DropboxOutlined, InboxOutlined, GiftFilled } from "@ant-design/icons";
import {
  doc,
  onSnapshot,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { orderBy } from "lodash";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";

const Shipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState(null);

  const getShipments = async () =>
   {
    if (user) {
      const colRef = collection(db, "shipments");
      const q = query(colRef, where("customer.id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setShipments(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
  };

  return (
    <div>Hello</div>
  )
};

export default Shipments;