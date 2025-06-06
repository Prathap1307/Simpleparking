'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Settingspage from '@/components/adminpages/Settingspage';
import Parkingsspace from '@/components/adminpages/Parkings';
import Available_locations from '@/components/adminpages/Locations';
import TodaysBookings from '@/components/adminpages/Todaybooking';

export default function DashboardPage() {
  const router = useRouter();

  const [selected, setSelected] = useState('Today'); // default
  const [authorized, setAuthorized] = useState(false);

  // Auth check on mount
  useEffect(() => {
    const token = sessionStorage.getItem('idToken');
    if (!token) {
      router.replace('/Admin/Login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // After mount, restore selected tab from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTab = localStorage.getItem('selectedTab');
      if (storedTab) {
        setSelected(storedTab);
      }
    }
  }, []);

  // Tab change handler
  const handleTabSelect = (tab) => {
    setSelected(tab);
    localStorage.setItem('selectedTab', tab);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('accessToken');
    router.push('/Admin/Login');
  };

  if (!authorized) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Simple parking</h1>
        <h2 className="text-xl mb-6 text-gray-300">Dashboard</h2>

        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('Today')}>Today's Booking</button>
        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('All')}>All Booking</button>
        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('Available_parkings')}>Available parkings</button>
        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('Available_locations')}>Available Locations</button>
        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('Website')}>Website Settings</button>
        <button className="cursor-pointer text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700" onClick={() => handleTabSelect('Settings')}>Settings</button>

        <button className="cursor-pointer text-left bg-red-600 px-4 py-2 rounded hover:bg-red-500 mt-auto" onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {selected === 'Today' && <TodaysBookings/>}
        {selected === 'All' && <span>All Bookings</span>}
        {selected === 'Website' && <span>Website Settings</span>}
        {selected === 'Settings' && <Settingspage />}
        {selected === 'Available_parkings' && <Parkingsspace />}
        {selected === 'Available_locations' && <Available_locations />}
      </div>
    </div>
  );
}
