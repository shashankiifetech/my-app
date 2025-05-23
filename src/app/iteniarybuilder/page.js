"use client";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineArrowLeft, AiOutlineUser, AiOutlineHome, AiOutlinePhone, AiOutlineCar } from "react-icons/ai";
import { FaSync, FaHotel, FaMapMarkedAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SearchableSelect from "@/components/SearchableSelect";

const data = [
  {
    id: 1,
    startDate: "2025-06-10",
    endDate: "2025-06-15",
    startLocation: "Delhi, India",
    endLocation: "Manali, Himachal Pradesh",
    totalAmountPerPax: 18500,
    advanceAmount: 5000,
    mapIncluded: true,
    numberOfPax: 4,
    transportMode: "Private Cab",
    accommodationType: "3-star Hotel",
    inclusions: ["Breakfast", "Dinner", "Sightseeing", "Toll & Taxes"],
    exclusions: ["Lunch", "Personal expenses", "Adventure activities"],
  },
  // ... other data
];

const defaultDay = (i, prevTo = "") => ({
  day: i + 1,
  from: i === 0 ? data[0].startLocation : prevTo,
  to: "",
  hotelName: "",
  hotel: {},
  hotelAmount: "",
  mapIncluded: false,
  hotelManagerName: "",
  hotelManagerNumber: "",
  vehicleAgencyName: "",
  vehicleAgency: "",
  vehicleAgencyNumber: "",
  notes: "",
});

const ItineraryBuilder = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const [detailTab, setDetailTab] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [numDays, setNumDays] = useState(3);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [error, setError] = useState(null);
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    router.refresh();
    setTimeout(() => setIsRotating(false), 1000);
  };

  const generateItinerary = () => {
    const newDays = [];
    for (let i = 0; i < numDays; i++) {
      newDays.push(defaultDay(i, newDays[i - 1]?.to || ""));
    }
    setItineraryDays(newDays);
  };

  const handleDayChange = (index, field, value) => {
    setItineraryDays((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      // Auto-fill next day's 'from' if 'to' is changed
      // if (field === "to" && index < updated.length - 1) {
      //   updated[index + 1].from = value;
      // }
      return updated;
    });
    console.log("Updated itinerary days:", itineraryDays);
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchSupport?q=${query}`
        );
        const data = await res.json();
        setResults(data.rows);
        setShowDropdown(true);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  // generate a unique number userId which is uuid
  const generateUserId = (id) => {
    //return in number format its a uuid convert to number
    return parseInt(id.replace(/-/g, ""), 16) % 1000000000; // Convert UUID to a number

  };


  const handleIternarySubmit = async () => {
    if (itineraryDays.length === 0) {
      setError("Please generate itinerary days first.");
      return;
    }
    //apply validation for each day if its missing any field
    for (const day of itineraryDays) {
      if (!day.from || !day.to || !day.hotelName || !day.hotelAmount || !day.vehicleAgencyName || !day.vehicleAgencyNumber || !day.hotelManagerName || !day.hotelManagerNumber) {
        setError("Please fill all required fields for each day.");
        return;
      }
    }
    setError(null);
    const clientData = {
      userId: generateUserId(selectedData.id),
      itinerary: itineraryDays,
    };
    console.log("Submitting itinerary data:", clientData);
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitItinerary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({clientData}),
      }
    );
    
    console.log(data)
    if (!data.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Failed to submit itinerary.");
      return;
    }
    else{
      setError(null);
      alert("Itinerary submitted successfully!");
      setDetailTab(false);
      setQuery("");
      setSelectedData(null);
      setItineraryDays([]);
    }


  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100\ p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium mb-4 transition-colors duration-200"
      >
        <AiOutlineArrowLeft size={22} />
        <span>Back</span>
      </button>

      {/* Header */}
      <header className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex justify-between items-center mt-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Itinerary Builder
        </h1>
        <div
          onClick={handleClick}
          className={`flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-200 hover:bg-blue-300 transition-all duration-200 cursor-pointer ${isRotating ? "animate-spin" : ""
            }`}
        >
          <FaSync />
        </div>
      </header>

      {!detailTab ? (
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="number"
            placeholder="Search support number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {query && showDropdown && (
            <div className="absolute mt-1 w-full max-h-[400px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow z-50">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setQuery(item.mobile);
                      if (item.mobile.length === 10) {
                        setDetailTab(true);
                        setSelectedData(item);
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{item.mobile}</span>
                      <span className="text-gray-500 text-sm">{item.name}</span>
                    </div>
                    <div className="text-gray-500 text-sm">{item.email}</div>
                    <div className="text-gray-500 text-sm">{item.message}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No results found.</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 mt-4 justify-center items-start">
          <div className="flex flex-col gap-2 md:flex-row">
            {/* User Details */}
            <div className="bg-white p-4 rounded-lg shadow-sm w-full">
              {selectedData && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <span className="inline-block bg-blue-100 p-2 rounded-full">
                      <AiOutlineUser className="w-5 h-5 text-blue-500" />
                    </span>
                    User Info
                  </h2>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      <strong>Name:</strong> {selectedData.name}
                    </p>
                    <p className="mb-2">
                      <strong>Mobile:</strong> {selectedData.mobile}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setDetailTab(false)}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Search
              </button>
            </div>

            {/* Itinerary Info */}
            <div className="bg-white p-4 rounded-lg shadow-sm w-full">
              {data[0] && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <span className="inline-block bg-blue-100 p-2 rounded-full">
                      <FaHotel className="w-5 h-5 text-blue-500" />
                    </span>
                    Itinerary
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>From:</strong> {data[0].startLocation}
                    </p>
                    <p>
                      <strong>To:</strong> {data[0].endLocation}
                    </p>
                    <p>
                      <strong>Amount/Pax:</strong> ₹{data[0].totalAmountPerPax}
                    </p>
                    <p>
                      <strong>Advance:</strong> ₹{data[0].advanceAmount}
                    </p>
                    <p>
                      <strong>Pax Count:</strong> {data[0].numberOfPax}
                    </p>
                    <p>
                      <strong>Includes:</strong> {data[0].inclusions.join(", ")}
                    </p>
                    <p>
                      <strong>Excludes:</strong> {data[0].exclusions.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-md flex gap-4 justify-center items-center">
            <label className="text-sm font-medium">Days:</label>
            <input
              type="number"
              min={1}
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
              className="mt-1 w-1/2 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateItinerary}
              className="w-[100px] py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Generate
            </button>
          </div>
          {itineraryDays.length > 0 && (
            <div className="space-y-6">
              {itineraryDays.map((day, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow mt-4">
                  <h4 className="text-lg font-semibold mb-2">Day {day.day}</h4>

                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-sm text-gray-500">
                      <FaMapMarkedAlt className="inline mr-1" />
                      From:{" "}
                      <input
                        type="text"
                        value={day.from}
                        onChange={(e) =>
                          handleDayChange(index, "from", e.target.value)
                        }
                        placeholder="Destination"
                        className="border-b border-gray-300 focus:outline-none ml-1 w-[155px]"
                      />
                    </span>
                    <span className="text-sm text-gray-500">
                      <FaMapMarkedAlt className="inline mr-1" />
                      To:{" "}
                      <input
                        type="text"
                        value={day.to}
                        onChange={(e) =>
                          handleDayChange(index, "to", e.target.value)
                        }
                        placeholder="Destination"
                        className="border-b border-gray-300 focus:outline-none ml-1 w-[155px]"
                      />
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FaHotel className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Hotel Name
                        </label>
                        <SearchableSelect
                          placeholder="Search hotel..."
                          fetchUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/api/searchHotels`}
                          onSelect={(hotel) => {
                            handleDayChange(index, "hotelName", hotel.name)
                            handleDayChange(index, "hotel", hotel)

                          }
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlineHome className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Hotel Amount
                        </label>
                        <input
                          type="number"
                          placeholder="Enter hotel amount"
                          value={day.hotelAmount}
                          onChange={(e) =>
                            handleDayChange(index, "hotelAmount", e.target.value)
                          }
                          className="w-full border-b-2 border-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkedAlt className="text-sky-500 text-lg" />
                      <div className="w-full flex items-center">
                        <label className="text-xs text-black opacity-50 font-['Roboto'] mr-2">
                          MAP Included
                        </label>
                        <input
                          type="checkbox"
                          checked={day.mapIncluded}
                          onChange={(e) =>
                            handleDayChange(index, "mapIncluded", e.target.checked)
                          }
                          className="accent-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlineUser className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Hotel Manager Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter manager name"
                          value={day.hotelManagerName}
                          onChange={(e) =>
                            handleDayChange(index, "hotelManagerName", e.target.value)
                          }
                          className="w-full border-b-2 border-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlinePhone className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Hotel Manager Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter manager number"
                          value={day.hotelManagerNumber}
                          onChange={(e) =>
                            handleDayChange(index, "hotelManagerNumber", e.target.value)
                          }
                          className="w-full border-b-2 border-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlineCar className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Vehicle Agency Name
                        </label>
                        {/* <input
                          type="text"
                          placeholder="Enter captain name"
                          value={day.vehicleCaptainName}
                          onChange={(e) =>
                            handleDayChange(index, "vehicleCaptainName", e.target.value)
                          }
                          className="w-full border-b-2 border-gray-300 focus:outline-none bg-transparent"
                        /> */}
                        <SearchableSelect
                          placeholder="Search agency..."
                          fetchUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/api/searchAgencys`}
                          onSelect={(agency) => {
                            handleDayChange(index, "vehicleAgencyName", agency.name)
                            handleDayChange(index, "vehicleAgency", agency)
                            handleDayChange(index, "vehicleAgencyNumber", agency.mobile)

                          }
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlinePhone className="text-sky-500 text-lg" />
                      <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">
                          Vehicle Agency Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter agency number"
                          value={day.vehicleAgencyNumber}
                          onChange={(e) =>
                            handleDayChange(index, "vehicleAgencyNumber", e.target.value)
                          }
                          className="w-full border-b-2 border-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* <div className="bg-white p-2 rounded-lg shadow-sm w-full"> */}

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
                <button 
                onClick={()=>handleIternarySubmit()}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mt-2">
                  <AiOutlineUser className="inline mr-1" />
                  Save
                </button>

              </div>

          )}


        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
