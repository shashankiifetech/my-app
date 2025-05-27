"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineNumber, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowLeft, AiOutlineCalendar } from 'react-icons/ai';
import { FiTag } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaSync } from 'react-icons/fa';
import SearchableDropDownCategory from '@/components/SearchableDropDownCategory';
import { toast } from 'react-toastify';

const ExpensesMaster = () => {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [openTab, setOpenTab] = useState('1');
    const [error, setError] = useState('');
    const [expenses, setExpenses] = useState([]);
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
        // Fetch expenses
        const fetchExpenses = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expense`);
            const data = await response.json();
            console.log(data);
            if (data.status === 'ok') {
                if (data?.data)
                    setExpenses(data.data);
            } else {
                // alert("Error fetching expenses");
                toast.error("Error fetching expenses");
            }
        };
        // Fetch categories for dropdown
        const fetchCategories = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster`);
            const data = await response.json();
            if (data.status === 'ok') {
                if (data?.data)
                    setCategories(data.data);
            }
        };
        fetchExpenses();
        fetchCategories();
    }, []);

    const handleExpenseSubmit = async () => {
        setError('');
        if (!amount || !notes || !date || !categoryId) {
            // setError("Please fill all the fields");
            toast.error("Please fill all the fields");
            return;
        }
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            // setError("Amount must be a positive number");
            toast.error("Amount must be a positive number");
            return;
        }
        if (editId) {
            // Update
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expense/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    notes,
                    date,
                    categoryId,
                }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                toast.success("Expense updated successfully");
                setExpenses(expenses.map(expense =>
                    expense.id === editId
                        ? {
                            ...expense,
                            amount,
                            notes,
                            expenseDate: date,
                            categoryId,
                            category_name: categories.find(c => c.id === categoryId)?.name || expense.category_name
                        }
                        : expense
                ));
                resetForm();
            } else {
                // setError("Error updating expense");
                toast.error("Error updating expense");
            }
        } else {
            // Create
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expense`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    notes,
                    date,
                    categoryId,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (data.status === 'ok') {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expense/${data.insertId}`);
                const newData = await res.json();
                if (newData.status === 'ok') {
                    setExpenses(prev => [newData.data[0], ...prev]);
                    resetForm();
                    toast.success("Expense added successfully");
                } else {
                    // setError("Error fetching new expense");
                    toast.error("Error fetching new expense");
                }
            } else {
                // setError("Error adding expense");
                toast.error("Error adding expense");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.status === 'ok') {
            setExpenses(expenses.filter(expense => expense.id !== id));
            toast.success("Expense deleted successfully");
        } else {
            // alert("Error deleting expense");
            toast.error("Error deleting expense");
        }
    };

    const handleEdit = (expense) => {
        setAmount(expense.amount);
        setNotes(expense.notes);
        setDate(addSixHours(expense.expenseDate).split('T')[0]);
        setCategoryId(expense.categoryId);
        setEditId(expense.id);
        setOpenTab('2');
    };

    const resetForm = () => {
        setAmount("");
        setNotes("");
        setDate("");
        setCategoryId("");
        setEditId(null);
        setOpenTab('1');
        setError('');
    };

    const handleTabChange = (tab) => {
        setOpenTab(tab);
    };

    function addSixHours(isoDateString) {
        const date = new Date(isoDateString);
        date.setHours(date.getHours() + 6);
        return date.toISOString();
    }

    return (
        <div className="w-full max-w-lg md:max-w-2xl mx-auto min-h-screen bg-white p-3 sm:p-6 rounded-none sm:rounded-xl shadow-none sm:shadow-lg transition-all duration-300 pt-8">
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
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Expenses</h1>
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
                        All Expenses
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
                    {expenses?.length > 0 ? (
                        expenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-row flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineNumber className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800">₹{expense.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <FiTag className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{expense.notes}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <AiOutlineCalendar className="text-sky-600 text-lg" />
                                        <span className="text-gray-700">{addSixHours(expense.expenseDate).split('T')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <span className="font-semibold text-gray-700">Category:</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                                            {categories.find(c => c.id === expense.categoryId)?.categoryName || expense.categoryId}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 items-center sm:ml-auto">
                                    <button
                                        onClick={() => handleEdit(expense)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense.id)}
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
                        <p className="text-center text-gray-500">No expenses added yet.</p>
                    )}
                </div>
            ) : (

                <div className="space-y-5 sm:space-y-6">

                    <div className="flex items-center gap-3">
                        <AiOutlineNumber className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Amount</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <FiTag className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Notes</label>
                            <input
                                type="text"
                                placeholder="Enter notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>



                    <div className="flex items-center gap-3">
                        <AiOutlineCalendar className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                    {/* Category Dropdown */}
                    {/* <div className="flex items-center gap-3">
                        <FiTag className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent transition-all duration-200"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                        </div>
                    </div> */}

                    <SearchableDropDownCategory categories={categories} category={categoryId} setcategory={setCategoryId} />
                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleExpenseSubmit}
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

export default ExpensesMaster;
