/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
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
import Warehouse from './Warehouse';
import Refer from './Refer';
import Loading from '../../components/Loading';
import LatestShipments from './LatestShipments';

const Dashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState(null);
  const [procurements, setProcurements] = useState(null);
  const [warehouses, setWarehouses] = useState(null);

  const getShipments = async () => {
    if(user) {
      const colRef = collection(db, "shipments");
      const q = query(colRef, where("customer.id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setShipments(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
  }

  const fetchWarehouses = async () => {
    const colRef = collection(db, "warehouse");

    onSnapshot(colRef, (snapshot) => {
      const warehouses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Reorder so "Irving" is first
      const reordered = [
        ...warehouses.filter((w) => w.name === "Irving"),
        ...warehouses.filter((w) => w.name !== "Irving"),
      ];

      setWarehouses(reordered);
    });
  };

  useEffect(() => {
    getShipments();
    fetchWarehouses();
  }, [user])

  if(!shipments || !warehouses) {
    return <Loading />
  }

  return (
    <div>
      <Row gutter={[24, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          {shipments && (
            <DataCard
              title="Total Shipments"
              number={shipments.length}
              icon={<GiftFilled />}
            />
          )}
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          {shipments && (
            <DataCard
              title="Shipments Delivered"
              number={
                shipments.filter((shipment) => shipment.status === "Delivered")
                  .length
              }
              icon={<InboxOutlined />}
            />
          )}
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          {shipments && (
            <DataCard
              title="Shipments Pending"
              number={
                shipments.filter((shipment) => shipment.status !== "Delivered")
                  .length
              }
              icon={<DropboxOutlined />}
            />
          )}
        </Col>
      </Row>
      <Row gutter={[24, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          {warehouses && <Warehouse warehouses={warehouses} />}
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          {user && <Refer client_name={user.displayName} />}
        </Col>
      </Row>

      {shipments && (
        <LatestShipments shipments={shipments} />
      )}
    </div>
  );
}

export default Dashboard;
