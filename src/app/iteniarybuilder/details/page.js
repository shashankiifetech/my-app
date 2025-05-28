"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkedAlt, FaHotel, FaSync } from "react-icons/fa";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineCar,
  AiOutlineDown,
  AiOutlineRight,
  AiOutlineArrowLeft,
  AiOutlineWarning,
} from "react-icons/ai";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function ItineraryDayViewer() {
  const router = useRouter();
  const [itineraryDays, setItineraryDays] = useState([]);
  const [collapsedDays, setCollapsedDays] = useState([]);
  const { itenaryId } = useAppContext();
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!itenaryId) return;
    const handleAlreadyItenaryDetails = async (id) => {
      console.log("Fetching existing itinerary details for ID:", id);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/journeyIternaryDetails?jdId=${id}`);
        const data = await response.json();
        console.log(data)
        if (data.status === 'ok') {
          if (data?.data) {
            const existingdata = data.data;
            const newDays = existingdata.map((day, index) => ({
              day: day.dayNumber,
              from: day.fromLocation,
              to: day.toLocation,
              hotelName: day.hotelName || "",
              hotel: day.hotel || {},
              hotelAmount: day.hotelAmount,
              mapIncluded: day.isMAPInclude == 1 ? true : false,
              hotelManagerName: day.managerName || "",
              hotelManagerNumber: day.managerNumber || "",
              vehicleAgencyName: day.vehicleAgencyName || "",
              vehicleAgency: day.driverName || {},
              vehicleAgencyNumber: day.driverMobile || "",
            }));
            setCollapsedDays(newDays.map(() => true));
            setItineraryDays(newDays);
            toast.success("Existing itinerary details fetched successfully!");
          }
        }
        else {
          return;
        }
      } catch (error) {
        console.error("Error fetching existing itinerary details:", error);
        // setError("Failed to fetch existing itinerary details. Please try again.");
        toast.error("Failed to fetch existing itinerary details. Please try again.");
      }
    }

    handleAlreadyItenaryDetails(itenaryId);
  }, [])

  const handleClick = () => {
    setIsRotating(true);
    router.refresh();
    setTimeout(() => setIsRotating(false), 1000);
  };

  const toggleCollapse = (index) => {
    setCollapsedDays((prev) =>
      prev.map((collapsed, i) => (i === index ? !collapsed : collapsed))
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100\ p-4 pt-8">
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
          Itinerary Details
        </h1>
        <div
          onClick={handleClick}
          className={`flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-200 hover:bg-blue-300 transition-all duration-200 cursor-pointer ${isRotating ? "animate-spin" : ""
            }`}
        >
          <FaSync />
        </div>
      </header>
      {!itenaryId ? (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center text-center h-[60vh] px-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="text-red-600 text-5xl mb-4"
          >
            <AiOutlineWarning />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">No Itinerary Found</h1>
          <p className="text-gray-500 mt-2">Please try again with a valid itinerary ID.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {itineraryDays.map((day, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 w-full"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCollapse(index)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Day {day.day}
                </h3>
                <span className="text-gray-500">
                  {collapsedDays[index] ? <AiOutlineRight /> : <AiOutlineDown />}
                </span>
              </div>

              {/* Details */}
              <AnimatePresence initial={false}>
                {!collapsedDays[index] && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mt-4 space-y-4 text-sm text-gray-700"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <FaMapMarkedAlt className="text-blue-600" />
                        <span className="font-medium">From:</span> {day.from}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkedAlt className="text-blue-600" />
                        <span className="font-medium">To:</span> {day.to}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaHotel className="text-green-600" />
                      <span className="font-medium">Hotel:</span> {day.hotelName}
                    </div>

                    <div className="flex items-center gap-2">
                      <AiOutlineHome className="text-green-600" />
                      <span className="font-medium">Hotel Amount:</span> ₹{day.hotelAmount}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMapMarkedAlt className="text-indigo-500" />
                      <span className="font-medium">MAP Included:</span>{" "}
                      {day.mapIncluded ? "Yes" : "No"}
                    </div>

                    <div className="flex items-center gap-2">
                      <AiOutlineUser className="text-purple-600" />
                      <span className="font-medium">Hotel Manager:</span> {day.hotelManagerName}
                    </div>

                    <div className="flex items-center gap-2">
                      <AiOutlinePhone className="text-purple-600" />
                      <span className="font-medium">Manager Contact:</span> {day.hotelManagerNumber}
                    </div>

                    <div className="flex items-center gap-2">
                      <AiOutlineCar className="text-orange-600" />
                      <span className="font-medium">Vehicle Agency:</span> {day.vehicleAgencyName}
                    </div>

                    <div className="flex items-center gap-2">
                      <AiOutlinePhone className="text-orange-600" />
                      <span className="font-medium">Agency Contact:</span> {day.vehicleAgencyNumber}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
