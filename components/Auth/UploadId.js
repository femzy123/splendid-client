import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { storage } from "../../config/firebase-config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const { Dragger } = Upload;

const UploadId = ({ setIdUrl }) => {
  const onUpload = ({ file, onError, onSuccess, onProgress }) => {
    setIdUrl("");
    const storageRef = ref(storage, `ids/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const percent = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress({ percent });
      },
      (error) => {
        message.error(error.message || "ID upload failed");
        onError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setIdUrl(downloadURL);
          message.success("ID successfully uploaded");
          onSuccess({ url: downloadURL });
        } catch (error) {
          message.error(error.message || "Failed to retrieve uploaded ID");
          onError(error);
        }
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

    return isJpgOrPng && isLt2M;
  }

  return (
    <Dragger
      accept=".jpg,.jpeg,.png"
      customRequest={onUpload}
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
