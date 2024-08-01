
import Head from "next/head";
import Header from "../components/Header";
import ShippingCalculator from "../components/ShippingCalculator";

const Calculator = () => {
  return (
    <div className="h-screen ">
      <Head>
        <title>Shipping Calculator | Splendid Packaging</title>
      </Head>
      <Header />

      <div className="px-6 md:px-36 flex flex-col items-center justify-center">
        <div className="max-w-xl text-center mt-20">
          <h1 className="text-2xl md:text-5xl font-bold">
            Calculate Your Shipping Cost
          </h1>
          <p className="text-sm mt-2">
            No hidden fees. No surprises. Easily estimate your shipping fee
            using our shipping calculator.
          </p>
        </div>

        <ShippingCalculator />
      </div>
    </div>
  );
};

export default Calculator;
