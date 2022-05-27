/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Col, Row, Input } from "antd";
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
import Loading from "../Loading";
import ListShipments from "./ListShipments";

const CustomerShipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState(null);
  const [search, setSearch] = useState("");

  const getShipments = async () => {
    if (user) {
      const colRef = collection(db, "shipments");
      const q = query(colRef, where("customer.id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setShipments(
        orderBy(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ["date"],
        ["desc"])
      );
    }
  };

  useEffect(() => {
    getShipments();
  }, [user]);

  if (!shipments) {
    return <Loading />;
  }

  return (
    <div>
      <Row gutter={[24, 16]} className="flex items-center">
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <h1 className="text-2xl text-purple-600 font-semibold">
            Shipment List
          </h1>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <Input
            placeholder="Search Shipment"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
      {shipments && (
        <ListShipments
          shipments={
            search
              ? shipments.filter(
                  (shipment) =>
                    shipment.shipper
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    shipment.trackingNumber
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
              : shipments
          }
        />
      )}
    </div>
  );
};

export default CustomerShipments;
