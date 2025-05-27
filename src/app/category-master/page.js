"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowLeft } from 'react-icons/ai';
import { FaSync } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const router = useRouter();
    const [categoryName, setcategoryName] = useState("");

    const [openTab, setopenTab] = useState('1')
    const [error, seterror] = useState('')
    const [categorys, setcategorys] = useState([])
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
        const fetchCategory = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster`)
            const data = await response.json()
            console.log(data)
            if (data.status === 'ok') {
                setcategorys(data.data)
            }
            else {
                // alert("Error fetching category.")
                toast.error("Error fetching category.")
            }
        }
        fetchCategory()
    }, []);

    const handleCreateCategory = async () => {
        seterror('')
        if (categoryName) {
            if (editId) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        categoryName
                    }),
                });
                const data = await response.json();
                if (data.status === 'ok') {
                    setcategorys(categorys.map(category =>
                        category.id === editId
                            ? {
                                ...category,
                                categoryName: categoryName,
                            }
                            : category
                    ));
                    resetForm();
                } else {
                    seterror("Error updating category");
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            categoryName,
                        }),
                    }
                )
                const data = await response.json()
                if (data.status === "ok") {
                    // alert("Category booked successfully")
                    toast.success("Category created successfully");
                    console.log(data)
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster/${data.insertID}`);
                    const newData = await res.json();
                    console.log(newData)
                    if (newData.status === 'ok') {
                        console.log(newData)
                        setcategorys(prev => [newData.data, ...categoryName]);
                        resetForm();

                    } else {
                        // seterror("Error creating category")
                        toast.error("Error creating category");
                    }
                }
                else {
                    // seterror("Error creating category")
                    toast.error("Error creating category");
                }
            }
        }
        else {
            // seterror("Please fill all the fields")
            toast.error("Please fill all the fields");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Categroy?")) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenseCategoryMaster/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.status === 'ok') {
            toast.success("Category deleted successfully");
            setcategorys(categorys.filter(item => item.id !== id));
        } else {
            // alert("Error deleting Categroy");
            toast.error("Error deleting Categroy");
        }
    };

    const handleEdit = (category) => {
        setcategoryName(category.categoryName)
        setEditId(category.id);
        setopenTab('2');
    };

    const resetForm = () => {
        setcategoryName('')
        setEditId(null);
        setopenTab('1');
        seterror('');
    };

    const handleTabChange = (tab) => {
        setopenTab(tab);
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
                        All Categorys
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
                    {categorys.length > 0 ? (
                        categorys.map((category) => (
                            <div
                                key={category.id}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-lg flex flex-row sm:flex-row sm:items-center gap-4 sm:gap-8 transition-all duration-200"
                            >
                                <div className="flex-1 flex flex-row flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <AiOutlineUser className="text-sky-600 text-xl" />
                                        <span className="font-bold text-lg text-gray-800">{category.categoryName}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 items-center sm:ml-auto">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg shadow transition"
                                        title="Edit"
                                    >
                                        <AiOutlineEdit size={20} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
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
                        <p className="text-center text-gray-500">No category created yet.</p>
                    )}
                </div>
            ) : (
                <div className="space-y-5 sm:space-y-6">

                    <div className="flex items-center gap-3">
                        <AiOutlineUser className="text-sky-500 text-lg" />
                        <div className="w-full">
                            <label className="text-xs text-black opacity-50 font-['Roboto']">Category Name</label>
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setcategoryName(e.target.value)}
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
                            onClick={() => handleCreateCategory()}
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

export default AddCategory;
export const dynamic = "force-dynamic";
