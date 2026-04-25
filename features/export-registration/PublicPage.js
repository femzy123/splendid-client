import Link from "next/link";
import { Alert, Card, Col, Row } from "antd";
import { COMPANY_LETTERHEAD } from "./constants";
import RegistrationForm from "./components/RegistrationForm";
import Image from "next/image";

const PublicPage = () => {
  return (
    <div className="min-h-screen bg-[#F6F4F0] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[28px] bg-[#3D1C34] px-6 py-8 text-white shadow-lg sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3 mt-4 mb-4">
              <Image
                src="https://splendidpackaging.com/wp-content/uploads/2021/05/SPLENDID-PACKAGING-LOGO_edied-114x111.png"
                alt="Splendid Packaging"
                width={100}
                height={100}
              />
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Export Shipping Registration Form
              </h1>
              <p className="max-w-2xl text-sm text-black sm:text-base">
                Complete this form to register export shipping details.
              </p>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <div className="space-y-4">
              <Card className="rounded-2xl border-[#E6DDD8] shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-[#3D1C34]">
                  Before you submit
                </h2>
                <ul className="space-y-3 text-sm text-[#5F5B57] space-y-4">
                  <li>
                    Use the exact shipper and consignee details..
                  </li>
                  <li>
                    Upload a clear image of your ID, this will be used for verification purposes.
                  </li>
                </ul>
              </Card>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div className="rounded-[28px] border border-[#E6DDD8] bg-[#FCFBF9] p-4 shadow-sm sm:p-6">
              <RegistrationForm />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PublicPage;
