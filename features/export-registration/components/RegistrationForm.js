import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Result,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../config/firebase-config";
import {
  COMPANY_LETTERHEAD,
  COUNTRY_OPTIONS,
  EXPORT_REGISTRATIONS_COLLECTION,
  REGISTRATION_FORM_FIELDS,
  SHIPMENT_TYPE_OPTIONS,
  TRANSPORT_OPTIONS,
} from "../constants";
import { getSubmissionReference } from "../utils";
import ImageUploadField from "./ImageUploadField";
import Link from "next/link";

const { TextArea } = Input;

const initialUploadState = {
  loading: false,
  url: "",
  previewDataUrl: "",
  fileName: "",
};

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [uploadState, setUploadState] = useState(initialUploadState);
  const [submitting, setSubmitting] = useState(false);
  const [createdReference, setCreatedReference] = useState("");

  const originCountry = Form.useWatch(
    REGISTRATION_FORM_FIELDS.originCountry,
    form,
  );
  const modeOfTransport = Form.useWatch(
    REGISTRATION_FORM_FIELDS.modeOfTransport,
    form,
  );
  const shipmentType = Form.useWatch(
    REGISTRATION_FORM_FIELDS.shipmentType,
    form,
  );
  const consigneeCountry = Form.useWatch(
    REGISTRATION_FORM_FIELDS.consigneeCountry,
    form,
  );

  const resetFeatureState = () => {
    form.resetFields();
    setUploadState(initialUploadState);
  };

  const buildPayload = (values) => ({
    shipperName: values.shipperName.trim(),
    shipperEmail: values.shipperEmail.trim(),
    shipperPhone: values.shipperPhone.trim(),
    shipperAddress: values.shipperAddress.trim(),
    originCountry: values.originCountry,
    originCountryOther:
      values.originCountry === "Other"
        ? values.originCountryOther?.trim() || ""
        : "",
    modeOfTransport: values.modeOfTransport,
    modeOfTransportOther:
      values.modeOfTransport === "Other"
        ? values.modeOfTransportOther?.trim() || ""
        : "",
    shipmentType: values.shipmentType,
    shipmentTypeOther:
      values.shipmentType === "Other"
        ? values.shipmentTypeOther?.trim() || ""
        : "",
    consigneeName: values.consigneeName.trim(),
    consigneePhone: values.consigneePhone.trim(),
    consigneeCountry: values.consigneeCountry,
    consigneeCountryOther:
      values.consigneeCountry === "Other"
        ? values.consigneeCountryOther?.trim() || ""
        : "",
    consigneeAddress: values.consigneeAddress.trim(),
    agreedToTerms: !!values.agreedToTerms,
    idImageUrl: uploadState.url,
    idImagePreview: uploadState.previewDataUrl,
    idImageName: uploadState.fileName,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
    submittedAt: new Date().toISOString(),
  });

  const handleSubmit = async (values) => {
    if (!uploadState.url) {
      message.error("Please upload the ID image before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const docRef = await addDoc(
        collection(db, EXPORT_REGISTRATIONS_COLLECTION),
        buildPayload(values),
      );

      setCreatedReference(getSubmissionReference({ id: docRef.id }));
      resetFeatureState();
      message.success("Form submitted successfully.");
    } catch (error) {
      message.error(error.message || "Unable to submit the form right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdReference) {
    return (
      <Result
        status="success"
        title="Registration submitted"
        subTitle={`Reference: ${createdReference}`}
        extra={[
          <Button
            type="primary"
            key="new"
            className="bg-[#7A3868] border-[#7A3868]"
            onClick={() => setCreatedReference("")}
          >
            Submit another form
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ agreedToTerms: false }}
      >
        <div className="rounded-2xl border border-[#E6DDD8] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#3D1C34]">
            Shipper Details
          </h2>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name (Shipper)"
                name={REGISTRATION_FORM_FIELDS.shipperName}
                rules={[{ required: true, message: "Enter the shipper name." }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address (Shipper)"
                name={REGISTRATION_FORM_FIELDS.shipperEmail}
                rules={[
                  { required: true, message: "Enter the shipper email." },
                  { type: "email", message: "Enter a valid email address." },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number (Shipper)"
                name={REGISTRATION_FORM_FIELDS.shipperPhone}
                rules={[
                  {
                    required: true,
                    message: "Enter the shipper phone number.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Origin Country"
                name={REGISTRATION_FORM_FIELDS.originCountry}
                rules={[
                  { required: true, message: "Choose the origin country." },
                ]}
              >
                <Select
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS.map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              </Form.Item>
            </Col>
            {originCountry === "Other" ? (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Origin Country (If Others)"
                  name={REGISTRATION_FORM_FIELDS.originCountryOther}
                  rules={[
                    {
                      required: true,
                      message: "Enter the origin country.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : null}
            <Col xs={24}>
              <Form.Item
                label="Address (Shipper)"
                name={REGISTRATION_FORM_FIELDS.shipperAddress}
                rules={[
                  { required: true, message: "Enter the shipper address." },
                ]}
              >
                <TextArea rows={3} showCount maxLength={220} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E6DDD8] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#3D1C34]">
            Shipment Details
          </h2>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mode of Transport"
                name={REGISTRATION_FORM_FIELDS.modeOfTransport}
                rules={[
                  { required: true, message: "Choose the mode of transport." },
                ]}
              >
                <Select
                  placeholder="Select mode"
                  options={TRANSPORT_OPTIONS.map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Type of Shipment"
                name={REGISTRATION_FORM_FIELDS.shipmentType}
                rules={[
                  { required: true, message: "Choose the type of shipment." },
                ]}
              >
                <Select
                  placeholder="Select type"
                  options={SHIPMENT_TYPE_OPTIONS.map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              </Form.Item>
            </Col>
            {modeOfTransport === "Other" ? (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Mode of Transport (If Others)"
                  name={REGISTRATION_FORM_FIELDS.modeOfTransportOther}
                  rules={[
                    {
                      required: true,
                      message: "Enter the transport mode.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : null}
            {shipmentType === "Other" ? (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Type of Shipment (If Others)"
                  name={REGISTRATION_FORM_FIELDS.shipmentTypeOther}
                  rules={[
                    {
                      required: true,
                      message: "Enter the shipment type.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : null}
            <Col xs={24}>
              <Form.Item
                label="Please upload a valid ID (Nigerian Driver's License or International Passport)"
                required
              >
                <ImageUploadField
                  uploadState={uploadState}
                  setUploadState={setUploadState}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E6DDD8] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#3D1C34]">
            Consignee Details
          </h2>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name (Consignee)"
                name={REGISTRATION_FORM_FIELDS.consigneeName}
                rules={[
                  { required: true, message: "Enter the consignee name." },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number (Consignee)"
                name={REGISTRATION_FORM_FIELDS.consigneePhone}
                rules={[
                  {
                    required: true,
                    message: "Enter the consignee phone number.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Consignee Country"
                name={REGISTRATION_FORM_FIELDS.consigneeCountry}
                rules={[
                  {
                    required: true,
                    message: "Choose the consignee country.",
                  },
                ]}
              >
                <Select
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS.map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              </Form.Item>
            </Col>
            {consigneeCountry === "Other" ? (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Consignee Country (If Others)"
                  name={REGISTRATION_FORM_FIELDS.consigneeCountryOther}
                  rules={[
                    {
                      required: true,
                      message: "Enter the consignee country.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : null}
            <Col xs={24}>
              <Form.Item
                label="Address (Consignee)"
                name={REGISTRATION_FORM_FIELDS.consigneeAddress}
                rules={[
                  { required: true, message: "Enter the consignee address." },
                ]}
              >
                <TextArea rows={3} showCount maxLength={220} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E6DDD8] bg-white p-6 shadow-sm">
          <Space direction="vertical" className="w-full" size="middle">
            <Form.Item
              name={REGISTRATION_FORM_FIELDS.agreedToTerms}
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must agree before submitting."),
                        ),
                },
              ]}
            >
              <Checkbox>
                I have read and agree to the{" "}
                <a
                  href="https://docs.google.com/document/d/11lAZ1fmL-qIpHp_3SOWrbH4kpMf2s_CvqB1c4IHhQHs/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Export Policy &amp; Terms of Splendid Packaging Logistics
                </a>
              </Checkbox>
            </Form.Item>

            <Space wrap>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={uploadState.loading}
                className="bg-[#7A3868] border-[#7A3868]"
              >
                Submit Registration
              </Button>
              <Button onClick={resetFeatureState}>Reset Form</Button>
            </Space>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationForm;
