export const metadata = {
  title: "Heathrow Terminal 5 Parking | Official T5 Car Parks | Best Rates",
  description: "Closest parking for Heathrow T5 - choose between on-site, meet & greet, or budget long stay options.",
}

export default function Terminal5Page() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero */}
      <div className="py-20 px-6 bg-[url('/t5-bg.jpg')] bg-cover bg-center">
        <div className="max-w-7xl mx-auto text-center backdrop-blur-sm bg-black/30 p-12 rounded-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Heathrow <span className="text-indigo-400">Terminal 5</span> Parking
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            <strong>🚶‍♂️ 5-min walk | 🔌 EV Charging | 🛄 Luggage Help</strong>
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg"
          >
            BOOK T5 PARKING
          </a>
        </div>
      </div>

      {/* Parking Options */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          T5 <span className="text-indigo-400">Parking Options</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Short Stay T5",
              price: "£8/day",
              desc: "Closest to terminal (5-min walk)",
              cta: "BOOK SHORT STAY"
            },
            {
              title: "T5 Meet & Greet",
              price: "£12/day",
              desc: "We park for you - drop at departures",
              cta: "BOOK VALET"
            },
            {
              title: "Long Stay T5",
              price: "£5/day",
              desc: "Budget option with free shuttle",
              cta: "BOOK LONG STAY"
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-indigo-400 text-xl mb-4">{item.price}</p>
              <p className="text-gray-300 mb-6">{item.desc}</p>
              <a 
                href={`/`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-sm"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}