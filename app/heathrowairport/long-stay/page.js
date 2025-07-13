export const metadata = {
  title: "Heathrow Long Stay Parking | Secure & Cheap | From £4.99/Day",
  description: "Cheapest Heathrow long stay parking with free shuttle. 70% summer sale - book online now!",
}

export default function LongStayPage() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero with Price Highlight */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Heathrow <span className="text-indigo-400">Long Stay</span> Parking
          </h1>
          <p className="text-2xl text-gray-300 mb-6">
            <span className="line-through text-red-400">£15/day</span> 
            <span className="text-green-400 ml-2">£4.99/day*</span>
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg"
          >
            BOOK LONG STAY PARKING
          </a>
          <p className="text-sm mt-4 text-gray-400">*Minimum 7 days</p>
        </div>
      </div>

      {/* Shuttle Info */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">
          Free <span className="text-indigo-400">Shuttle Service</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Every 15 Minutes</h3>
            <p className="text-gray-300 mb-4">
              Our <strong>24/7 shuttle buses</strong> serve all Heathrow terminals:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>✔️ T2/T3: 8 min ride</li>
              <li>✔️ T4: 12 min ride</li>
              <li>✔️ T5: 10 min ride</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Shuttle Schedule</h3>
            <p className="text-gray-300">
              <strong>Peak Hours:</strong> 5AM-11PM (Every 10 mins)<br/>
              <strong>Night:</strong> 11PM-5AM (Every 20 mins)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}