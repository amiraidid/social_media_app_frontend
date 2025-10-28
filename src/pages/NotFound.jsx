import React from 'react'
import { FiAlertTriangle, FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
return (
    <main className="min-h-screen mt-10 bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-10 text-center">
            <div className="flex items-center justify-center text-red-500 mb-4">
                <FiAlertTriangle className="text-6xl md:text-7xl animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-800">404</h1>
            <p className="mt-4 text-lg text-gray-600">Oops — the page you're looking for can't be found.</p>

            <div className="mt-6 flex items-center justify-center gap-4">
                

                <button
                    onClick={() => (window.location.href = '/')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow"
                >
                    <FiHome />
                    Go Home
                </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                If you think this is a mistake, contact support or try searching for what you need.
            </p>
        </div>
    </main>
);
}
