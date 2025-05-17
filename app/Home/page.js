'use client';

import { useState, useEffect } from 'react';
import Navbarcmp from '@/components/Navbar';
import Parkingsearchcmp from '@/components/parkingsearch';
import { Image } from '@heroui/react';
import { useRouter } from 'next/navigation';


const Homepage = () => {
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [dropOffDate, setDropOffDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [errors, setErrors] = useState({
    airport: '',
    dropOff: '',
    pickup: '',
    pickupBeforeDropOff: ''
  });

  const router = useRouter(); 

  useEffect(() => {
    setHasMounted(true);
    const fetchAirports = async () => {
      try {
        const response = await fetch("/api/Locations");
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

  const searchclick = ()=>{
    if (!selectedAirport) {
      console.warn("No airport selected.");
      return;
    }

      const searchData = {
    airport: selectedAirport,
    dropOffDate,
    dropOffTime,
    pickupDate,
    pickupTime,
  };

  sessionStorage.setItem('parkingSearchData', JSON.stringify(searchData));

  router.push(`/parking-availability/${selectedAirport}`);
  }

  return (
    <div className='w-full'>
      <div className='w-full bg-blue-400 pt-5'>
        <Navbarcmp />
      </div>
      <div>
        <div>
          <Image
            alt="HeroUI Album Cover"
            radius='none'
            className="w-full filter brightness-75 h-dvw md:h-auto"
            src="https://images.unsplash.com/photo-1629238727881-cdc61062fba1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
        <div className="absolute top-[25%] md:top-[40%] left-0 w-full px-10 z-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-white text-2xl lg:text-4xl font-semibold">
              Find the parking that suits you best
              <br />
              <span className="text-base lg:text-3xl text-yellow-400">Starting from £19</span>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <Parkingsearchcmp
              airports={airports}
              selectedAirport={selectedAirport}
              setSelectedAirport={setSelectedAirport}
              dropOffDate={dropOffDate}
              setDropOffDate={setDropOffDate}
              dropOffTime={dropOffTime}
              setDropOffTime={setDropOffTime}
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              pickupTime={pickupTime}
              setPickupTime={setPickupTime}
              loading={loading}
              hasMounted={hasMounted}
              errors={errors}
              setErrors={setErrors}
              searchonclick = {searchclick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
