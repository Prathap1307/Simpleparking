'use client';

import { useParams } from 'next/navigation';
import Cardscmp from '@/components/Cardscmp';
import Navbarcmp from '@/components/Navbar';
import LoadingCard from '@/components/Loading';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const params = useParams();
  const selectedAirportRaw = params?.selectedAirport;
  const selectedAirport = decodeURIComponent(selectedAirportRaw || 'London Luton Airport');

  const [LocationsData, setLocationsData] = useState([]);
  const [ParkingslotData, setParkingslotData] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searching, setSearching] = useState(true); // Start as loading

  const [duration, setDuration] = useState({ days: 0, hours: 0 });


  const fetchAllData = async () => {
    setSearching(true); // Show loading
    try {
      const [locationsRes, parkingRes] = await Promise.all([
        fetch("/api/Locations"),
        fetch("/api/Parkingspace"),
      ]);

      if (!locationsRes.ok || !parkingRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const locationsData = await locationsRes.json();
      const parkingData = await parkingRes.json();

      setLocationsData(locationsData);
      setParkingslotData(parkingData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setSearching(false); // Hide loading
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const filtered = ParkingslotData.filter(
      (slot) =>
        slot.Location?.toLowerCase().trim() === selectedAirport.toLowerCase().trim()
    );
    setFilteredSlots(filtered);
  }, [ParkingslotData, selectedAirport]);

    useEffect(() => {
    const storedData = sessionStorage.getItem("parkingSearchData");
    if (storedData) {
      const { dropOffDate, dropOffTime, pickupDate, pickupTime } = JSON.parse(storedData);

      const dropOff = new Date(dropOffDate);
      dropOff.setHours(new Date(dropOffTime).getHours(), new Date(dropOffTime).getMinutes());

      const pickup = new Date(pickupDate);
      pickup.setHours(new Date(pickupTime).getHours(), new Date(pickupTime).getMinutes());

      const durationMs = pickup - dropOff;
      const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      setDuration({ days, hours });  // <-- new state
        }
    }, []);


  return (
    <div>
      <div className="w-full bg-blue-400 pt-5 ">
        <Navbarcmp />
      </div>

      <div className="flex justify-center pt-4 pb-4 ">
        <h3 className="text-2xl">
          <span className="font-bold text-blue-800">{selectedAirport}</span>
        </h3>
      </div>

      {searching ? (
        <LoadingCard text="Searching for Parking..." />
      ) : filteredSlots.length > 0 ? (
        filteredSlots.map((slot) => (
          <Cardscmp
            key={slot.id}
            title={slot.ParkingName}
            details={slot.AvailableFacilities}
            price={slot.price_per_day}
            pricePerHour={slot.Price_per_hour}  // <-- from backend
            imageUrl={slot.imageUrl}
            duration={duration}
            setSearching={setSearching}
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
