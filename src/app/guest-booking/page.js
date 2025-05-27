"use client"
import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineDollar, AiOutlineArrowLeft, AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Icons for user, email, and phone
import { FaSync } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi'; // For country code dropdown
import { useRouter } from 'next/navigation'; // For navigation
import { toast } from 'react-toastify'; // For toast notifications
import { useAppContext } from '@/context/AppContext';



const GuestBooking = () => {
    // States for the form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [tour, setTour] = useState("");
    const [amountPerPax, setAmountPerPax] = useState("");
    const [guests, setGuests] = useState("");
    const [advancedBooking, setAdvancedBooking] = useState("");
    const router = useRouter(); // For navigation
    const [openTab, setOpenTab] = useState('1'); // State to manage active tab
    const [bookings, setBookings] = useState([]); // State to manage bookings
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null); // State to manage edit ID
    const { setBookingId } = useAppContext();



    const [isRotating, setIsRotating] = useState(false);

    const handleClick = () => {
        setIsRotating(true);
        router.refresh(); // refresh data

        setTimeout(() => {
            setIsRotating(false);
        }, 3000); // stop rotation after 3 seconds
    };

    useEffect(() => {
        const fetchBooking = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-booking`);
            const data = await response.json();
            console.log(data)
            if (data.status == 'ok') {
                if (data?.data)
                    setBookings(data.data);

            }
            // else alert(data.error)
            else toast.error(data.error)


        }

        fetchBooking();
    }, [])

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setMobile('');
        setTour('');
        setAmountPerPax('');
        setGuests('');
        setAdvancedBooking('');
        setEditId(null); // Reset edit ID
        setOpenTab('1'); // Switch back to the bookings tab
    };

    const handleGuestBookingorEdit = async (e) => {

        if (!fullName || !email || !mobile || !tour || !amountPerPax || !guests || !advancedBooking) {
            // setError('Please fill all fields');
            toast.error('Please fill all fields');
            return;
        }

        const bookingData = {
            fullName,
            email,
            mobile,
            tour,
            amountPerPax,
            guests,
            advancedBooking,
        };

        console.log(bookingData)
        if (editId) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-booking/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingData }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                const updatedBookings = bookings.map(booking =>
                    booking.id === editId
                        ? {
                            ...booking,
                            name: fullName,
                            email: email,
                            mobile: mobile,
                            tourName: tour,
                            amountPerPax: amountPerPax,
                            guestCount: guests,
                            advance: advancedBooking
                        }
                        : booking
                );
                setBookings(updatedBookings); // Update bookings state
                resetForm();
                toast.success('Booking updated successfully');
            }
            else {
                // setError(data.error);
                toast.error(data.error);
            }
        }
        else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookingData }),
                });

                const data = await response.json();
                console.log(data)
                if (data.status === 'ok') {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-booking/${data.insertId}`);
                    const newData = await res.json();
                    if (newData.status === 'ok') {
                        setBookings([newData.data[0], ...bookings])
                        resetForm();
                        toast.success('Booking created successfully');
                    }
                    // else setError(newData.error);
                    else toast.error(newData.error);
                } else {
                    // setError(data.error);
                    toast.error(data.error);
                }
            } catch (error) {
                console.error('Error creating booking:', error);
                // setError('Failed to create booking');
                toast.error('Failed to create booking');
            }
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-booking/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.status === 'ok') {
                setBookings(bookings.filter(booking => booking.id !== id));
                toast.success('Booking deleted successfully');
            } else {
                // setError(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            // setError('Failed to delete booking');
            toast.error('Failed to delete booking');
        }
    }

    const handleEdit = (booking) => {
        console.log(booking);
        setFullName(booking.name);
        setEmail(booking.email);
        setMobile(booking.mobile);
        setTour(booking.tourName);
        setAmountPerPax(booking.amountPerPax);
        setGuests(booking.guestCount);
        setAdvancedBooking(booking.advance);
        setEditId(booking.id); // Set the ID for editing
        setOpenTab('2'); // Switch to the create tab for editing
    }

    const handleTabChange = (tab) => {
        setOpenTab(tab);
    };

    return (
        <div className="w-full max-w-lg mx-auto min-h-screen bg-white p-6 rounded-xl shadow-lg pt-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium mb-4 transition-colors duration-200"
            >
                <AiOutlineArrowLeft size={22} />
                <span>Back</span>
            </button>

            {/* Header */}
            <header className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Booking</h1>
                <div
                    onClick={handleClick}
                    className={`flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-200 hover:bg-blue-300 transition-all duration-200 cursor-pointer ${isRotating ? 'animate-spin' : ''
                        }`}
                >
                    <FaSync />
                </div>
            </header>

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


            {/* Form Fields */}
            {openTab === '1' ? (
                bookings.length < 1 ? (
                    <div className="flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No active bookings found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <div
                                key={booking.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-row sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-col gap-1 break-normal w-[80%]">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineUser className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800 break-normal">{booking.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineMail className="text-sky-600 text-xl" />
                                        <span className="text-gray-700 break-normal">{booking.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlinePhone className="text-sky-600 text-xl" />
                                        <span className="text-gray-700 break-normal">{booking.mobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineHome className="text-sky-600 text-xl" />
                                        <span className="text-gray-700 break-normal">Tour: {booking.tourName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 break-normal">Amount Per Pax: {booking.amountPerPax}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 break-normal">Guest Count: {booking.guestCount}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-col sm:gap-3 items-end  justify-end sm:ml-auto w-[20%]">

                                    <button
                                        onClick={() => handleEdit(booking)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Delete"
                                    >
                                        <AiOutlineDelete size={20} />
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setBookingId(booking.id);
                                            router.push('/iteniarybuilder');
                                        }}
                                        className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Refresh"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span>itenary</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            ) : (
                <div>
                    <div className="space-y-4">
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
                            <div className="w-full">
                                <label className="text-xs text-black opacity-50 font-['Roboto']">Mobile</label>
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

                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleGuestBookingorEdit}
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

export default GuestBooking;
