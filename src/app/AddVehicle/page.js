"use client"
import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineDollar } from 'react-icons/ai'; // Icons for user, email, and phone
import { FiGlobe } from 'react-icons/fi'; // For country code dropdown

const AddVehicle = () => {
    // States for the form fields
    const [vehicelName, setvehicelName] = useState("");
    const [brand, setbrand] = useState("");
    // const [mobile, setMobile] = useState("");
    const [color, setcolor] = useState("");
    const [manufYear, setmanufYear] = useState("");
    // const [guests, setGuests] = useState("");
    const [Vnumber, setVnumber] = useState("");
    // const [countryCode, setCountryCode] = useState("+91");
    const [openTab, setopenTab] = useState('1')

    return (
        <div className="w-full max-w-lg mx-auto min-h-screen bg-white p-6 rounded-xl shadow-lg">
            {/* Header */}
            <header className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Vehicle Booking</h1>
            </header>

            {/* Tabs */}
            <div className="flex items-center mb-6 gap-5">
                <div onClick={() => setopenTab('1')}
                    className={`w-32 h-9 ${(openTab === '1' ? 'bg-sky-500' : '')} border-2 border-sky-500 flex items-center justify-center rounded-md`}>
                    <span className={`${(openTab === '1') ? 'text-white' : 'text-sky-500'} text-sm font-normal font-['Roboto']`}>All List&apos;s</span>
                </div>
                <div onClick={() => setopenTab('2')}
                    className={`w-32 h-9 ${(openTab === '2' ? 'bg-sky-500' : '')} border-2 border-sky-500 flex items-center justify-center rounded-md`}>
                    <span className={`${(openTab === '2') ? 'text-white' : 'text-sky-500'} text-sm font-normal font-['Roboto']`}>Create</span>
                </div>
            </div>
            {openTab === '1' ? (<div>No hotel booked yet.</div>) : (<div className="space-y-6">
                {/* Full Name */}
                <div className="flex items-center gap-4">
                    <AiOutlineUser className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Vehicle Name</label>
                        <input
                            type="text"
                            placeholder="Example: Toyota Corolla 2022"
                            value={vehicelName}
                            onChange={(e) => setvehicelName(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <AiOutlineUser className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Vehicle Number</label>
                        <input
                            type="text"
                            placeholder="Enter your vehicle number"
                            value={Vnumber}
                            onChange={(e) => setVnumber(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                    <AiOutlineMail className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Make (Brand)</label>
                        <input
                            type="text"
                            placeholder="Example: Toyota, Ford, Honda"
                            value={brand}
                            onChange={(e) => setbrand(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>


                {/* color */}
                <div className="flex items-center gap-4">
                    <FiGlobe className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Color</label>
                        <input
                            type="text"
                            placeholder="Enter the vehicle color"
                            value={color}
                            onChange={(e) => setcolor(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Amount Per Pax */}
                <div className="flex items-center gap-4">
                    <AiOutlineDollar className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Manufacturing year</label>
                        <div className="flex items-center gap-1">
                            <input
                                type="text"
                                placeholder="Enter your manufacturing year"
                                value={manufYear}
                                onChange={(e) => setmanufYear(e.target.value)}
                                className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button className="w-full py-3 bg-gradient-to-br from-sky-500 to-indigo-800 text-white text-lg font-semibold rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
                        Submit
                    </button>
                </div>
            </div>

            )}



        </div>
    );
};

export default AddVehicle;
