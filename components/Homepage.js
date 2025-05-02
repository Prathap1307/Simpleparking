"use client";

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ParkingSearchForm = () => {
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [dropOffDate, setDropOffDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Error states for form validation
  const [errors, setErrors] = useState({
    airport: '',
    dropOff: '',
    pickup: '',
    pickupBeforeDropOff: ''
  });

  useEffect(() => {
    setHasMounted(true);
    const fetchAirports = async () => {
      try {
        const response = await fetch('/api/airports');
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirports();
  }, []);

  if (!hasMounted || loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};
    const currentDate = new Date();

    // Validate fields
    if (!selectedAirport) {
      formErrors.airport = 'Please fill Airport Name';
    }
    if (!dropOffDate || !dropOffTime) {
      formErrors.dropOff = 'Please fill Drop-off Date and Time';
    }
    if (!pickupDate || !pickupTime) {
      formErrors.pickup = 'Please fill Pick-up Date and Time';
    }

    // Validate dates
    if (dropOffDate <= currentDate) {
      formErrors.dropOff = 'Drop-off Date must be in the future.';
    }
    if (pickupDate <= currentDate) {
      formErrors.pickup = 'Pick-up Date must be in the future.';
    }
    if (pickupDate < dropOffDate) {
      formErrors.pickupBeforeDropOff = 'Pick-up Date cannot be earlier than Drop-off Date.';
    }

    // Set errors state
    setErrors(formErrors);

    // If no errors, log the form data
    if (Object.keys(formErrors).length === 0) {
      console.log({
        selectedAirport,
        dropOffDate: dropOffDate?.toISOString(),
        dropOffTime: dropOffTime?.toISOString(),
        pickupDate: pickupDate?.toISOString(),
        pickupTime: pickupTime?.toISOString()
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Airport Parking</h2>
      <form onSubmit={handleSubmit}>
        {/* Airport Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Airport Name
          </label>
          <select
            value={selectedAirport}
            onChange={(e) => setSelectedAirport(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
            required
          >
            <option value="" className="text-gray-500">Select an airport</option>
            {airports.map((airport) => (
                <option key={airport.id} value={airport["Airport Name"]}>
                    {airport["Airport Name"]}
                </option>
            ))}
          </select>
          {errors.airport && <p className="text-red-500 text-xs mt-2">{errors.airport}</p>}
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drop-off Date
            </label>
            {hasMounted && (
              <DatePicker
                selected={dropOffDate}
                onChange={setDropOffDate}
                minDate={new Date()}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                placeholderText="Select date"
                required
              />
            )}
            {errors.dropOff && <p className="text-red-500 text-xs mt-2">{errors.dropOff}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drop-off Time
            </label>
            {hasMounted && (
              <DatePicker
                selected={dropOffTime}
                onChange={setDropOffTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                placeholderText="Select time"
                required
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick-up Date
            </label>
            {hasMounted && (
              <DatePicker
                selected={pickupDate}
                onChange={setPickupDate}
                minDate={dropOffDate || new Date()}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                placeholderText="Select date"
                required
              />
            )}
            {errors.pickup && <p className="text-red-500 text-xs mt-2">{errors.pickup}</p>}
            {errors.pickupBeforeDropOff && <p className="text-red-500 text-xs mt-2">{errors.pickupBeforeDropOff}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick-up Time
            </label>
            {hasMounted && (
              <DatePicker
                selected={pickupTime}
                onChange={setPickupTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                placeholderText="Select time"
                required
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Search Parking
        </button>
      </form>
    </div>
  );
};

export default ParkingSearchForm;
