import React from 'react'

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
        <div className="loader-inner border-gray-200"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
