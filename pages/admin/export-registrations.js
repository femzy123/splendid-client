import Head from "next/head";
import AdminPage from "../../features/export-registration/AdminPage";

const ExportRegistrationAdminPage = () => {
  return (
    <>
      <Head>
        <title>Export Registrations Admin | Splendid Packaging</title>
        <meta
          name="description"
          content="Admin list for export shipping registration submissions."
        />
      </Head>
      <AdminPage />
    </>
  );
};

export default ExportRegistrationAdminPage;
