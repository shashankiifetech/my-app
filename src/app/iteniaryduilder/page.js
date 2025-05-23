"use client"
import React, { useState } from 'react';
import {
  FaHotel,
  FaUserTie,
  FaMapMarkerAlt,
  FaRoad,
  FaPlusCircle,
} from 'react-icons/fa';

const ItineraryBuilder = () => {
  const [days, setDays] = useState([{ day: 1 }]);

  const addMoreDays = () => {
    setDays([...days, { day: days.length + 1 }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <header className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Itinerary Builder</h1>
      </header>

      <div className="space-y-8 max-w-4xl mx-auto">
        {days.map(({ day }, idx) => (
          <div
            key={idx}
            className="bg-white/70 backdrop-blur-md border border-blue-100 shadow-xl rounded-2xl p-6 transition hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Day {day}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                  <FaHotel />
                  Hotel Name
                </label>
                <input
                  type="text"
                  placeholder="Enter hotel name"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                  <FaUserTie />
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="Enter contact person"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                  <FaMapMarkerAlt />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                  <FaRoad />
                  Start Distance (KM)
                </label>
                <input
                  type="number"
                  placeholder="Enter start distance"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={addMoreDays}
            className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          >
            <FaPlusCircle />
            Add More Days
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
