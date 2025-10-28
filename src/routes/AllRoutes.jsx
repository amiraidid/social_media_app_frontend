import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home, LandingPage, Messages, NotFound, Notifications, Profile, SearchPage } from '../pages'


export default function AllRoutes() {
  return (
    <main>
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/messages" element={<Messages />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    </main>
  )
}
