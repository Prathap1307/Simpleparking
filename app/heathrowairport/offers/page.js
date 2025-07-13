export const metadata = {
  title: "Heathrow Parking Deals | 70% OFF Summer Sale | Limited Time",
  description: "Exclusive Heathrow airport parking discounts. Save 70% on meet & greet, long stay, and business parking. Book now!",
}

export default function OffersPage() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero with Countdown */}
      <div className="py-20 px-6 bg-gradient-to-b from-red-900/30 to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-600 text-white inline-block px-4 py-1 rounded-full text-sm mb-4">
            ⏳ LIMITED TIME OFFER
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              70% OFF
            </span> Heathrow Parking
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Use code <strong>HEATHROW70</strong> at checkout. Ends soon!
          </p>
          <a 
            href="/" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg"
          >
            CLAIM DISCOUNT
          </a>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Current <span className="text-indigo-400">Heathrow Deals</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Summer Holiday Special",
              discount: "70% OFF",
              desc: "Long stay parking for trips over 7 days",
              code: "SUMMER70"
            },
            {
              title: "Business Traveler Deal",
              discount: "50% OFF",
              desc: "Express meet & greet for frequent flyers",
              code: "BUSINESS50"
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl border-2 border-yellow-400/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  {item.discount}
                </span>
              </div>
              <p className="text-gray-300 mb-6">{item.desc}</p>
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Use promo code:</p>
                <p className="text-xl font-mono font-bold text-yellow-400">{item.code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}