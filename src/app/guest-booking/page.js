"use client"
import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineDollar } from 'react-icons/ai'; // Icons for user, email, and phone
import { FiGlobe } from 'react-icons/fi'; // For country code dropdown

const GuestBooking = () => {
    // States for the form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [tour, setTour] = useState("");
    const [amountPerPax, setAmountPerPax] = useState("");
    const [guests, setGuests] = useState("");
    const [advancedBooking, setAdvancedBooking] = useState("");
    const [countryCode, setCountryCode] = useState("+91");

    return (
        <div className="w-full max-w-lg mx-auto min-h-screen bg-white p-6 rounded-xl shadow-lg">
            {/* Header */}
            <header className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Guest Booking</h1>
            </header>

            {/* Tabs */}


            {/* Form Fields */}
            <div className="space-y-6">
                {/* Full Name */}
                <div className="flex items-center gap-4">
                    <AiOutlineUser className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                    <AiOutlineMail className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Mobile Number */}
                <div className="flex items-center gap-4">
                    <AiOutlinePhone className="text-sky-500 text-lg" />
                    <div className="w-full flex gap-2">
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-20 border-b-2 border-gray-300 text-black text-lg font-normal font-['Roboto'] focus:outline-none focus:ring-0"
                        >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Tour */}
                <div className="flex items-center gap-4">
                    <FiGlobe className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Tour</label>
                        <input
                            type="text"
                            placeholder="Enter tour name"
                            value={tour}
                            onChange={(e) => setTour(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Amount Per Pax */}
                <div className="flex items-center gap-4">
                    <AiOutlineDollar className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Amount Per Pax</label>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amountPerPax}
                                onChange={(e) => setAmountPerPax(e.target.value)}
                                className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                            />
                            <span className="text-black text-lg font-normal">/-</span>
                        </div>
                    </div>
                </div>

                {/* Number of Guests */}
                <div className="flex items-center gap-4">
                    <AiOutlineUser className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Number Of Guests</label>
                        <input
                            type="number"
                            placeholder="Enter number of guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Advanced Booking */}
                <div className="flex items-center gap-4">
                    <AiOutlineDollar className="text-sky-500 text-lg" />
                    <div className="w-full">
                        <label className="text-xs text-black opacity-50 font-['Roboto']">Advanced Booking Amount</label>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                placeholder="Enter advanced amount"
                                value={advancedBooking}
                                onChange={(e) => setAdvancedBooking(e.target.value)}
                                className="w-full text-black text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0"
                            />
                            <span className="text-black text-lg font-normal">/-</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
                <button className="w-full py-3 bg-gradient-to-br from-sky-500 to-indigo-800 text-white text-lg font-semibold rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default GuestBooking;
