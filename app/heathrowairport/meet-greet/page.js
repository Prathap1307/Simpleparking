export const metadata = {
  title: "Heathrow Meet & Greet Parking | VIP Terminal Service | 70% OFF",
  description: "⭐ #1 Rated Heathrow meet & greet parking. Drop your car at the terminal - we park for you! Book now for 70% off limited-time offer.",
}

export default function MeetGreetPage() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-indigo-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Heathrow <span className="text-indigo-400">Meet & Greet</span> Parking
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            <strong>🚗 Drop at Terminal | 🔒 24/7 Security | ⏱️ 2-Min Check-In</strong>
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg"
          >
            BOOK NOW - 70% OFF
          </a>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          How Heathrow <span className="text-indigo-400">Meet & Greet</span> Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Drive to Terminal",
              desc: "Meet our driver at your Heathrow terminal (T2/T3/T4/T5)",
              icon: "📍"
            },
            {
              title: "2. Hand Over Keys",
              desc: "We inspect your car and provide a receipt",
              icon: "🔑"
            },
            {
              title: "3. Fly Stress-Free",
              desc: "We park in our secured facility with 24/7 guards",
              icon: "✈️"
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl text-center">
              <span className="text-3xl block mb-4">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready for <span className="text-indigo-400">VIP Parking</span>?
          </h2>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg inline-block"
          >
            RESERVE MEET & GREET
          </a>
        </div>
      </div>
    </section>
  )
}