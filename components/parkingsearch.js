'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Parkingsearchcmp({
  airports, selectedAirport, setSelectedAirport,
  dropOffDate, setDropOffDate,
  dropOffTime, setDropOffTime,
  pickupDate, setPickupDate,
  pickupTime, setPickupTime,
  loading, hasMounted,
  errors, setErrors, searchonclick
}) {
  if (!hasMounted || loading) {
    return (
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    const now = new Date();

    if (!selectedAirport) formErrors.airport = 'Please select an airport';
    if (!dropOffDate || !dropOffTime) formErrors.dropOff = 'Drop-off date and time required';
    if (!pickupDate || !pickupTime) formErrors.pickup = 'Pick-up date and time required';
    if (pickupDate <= now) formErrors.pickup = 'Pick-up must be in the future';
    if (pickupDate < dropOffDate) formErrors.pickupBeforeDropOff = 'Pick-up cannot be before Drop-off';

    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      searchonclick();
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Find Airport Parking</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Airport Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Airport</label>
          <div className="relative">
            <select
              value={selectedAirport}
              onChange={(e) => {
                setSelectedAirport(e.target.value);
                setErrors({...errors, airport: ''});
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="">Select an airport</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.Airport_name}>
                  {airport.Airport_name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.airport && (
            <p className="mt-1 text-sm text-red-600">
              {errors.airport}
            </p>
          )}
        </div>

        {/* Drop-off Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                selected={dropOffDate}
                onChange={(date) => {
                  setDropOffDate(date);
                  setErrors({...errors, dropOff: ''});
                }}
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <DatePicker
                selected={dropOffTime}
                onChange={(time) => {
                  setDropOffTime(time);
                  setErrors({...errors, dropOff: ''});
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholderText="Select time"
              />
            </div>
          </div>
          {errors.dropOff && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dropOff}
            </p>
          )}
        </div>

        {/* Pickup Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                selected={pickupDate}
                onChange={(date) => {
                  setPickupDate(date);
                  setErrors({...errors, pickup: '', pickupBeforeDropOff: ''});
                }}
                minDate={dropOffDate}
                placeholderText="Select date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <DatePicker
                selected={pickupTime}
                onChange={(time) => {
                  setPickupTime(time);
                  setErrors({...errors, pickup: ''});
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholderText="Select time"
                dateFormat="h:mm aa"
              />
            </div>
          </div>
          {(errors.pickup || errors.pickupBeforeDropOff) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pickup || errors.pickupBeforeDropOff}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Search Parking
        </button>
      </form>
    </div>
  );
}