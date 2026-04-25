import { InboxOutlined } from "@ant-design/icons";
import { Alert, Button, Upload, message } from "antd";
import { storage } from "../../../config/firebase-config";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  createImagePreviewDataUrl,
  sanitizeFileName,
} from "../utils";

const { Dragger } = Upload;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const getStoragePath = (fileName) =>
  `export-registrations/${Date.now()}-${sanitizeFileName(fileName)}`;

const ImageUploadField = ({ uploadState, setUploadState }) => {
  const beforeUpload = (file) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      message.error("Only JPG and PNG images are allowed.");
      return false;
    }

    if (file.size / 1024 / 1024 > 1) {
      message.error("The uploaded image must be 1MB or smaller.");
      return false;
    }

    return true;
  };

  const handleUpload = async ({ file, onError, onProgress, onSuccess }) => {
    try {
      setUploadState({
        loading: true,
        url: "",
        previewDataUrl: "",
        fileName: file.name,
      });

      const previewDataUrl = await createImagePreviewDataUrl(file);
      const storageRef = ref(storage, getStoragePath(file.name));
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress({ percent });
        },
        (error) => {
          setUploadState({
            loading: false,
            url: "",
            previewDataUrl: "",
            fileName: "",
          });
          message.error(error.message || "Image upload failed.");
          onError(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadState({
            loading: false,
            url: downloadUrl,
            previewDataUrl,
            fileName: file.name,
          });
          message.success("Image uploaded successfully.");
          onSuccess({ url: downloadUrl });
        }
      );
    } catch (error) {
      setUploadState({
        loading: false,
        url: "",
        previewDataUrl: "",
        fileName: "",
      });
      message.error(error.message || "Unable to process the uploaded image.");
      onError(error);
    }
  };

  return (
    <div className="space-y-4">
      <Dragger
        accept=".jpg,.jpeg,.png"
        customRequest={handleUpload}
        listType="picture"
        maxCount={1}
        beforeUpload={beforeUpload}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text font-semibold">
          Click or drag an ID image to upload
        </p>
        <p className="ant-upload-hint">
          JPG or PNG only, maximum size 1MB.
        </p>
      </Dragger>

      {uploadState.url ? (
        <Alert
          type="success"
          showIcon
          message="Image ready"
          description={uploadState.fileName || "Uploaded ID image"}
          action={
            <Button
              size="small"
              onClick={() =>
                setUploadState({
                  loading: false,
                  url: "",
                  previewDataUrl: "",
                  fileName: "",
                })
              }
            >
              Remove
            </Button>
          }
        />
      ) : null}
    </div>
  );
};

export default ImageUploadField;
