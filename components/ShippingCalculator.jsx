import Image from "next/image";
import { useEffect, useState } from "react";
import { BulbFilled} from "@ant-design/icons"
import { states } from "../utils/data";
import { Alert } from "antd";

const ShippingCalculator = () => {
  const [rate, setRate] = useState(4.5);
  const [originCountry, setOriginCountry] = useState("US");
  const [destinationCountry, setDestinationCountry] = useState("NG");
  const [measurement, setMeasurement] = useState("kg");
  const [volumetric, setVolumetric] = useState("in");
  const [weight, setWeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [freightMode, setFreightMode] = useState("");
  const [destinationState, setDestinationState] = useState("Lagos");
  const [currency, setCurrency] = useState("$")
  const [total, setTotal] = useState(0)
  const [batteryOr, setBatteryOr] = useState("")

  const countries = [
    {
      value: "US",
      label: "United States",
    },
    {
      value: "UK",
      label: "United Kingdom",
    },
    {
      value: "CN",
      label: "China",
    },
    {
      value: "SK",
      label: "South Korea",
    },
  ];

  useEffect(() => {
    if (originCountry !== "US") {
      setMeasurement("kg");
      setVolumetric("cm")
    } else {
      setMeasurement("lbs");
      setVolumetric("in");
    }
  }, [originCountry]);

  useEffect(() => {
    if (originCountry !== "UK") {
      setCurrency("$")
    } else {
      setCurrency("£")
    }
  }, [originCountry])

  useEffect(() => {
    if (originCountry === "US") {
      if(destinationState !== "Lagos") {
        freightMode === "air" ? setRate(5.5) : setRate(3)
      } else {
        freightMode === "air" ? setRate(4.5) : setRate(2)
      }
    } else if (originCountry === "UK") {
      if (destinationState !== "Lagos") {
        setRate(6.2);
      } else {
        setRate(5.2);
      }
    } else if (originCountry === "CN") {
      if (destinationState !== "Lagos") {
        if(freightMode === "air" && batteryOr === "phone") {
          setRate(21);
        } else if (freightMode === "air" && batteryOr === "battery") {
          setRate(13);
        } if (freightMode === "air" && batteryOr === "none") {
          setRate(11.5);
        } else {
          setRate(11.5);
        }
      } else {
        if (freightMode === "air" && batteryOr === "phone") {
          setRate(19.5);
        } else if (freightMode === "air" && batteryOr === "battery") {
          setRate(11.5);
        } else if (freightMode === "air" && batteryOr === "none") {
          setRate(10);
        } else if (freightMode === "ocean") {
          setRate(450);
        } else if (freightMode === "ocean" && batteryOr === "none") {
          setRate(450);
        } else if (freightMode === "ocean" && batteryOr === "battery") {
          setRate(640);
        } else {
          setRate(10);
        }
      }
    } else if (originCountry === "SK") {
      if (destinationState !== "Lagos") {
        setRate(17);
      } else {
        setRate(15.5);
      }
    }
  }, [originCountry,destinationState, freightMode, batteryOr])

  function getHigherNumber(num1, num2) {
    if (num1 >= num2) {
      return num1;
    } else {
      return num2;
    }
  }

  useEffect(() => {
      const weightPrice = weight * rate
      const volumetric = (((length * width * height) / 166) * rate).toFixed(2)
      setTotal(getHigherNumber(weightPrice, volumetric))
  }, [weight, rate, length, width, height]);

  return (
    <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold">
      <div className="border rounded-lg shadow-lg p-8">
        <div className="flex justify-center">
          <Image
            src="/images/package.jpg"
            alt="packaging"
            width={300}
            height={300}
          />
        </div>
        <div>
          <h2 className="my-4 text-2xl text-gray-500 font-semibold">
            Shipping Fee Covers:
          </h2>

          <ul className=" text-lg text-green-600 space-y-4 max-w-sm mb-6">
            <li>
              Storage & Shipping: Customs duties, taxes, VAT, and clearing fees.
            </li>
            <li>Free pickup (available in Lagos only).</li>
          </ul>

          <Alert
            message={
              <div>
                <p className="text-xs">
                  Packages that weigh from 1lb/kg - 5lbs/kg are a flat rate
                </p>
                <table className="w-full text-gray-400">
                  <tbody>
                    <tr className="">
                      <td className="p-4"></td>
                      <td className="p-4">Lagos</td>
                      <td className="p-4">Outside Lagos</td>
                    </tr>
                    <tr className="">
                      <td className="p-4">UK</td>
                      <td className="p-4">£25</td>
                      <td className="p-4">£30</td>
                    </tr>
                    <tr className="">
                      <td className="p-4">US</td>
                      <td className="p-4">$25</td>
                      <td className="p-4">$30</td>
                    </tr>
                  </tbody>
                </table>
                <p className="font-normal text-red-400 mt-2">
                  Note that electronics attract extra fees and a handling fee
                </p>
              </div>
            }
            type="info"
          />
        </div>
      </div>

      <div className="border rounded-lg shadow-lg p-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <label className="block text-gray-700">Origin Country</label>
            <select
              className="w-full mt-2 p-4 text-gray-600 text-lg border border-gray-300 rounded-md"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Destination Country</label>
            <select
              className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
            >
              <option value="NG">Nigeria</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Freight Mode</label>
          <select
            className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
            value={freightMode}
            onChange={(e) => setFreightMode(e.target.value)}
          >
            <option value="" disabled>
              Select Freight Mode
            </option>
            <option value="air">Air Freight</option>
            <option value="ocean">Ocean Freight</option>
          </select>
          {originCountry === "CN" && (
            <select
              className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
              value={batteryOr}
              onChange={(e) => setBatteryOr(e.target.value)}
            >
              <option value="" disabled>
                Select Item type
              </option>
              <option value="none">None</option>
              <option value="battery">Battery Laden</option>
              {freightMode === "air" && (
                <option value="phone">
                  Phones, Power Banks, Liquid, Magnetic and Cosmetic goods
                </option>
              )}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Weight of shipment ({measurement})
          </label>
          <input
            type="number"
            className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
            placeholder="Enter weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p className="">Shipping rate</p>
            <p className="text-right">
              {currency}
              {rate}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <label className="block text-gray-700">Length ({volumetric})</label>
            <input
              type="text"
              className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
              placeholder="Enter length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Width ({volumetric})</label>
            <input
              type="text"
              className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
              placeholder="Enter width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Height ({volumetric})</label>
            <input
              type="text"
              className="w-full mt-2 p-4 text-gray-600 text-lg  border border-gray-300 rounded-md"
              placeholder="Enter length"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Destination State</label>
          <select
            className="w-full mt-2 p-4 text-gray-600 text-lg border border-gray-300 rounded-md"
            value={destinationState}
            onChange={(e) => setDestinationState(e.target.value)}
          >
            <option value="" disabled>
              Select a State
            </option>
            {states.map((state, i) => (
              <option key={i} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-gray-700">
            Shipping fee: {currency}
            {total}
          </p>
          <h5 className="text-gray-700 text-lg font-bold">Total to pay</h5>
          <div className="w-1/2 bg-gray-300 p-2 text-xl font-semibold">
            {currency}
            {total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;
