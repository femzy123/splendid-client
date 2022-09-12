import React, { useState } from "react";
import { Upload, Button, Space, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { storage } from "../../config/firebase-config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const { Dragger } = Upload;

const UploadId = ({ setIdUrl }) => {

  const onUpload = async (file) => {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        percentage === 100
          ? message.success("ID successfully uploaded")
          : message.loading("ID upload in progress");
      },
      (err) => {
        message.error(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIdUrl(downloadURL);
        });
      }
    );
  };

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error("Image must smaller than 1MB!");
    }
    // return isJpgOrPng && isLt2M;
    return isJpgOrPng;
  }

  return (
    // <Upload
    //   action={(file) => onUpload(file)}
    //   listType="picture"
    //   maxCount={1}
    //   beforeUpload={beforeUpload}
    // >
    //   <Button icon={<UploadOutlined />}>Upload Valid ID card</Button>
    // </Upload>
    <Dragger
      action={(file) => onUpload(file)}
      listType="picture"
      maxCount={1}
      beforeUpload={beforeUpload}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  );
};

export default UploadId;