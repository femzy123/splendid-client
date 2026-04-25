import Head from "next/head";
import PublicPage from "../features/export-registration/PublicPage";

const ExportShippingRegistrationPage = () => {
  return (
    <>
      <Head>
        <title>Export Shipping Registration | Splendid Packaging</title>
        <meta
          name="description"
          content="Submit export shipping registration details for Splendid Packaging."
        />
      </Head>
      <PublicPage />
    </>
  );
};

export default ExportShippingRegistrationPage;
