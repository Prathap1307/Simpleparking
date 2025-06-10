'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "@heroui/react";

export default function Parkingsearchcmp({
  airports, selectedAirport, setSelectedAirport,
  dropOffDate, setDropOffDate,
  dropOffTime, setDropOffTime,
  pickupDate, setPickupDate,
  pickupTime, setPickupTime,
  loading, hasMounted,
  errors, setErrors , searchonclick
}) {
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
    const formErrors = {};
    const now = new Date();

    if (!selectedAirport) formErrors.airport = 'Please select an airport.';
    if (!dropOffDate || !dropOffTime) formErrors.dropOff = 'Please fill Drop-off Date and Time';
    if (!pickupDate || !pickupTime) formErrors.pickup = 'Please fill Pick-up Date and Time';
    if (pickupDate <= now) formErrors.pickup = 'Pick-up must be in the future.';
    if (pickupDate < dropOffDate) formErrors.pickupBeforeDropOff = 'Pick-up cannot be before Drop-off.';

    setErrors(formErrors);
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Airport Parking</h2>
      <form onSubmit={handleSubmit}>
        {/* Airport Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Airport Name</label>
          <select
            value={selectedAirport}
            onChange={(e) => setSelectedAirport(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.Airport_name}>
                {airport.Airport_name}
              </option>
            ))}
          </select>
          {errors.airport && <p className="text-red-500 text-xs">{errors.airport}</p>}
        </div>

        {/* Drop-off Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Date</label>
            <DatePicker
              selected={dropOffDate}
              onChange={setDropOffDate}
              minDate={"NA"}
              placeholderText="Select date"
              className="w-full p-2 border border-gray-300 rounded-md"
              dateFormat="dd/MM/yyyy"
            />
            {errors.dropOff && <p className="text-red-500 text-xs">{errors.dropOff}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Time</label>
            <DatePicker
              selected={dropOffTime}
              onChange={setDropOffTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholderText="Select time"
            />
          </div>
        </div>

        {/* Pickup Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
            <DatePicker
              selected={pickupDate}
              onChange={setPickupDate}
              minDate={dropOffDate}
              placeholderText="Select date"
              className="w-full p-2 border border-gray-300 rounded-md"
              dateFormat="dd/MM/yyyy"
            />
            {errors.pickup && <p className="text-red-500 text-xs">{errors.pickup}</p>}
            {errors.pickupBeforeDropOff && <p className="text-red-500 text-xs">{errors.pickupBeforeDropOff}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Time</label>
            <DatePicker
              selected={pickupTime}
              onChange={setPickupTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholderText="Select time"
              dateFormat="h:mm aa"
            />
          </div>
        </div>

        <Button onClick={searchonclick} type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
          Search
        </Button>
      </form>
    </div>
  );
}
