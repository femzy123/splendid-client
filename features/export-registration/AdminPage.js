import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Space, Statistic, message } from "antd";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { db } from "../../config/firebase-config";
import RegistrationDocument from "./components/RegistrationDocument";
import SubmissionDetailsDrawer from "./components/SubmissionDetailsDrawer";
import SubmissionListTable from "./components/SubmissionListTable";
import { EXPORT_REGISTRATIONS_COLLECTION } from "./constants";
import { downloadSubmissionPdf } from "./pdf";
import {
  getSearchableSubmissionText,
  sortSubmissionsByNewest,
} from "./utils";

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [printSubmission, setPrintSubmission] = useState(null);
  const [pendingPrint, setPendingPrint] = useState(false);

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Export Shipping Registration",
    pageStyle:
      "@page { size: A4; margin: 0; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }",
  });

  useEffect(() => {
    const submissionsQuery = query(
      collection(db, EXPORT_REGISTRATIONS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      submissionsQuery,
      (snapshot) => {
        const nextSubmissions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubmissions(sortSubmissionsByNewest(nextSubmissions));
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        message.error(error.message || "Unable to load submissions.");
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (pendingPrint && printSubmission && printRef.current) {
      handlePrint();
      setPendingPrint(false);
    }
  }, [handlePrint, pendingPrint, printSubmission]);

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredSubmissions = normalizedSearch
    ? submissions.filter((submission) =>
        getSearchableSubmissionText(submission).includes(normalizedSearch)
      )
    : submissions;

  const handleTablePageChange = (page, nextPageSize) => {
    setCurrentPage(page);
    setPageSize(nextPageSize);
  };

  const handleView = (submission) => {
    setActiveSubmission(submission);
    setDrawerOpen(true);
  };

  const triggerPrint = (submission) => {
    setPrintSubmission(submission);
    setPendingPrint(true);
  };

  const triggerDownloadPdf = async (submission) => {
    try {
      await downloadSubmissionPdf(submission);
    } catch (error) {
      message.error(error.message || "Unable to generate the PDF.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-[#3D1C34] px-6 py-8 text-white shadow-lg lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.12em] text-[#DDBF8C]">
              Admin Submissions
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Export registration records
            </h1>
            <p className="max-w-2xl text-sm text-black sm:text-base">
              Search submissions, adjust page size, open any record in a side
              panel, then print or download the one-page PDF document.
            </p>
          </div>
          <Button
            href="/export-shipping-registration"
            className="border-white bg-white text-[#3D1C34] hover:border-white hover:text-[#3D1C34]"
          >
            Open public form
          </Button>
        </div>

        <div className="mb-6 flex gap-4 flex-col md:flex-row justify-between">
          <Card className="w-full rounded-2xl border-[#E6DDD8] shadow-sm">
            <Statistic title="Total submissions" value={submissions.length} />
          </Card>
          <Card className="w-full rounded-2xl border-[#E6DDD8] shadow-sm">
            <Statistic title="Filtered results" value={filteredSubmissions.length} />
          </Card>
          <Card className="w-full rounded-2xl border-[#E6DDD8] shadow-sm">
            <Space direction="vertical" className="w-full">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-[#7A746F]">
                Search submissions
              </p>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search by ref, name, email, phone, origin..."
                value={searchValue}
                onChange={handleSearchChange}
              />
            </Space>
          </Card>
        </div>

        <div className="rounded-[28px] border border-[#E6DDD8] bg-white p-4 shadow-sm sm:p-6">
          <SubmissionListTable
            submissions={filteredSubmissions}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handleTablePageChange}
            onView={handleView}
            onPrint={triggerPrint}
            onDownloadPdf={triggerDownloadPdf}
          />
        </div>

        <SubmissionDetailsDrawer
          open={drawerOpen}
          submission={activeSubmission}
          onClose={() => {
            setDrawerOpen(false);
            setActiveSubmission(null);
          }}
          onPrint={triggerPrint}
          onDownloadPdf={triggerDownloadPdf}
        />

        <div
          style={{
            position: "absolute",
            left: "-10000px",
            top: 0,
          }}
        >
          {printSubmission ? (
            <RegistrationDocument
              ref={printRef}
              submission={printSubmission}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
