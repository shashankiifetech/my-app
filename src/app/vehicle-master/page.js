"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineNumber, AiOutlineCar, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowLeft } from 'react-icons/ai';
import { FiTag } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaSync } from 'react-icons/fa';

const VehicleMaster = () => {
    const router = useRouter();
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [color, setColor] = useState("");
    const [noOfSeats, setNoOfSeats] = useState("");
    const [agencyId, setAgencyId] = useState("");
    const [agencies, setAgencies] = useState([]);
    const [openTab, setOpenTab] = useState('1');
    const [error, setError] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        // Fetch vehicles
        const fetchVehicles = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehiclemaster`);
            const data = await response.json();
            if (data.status === 'ok') {
                if (data?.data)
                    setVehicles(data.data);
            } else {
                alert("Error fetching vehicles");
            }
        };
        // Fetch agencies for dropdown
        const fetchAgencies = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleAgencyMaster`);
            const data = await response.json();
            if (data.status === 'ok') {
                // console.log(data.data)
                if (data?.data)
                    setAgencies(data.data);
            }
        };
        fetchVehicles();
        fetchAgencies();
        console.log(agencies)
    }, []);

    const handleVehicleSubmit = async () => {
        setError('');
        if (!vehicleName || !vehicleNumber || !color || !noOfSeats || !agencyId) {
            setError("Please fill all the fields");
            return;
        }
        if (isNaN(Number(noOfSeats)) || Number(noOfSeats) <= 0) {
            setError("No of seats must be a positive number");
            return;
        }
        if (editId) {
            // Update
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehiclemaster/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleAgencyId: agencyId,
                    VehicleName: vehicleName,
                    seats: noOfSeats,
                    VehicleNumber: vehicleNumber,
                    color,
                }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setVehicles(vehicles.map(vehicle =>
                    vehicle.id === editId
                        ? {
                            ...vehicle,
                            vehicleName,
                            vehicleNumber,
                            color,
                            seats: noOfSeats,
                            vehicleAgencyId: agencyId,
                            agency_name: agencies.find(a => a.id === agencyId)?.name || vehicle.name
                        }
                        : vehicle
                ));
                resetForm();
            } else {
                setError("Error updating vehicle");
            }
        } else {
            // Create
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehiclemaster`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleAgencyId: agencyId,
                    VehicleName: vehicleName,
                    seats: noOfSeats,
                    VehicleNumber: vehicleNumber,
                    color,
                }),
            });
            const data = await response.json();
            console.log(data)
            if (data.status === 'ok') {
                // setVehicles(prev => [...prev, data.insertedItem[0]]);
                // resetForm();
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehiclemaster/${data.insertId}`);
                const newData = await res.json();
                if (newData.status === 'ok') {
                    setVehicles(prev => [newData.data[0], ...prev]);
                    resetForm();
                } else {
                    setError("Error fetching new vehicle");
                }

            } else {
                setError("Error adding vehicle");
            }
        }
        console.log(vehicles)
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehiclemaster/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.status === 'ok') {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        } else {
            alert("Error deleting vehicle");
        }
    };

    const handleEdit = (vehicle) => {
        setVehicleName(vehicle.vehicleName);
        setVehicleNumber(vehicle.vehicleNumber);
        setColor(vehicle.color);
        setNoOfSeats(vehicle.seats);
        setAgencyId(vehicle.vehicleAgencyId);
        setEditId(vehicle.id);
        setOpenTab('2');
    };

    const resetForm = () => {
        setVehicleName("");
        setVehicleNumber("");
        setColor("");
        setNoOfSeats("");
        setAgencyId("");
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
            <header className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Vehicle</h1>
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
                        All Vehicles
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
                    {vehicles?.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-row flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineUser className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800">{vehicle.vehicleName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <AiOutlineNumber className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{vehicle.vehicleNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <FiTag className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{vehicle.color}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <AiOutlineCar className="text-sky-600 text-lg" />
                                        <span className="font-semibold text-gray-700">Seats:</span>
                                        <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-sm font-medium">{vehicle.seats}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <span className="font-semibold text-gray-700">Agency:</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{agencies.find(c => c.id == vehicle.vehicleAgencyId)?.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 items-center sm:ml-auto">
                                    <button
                                        onClick={() => handleEdit(vehicle)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
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
                        <p className="text-center text-gray-500">No vehicles added yet.</p>
                    )}
                </div>
            ) : (
                <div className="space-y-5 sm:space-y-6">
                    {/* Vehicle Name */}
                    <div className="flex items-center gap-3">
                        <AiOutlineUser className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Vehicle Name</label>
                            <input
                                type="text"
                                placeholder="Enter vehicle name"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Vehicle Number */}
                    <div className="flex items-center gap-3">
                        <AiOutlineNumber className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Vehicle Number</label>
                            <input
                                type="text"
                                placeholder="Enter vehicle number"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Color */}
                    <div className="flex items-center gap-3">
                        <FiTag className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Color</label>
                            <input
                                type="text"
                                placeholder="Enter color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* No of Seats */}
                    <div className="flex items-center gap-3">
                        <AiOutlineCar className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">No of Seats</label>
                            <input
                                type="number"
                                placeholder="Enter number of seats"
                                value={noOfSeats}
                                onChange={(e) => setNoOfSeats(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Agency Dropdown */}
                    <div className="flex items-center gap-3">
                        <AiOutlineUser className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Agency</label>
                            <select
                                value={agencyId}
                                onChange={(e) => setAgencyId(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            >
                                <option value="">Select agency</option>
                                {agencies.map(agency => (
                                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleVehicleSubmit}
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

export default VehicleMaster;
