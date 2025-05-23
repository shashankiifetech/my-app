"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowLeft } from 'react-icons/ai';
import { FiGlobe } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaSync } from 'react-icons/fa';

const AddHotel = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [mobile, setMobile] = useState("");
    const [pocMobile, setPocMobile] = useState("");
    const [email, setEmail] = useState("");
    const [openTab, setOpenTab] = useState('1');
    const [error, setError] = useState('');
    const [hotels, setHotels] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel-booking`);
            const data = await response.json();
            if (data.status === 'ok') {
                setHotels(data.hotels);
            } else {
                alert("Error fetching hotels");
            }
        };
        fetchHotels();
    }, []);

    const handleHotelBooking = async () => {
        if (!name || !location || !mobile || !pocMobile || !email) {
            setError("Please fill all the fields");
            return;
        }
        setError('');
        const payload = {
            name,
            location,
            mobile,
            pocMobile,
            email
        };
        if (editId) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel-booking/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setHotels(hotels.map(hotel =>
                    hotel.id === editId
                        ? { ...hotel, ...payload }
                        : hotel
                ));
                resetForm();
            } else {
                setError("Error updating hotel");
            }
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel-booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setHotels(prev => [...hotels, data.insertedItem[0]]);
                resetForm();
            } else {
                setError("Error booking hotel");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hotel?")) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel-booking/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.status === 'ok') {
            setHotels(hotels.filter(hotel => hotel.id !== id));
        } else {
            alert("Error deleting hotel");
        }
    };

    const handleEdit = (hotel) => {
        setName(hotel.name);
        setLocation(hotel.location);
        setMobile(hotel.mobile);
        setPocMobile(hotel.pocMobile);
        setEmail(hotel.email);
        setEditId(hotel.id);
        setOpenTab('2');
    };

    const resetForm = () => {
        setName("");
        setLocation("");
        setMobile("");
        setPocMobile("");
        setEmail("");
        setEditId(null);
        setOpenTab('1');
        setError('');
    };

    const handleTabChange = (tab) => {
        setOpenTab(tab);
    };

    return (
        <div className="w-full max-w-lg md:max-w-2xl mx-auto min-h-screen bg-white p-3 sm:p-6 rounded-none sm:rounded-xl shadow-none sm:shadow-lg transition-all duration-300 mt-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium mb-4 transition-colors duration-200"
            >
                <AiOutlineArrowLeft size={22} />
                <span>Back</span>
            </button>

            {/* Header */}
            <header className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex justify-between items-center mt-8">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Hotel Booking</h1>
                <div
                    onClick={() => router.refresh()}
                    className='flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-200 hover:bg-blue-300 transition-all duration-200 cursor-pointer'>
                    <FaSync />
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center mb-4 sm:mb-6 gap-3 sm:gap-5">
                <div
                    onClick={() => handleTabChange('1')}
                    className={`flex-1 h-9 ${openTab === '1' ? 'bg-sky-500' : ''} border-2 border-sky-500 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200`}
                >
                    <span className={`${openTab === '1' ? 'text-white' : 'text-sky-500'} text-sm font-normal font-['Roboto']`}>
                        All Hotels
                    </span>
                </div>
                <div
                    onClick={() => handleTabChange('2')}
                    className={`flex-1 h-9 ${openTab === '2' ? 'bg-sky-500' : ''} border-2 border-sky-500 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200`}
                >
                    <span className={`${openTab === '2' ? 'text-white' : 'text-sky-500'} text-sm font-normal font-['Roboto']`}>
                        Create
                    </span>
                </div>
            </div>

            {openTab === '1' ? (
                <div className="space-y-6">
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-row flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineUser className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800">{hotel.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiGlobe className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{hotel.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlinePhone className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{hotel.mobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlinePhone className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">POC: {hotel.pocMobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineMail className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{hotel.email}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 items-center sm:ml-auto">
                                    <button
                                        onClick={() => handleEdit(hotel)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hotel.id)}
                                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Delete"
                                    >
                                        <AiOutlineDelete size={20} />
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No hotel booked yet.</p>
                    )}
                </div>
            ) : (
                <div className="space-y-5 sm:space-y-6">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                        <AiOutlineUser className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Hotel Name</label>
                            <input
                                type="text"
                                placeholder="Enter hotel name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-3">
                        <FiGlobe className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Location</label>
                            <input
                                type="text"
                                placeholder="Enter hotel location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Mobile */}
                    <div className="flex items-center gap-3">
                        <AiOutlinePhone className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Mobile</label>
                            <input
                                type="text"
                                placeholder="Enter mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* POC Mobile */}
                    <div className="flex items-center gap-3">
                        <AiOutlinePhone className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">POC Mobile</label>
                            <input
                                type="text"
                                placeholder="Enter POC mobile number"
                                value={pocMobile}
                                onChange={(e) => setPocMobile(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <AiOutlineMail className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleHotelBooking}
                            className="w-full py-3 bg-gradient-to-br from-sky-500 to-indigo-800 text-white text-lg font-semibold rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                        >
                            {editId ? "Update" : "Submit"}
                        </button>
                        {editId && (
                            <button
                                onClick={resetForm}
                                className="w-full sm:w-32 py-3 bg-gray-300 text-black text-lg font-semibold rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddHotel;
export const dynamic = "force-dynamic";
