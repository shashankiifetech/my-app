import { useState, useEffect, useRef } from 'react';
import { AiOutlineUser } from 'react-icons/ai';

export default function CategoryDropdown({ categories, category, setcategory }) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const filteredcategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center gap-3" ref={dropdownRef}>
            <AiOutlineUser className="text-sky-500 text-lg" />
            <div className="w-full relative">
                <label className="text-xs text-black opacity-50 font-['Roboto']">category</label>
                <input
                    type="text"
                    className="w-full text-black text-base sm:text-lg font-normal font-['Roboto'] border-b-2 border-gray-300 focus:outline-none focus:ring-0 bg-transparent"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Select category"
                />
                {showDropdown && filteredcategories.length > 0 && (
                    <ul className="absolute z-10 bg-white w-full mt-1 max-h-60 overflow-auto border border-gray-300 rounded shadow">
                        {filteredcategories.map(category => (
                            <li
                                key={category.id}
                                className="px-4 py-2 hover:bg-sky-500 hover:text-white cursor-pointer"
                                onClick={() => {
                                    setcategory(category.id);
                                    setQuery(category.categoryName);
                                    setShowDropdown(false);
                                }}
                            >
                                {category.categoryName}
                            </li>
                        ))}
                    </ul>
                )}
                {showDropdown && filteredcategories.length === 0 && (
                    <div className="absolute z-10 bg-white w-full mt-1 px-4 py-2 text-gray-500 border border-gray-300 rounded shadow">
                        No categories found.
                    </div>
                )}
            </div>
        </div>
    );
}
