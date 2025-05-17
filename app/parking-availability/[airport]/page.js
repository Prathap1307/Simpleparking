'use client';

import { useParams } from 'next/navigation';
import Cardscmp from '@/components/Cardscmp';
import Navbarcmp from '@/components/Navbar';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const params = useParams();
  const selectedAirportRaw = params?.selectedAirport;
  const selectedAirport = decodeURIComponent(selectedAirportRaw || 'London Luton Airport');

  const [LocationsData, setLocationsData] = useState([]);
  const [ParkingslotData, setParkingslotData] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);

  const fetchlocations = async () => {
    try {
      const res = await fetch("/api/Locations");
      if (!res.ok) throw new Error("Failed to fetch locations data");
      const data = await res.json();
      setLocationsData(data);
    } catch (err) {
      console.error("Error refreshing locations data:", err);
    }
  };

  const fetchparkingslots = async () => {
    try {
      const res = await fetch("/api/Parkingspace");
      if (!res.ok) throw new Error("Failed to fetch parking data");
      const data = await res.json();
      setParkingslotData(data);
    } catch (err) {
      console.error("Error refreshing parking data:", err);
    }
  };

  // Fetch both on mount
  useEffect(() => {
    fetchlocations();
    fetchparkingslots();
  }, []);

  // Filter slots when data or airport changes
  useEffect(() => {
    const filtered = ParkingslotData.filter(
      (slot) =>
        slot.Location?.toLowerCase().trim() === selectedAirport.toLowerCase().trim()
    );
    setFilteredSlots(filtered);
  }, [ParkingslotData, selectedAirport]);

  return (
    <div>
      <div className="w-full bg-blue-400 pt-5">
        <Navbarcmp />
      </div>

      <div className="ml-10 md:ml-20 mt-4 mb-4">
        <h3 className="text-2xl">
          Choose your Parking:{" "}
          <span className="font-bold text-blue-800">{selectedAirport}</span>
        </h3>
      </div>

      {filteredSlots.length > 0 ? (
        filteredSlots.map((slot) => (
          <Cardscmp
            key={slot.id}
            title={slot.ParkingName}
            details={slot.AvailableFacilities}
            price={slot.price_per_day}
          />
        ))
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No parking slots found for this location.
        </p>
      )}
    </div>
  );
}
