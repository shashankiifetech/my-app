"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineHome, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowLeft } from 'react-icons/ai';
import { FaSync } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const VehicleAgencyMaster = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");

    const [openTab, setOpenTab] = useState('1');
    const [error, setError] = useState('');
    const [agencies, setAgencies] = useState([]);
    const [editId, setEditId] = useState(null);

    const [isRotating, setIsRotating] = useState(false);

    const handleClick = () => {
        setIsRotating(true);
        router.refresh(); // refresh data

        setTimeout(() => {
            setIsRotating(false);
        }, 3000); // stop rotation after 3 seconds
    };

    useEffect(() => {
        const fetchAgencies = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster`);
            const data = await response.json();
            console.log(data)
            if (data.status === 'ok') {
                if (data?.data)
                    setAgencies(data.data);
            } else {
                alert("Error fetching agencies.");
            }
        }
        fetchAgencies();
    }, []);

    const validateEmail = (email) => {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateMobile = (mobile) => {
        // Example: 10 digit number, adjust as needed
        return /^\d{10}$/.test(mobile);
    };




    const handleCreateOrUpdateAgency = async () => {
        setError('');
        if (!name || !email || !mobile || !address) {
            setError("Please fill all the fields");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!validateMobile(mobile)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        if (name && email && mobile && address) {
            if (editId) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, mobile, address }),
                });
                const data = await response.json();
                if (data.status === 'ok') {
                    setAgencies(agencies.map(agency =>
                        agency.id === editId
                            ? { ...agency, name, email, mobile, address }
                            : agency
                    ));
                    resetForm();
                } else {
                    setError("Error updating agency");
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, mobile, address }),
                });
                const data = await response.json();
                console.log(data)
                if (data.status === "ok") {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster/${data.insertID}`);
                    const newData = await res.json();
                    console.log(newData)
                    if (newData.status === 'ok') {
                        setAgencies(prev => [newData.data[0], ...prev]);
                        resetForm();
                    } else setError("Error creating agency");
                } else {
                    setError("Error creating agency");
                }
            }
        } else {
            setError("Please fill all the fields");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this agency?")) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.status === 'ok') {
            setAgencies(agencies.filter(item => item.id !== id));
        } else {
            alert("Error deleting agency");
        }
    };

    const handleEdit = (agency) => {
        setName(agency.name);
        setEmail(agency.email);
        setMobile(agency.mobile);
        setAddress(agency.address);
        setEditId(agency.id);
        setOpenTab('2');
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setMobile('');
        setAddress('');
        setEditId(null);
        setOpenTab('1');
        setError('');
    };

    const handleTabChange = (tab) => {
        setOpenTab(tab);
    }

    return (
        <div className="w-full max-w-lg md:max-w-2xl mx-auto min-h-screen bg-white p-3 sm:p-6 rounded-none sm:rounded-xl shadow-none sm:shadow-lg transition-all duration-300 mt-5">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium mb-4 transition-colors duration-200"
            >
                <AiOutlineArrowLeft size={22} />
                <span>Back</span>
            </button>

            {/* Header */}
            <header className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Vehicle Agency</h1>
                <div
                    onClick={handleClick}
                    className={`flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-200 hover:bg-blue-300 transition-all duration-200 cursor-pointer ${isRotating ? 'animate-spin' : ''
                        }`}
                >
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
                        All Agencies
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
                    {agencies.length > 0 ? (
                        agencies.map((agency) => (
                            <div
                                key={agency.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-row sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineUser className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800">{agency.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineMail className="text-sky-600 text-xl" />
                                        <span className="text-gray-700">{agency.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlinePhone className="text-sky-600 text-xl" />
                                        <span className="text-gray-700">{agency.mobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineHome className="text-sky-600 text-xl" />
                                        <span className="text-gray-700">{agency.address}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 items-center sm:ml-auto">
                                    <button
                                        onClick={() => handleEdit(agency)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(agency.id)}
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
                        <p className="text-center text-gray-500">No agency created yet.</p>
                    )}
                </div>
            ) : (
                <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-3">
                        <AiOutlineUser className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Name</label>
                            <input
                                type="text"
                                placeholder="Enter agency name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AiOutlineMail className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AiOutlinePhone className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Mobile Number</label>
                            <input
                                type="text"
                                placeholder="Enter mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AiOutlineHome className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Address</label>
                            <input
                                type="text"
                                placeholder="Enter address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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
                            onClick={handleCreateOrUpdateAgency}
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

export default VehicleAgencyMaster;
