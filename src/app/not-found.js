'use client';
import { useRouter } from 'next/navigation';
import { AiOutlineWarning } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[80vh] text-center"
    >
      <div className="text-red-600 text-6xl mb-4">
        <AiOutlineWarning />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">404 – Page Not Found</h1>
      <p className="text-gray-500 mt-2">The page you’re looking for doesn’t exist.</p>
      <button
        onClick={() => router.push('/main')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </button>
    </motion.div>
  );
}
