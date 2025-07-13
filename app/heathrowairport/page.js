// app/heathrowairport/page.js
export const metadata = {
  title: "Heathrow Airport Parking | 70% OFF Meet & Greet | Book Now",
  description: "✅ Cheapest Heathrow airport parking with 70% discount. Secure, 24/7 guarded meet & greet parking. Book online in 60 seconds!",
  keywords: "heathrow airport parking, LHR parking, meet and greet heathrow, cheap heathrow parking, 70% off airport parking",
  openGraph: {
    title: "Heathrow Airport Parking - 70% OFF Summer Sale",
    description: "VIP meet & greet parking at Heathrow. Book now for lowest prices!",
    images: ['/heathrow-parking-og.jpg'],
  },
}

export default function HeathrowAirportParking() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero Section with 70% Offer */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
              70% OFF
            </span> Heathrow Airport Parking
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            ✈️ <strong>Meet & Greet Service</strong> - Drop your car and walk straight to terminal. 
            <br />Limited-time summer sale - <strong>Book now & save!</strong>
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all"
          >
            BOOK NOW FOR 70% OFF
          </a>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our <span className="text-indigo-400">Heathrow Parking</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Meet & Greet Heathrow",
              desc: "🚗 VIP service - We park for you at all Heathrow terminals (T2, T3, T4, T5)",
              link: "/"
            },
            {
              title: "Long Stay Parking LHR",
              desc: "🛡️ 24/7 secured parking with CCTV - Perfect for holidays & business trips",
              link: "/"
            },
            {
              title: "Fast Track Booking",
              desc: "⚡ Reserve in 60 seconds - No prepayment needed",
              link: "/"
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3">
                <a href={item.link} className="hover:text-indigo-400">{item.title}</a>
              </h3>
              <p className="text-gray-300">{item.desc}</p>
              <a href={item.link} className="text-indigo-400 hover:underline mt-4 inline-block">
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Location-Specific Content */}
      <div className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Heathrow Airport Parking <span className="text-indigo-400">Terminal Guide</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">T2 & T3 Parking</h3>
              <p className="text-gray-300 mb-4">
                Closest parking for <strong>Terminal 2 & 3</strong> with <strong>free shuttle service</strong> every 10 minutes. 
                Special <a href="/heathrow/t2-discount" className="text-indigo-400 hover:underline">discount for early birds</a>.
              </p>
              <a href="/" className="text-indigo-400 hover:underline">
                View T2/T3 parking rates →
              </a>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">T5 Parking</h3>
              <p className="text-gray-300 mb-4">
                Dedicated <strong>Heathrow Terminal 5 parking</strong> with <strong>undercover spaces</strong>. 
                <a href="/" className="text-indigo-400 hover:underline"> Valet option available</a>.
              </p>
              <a href="/" className="text-indigo-400 hover:underline">
                View T5 parking map →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO-Optimized FAQ */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Heathrow Parking <span className="text-indigo-400">FAQs</span>
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Where is the cheapest Heathrow airport parking?",
              a: "Our <strong>off-site parking with shuttle</strong> offers the lowest rates (from £5/day). <a href='/heathrow/cheap-parking' className='text-indigo-400 hover:underline'>See current 70% offer</a>."
            },
            {
              q: "Is meet and greet at Heathrow safe?",
              a: "Yes! All our <strong>Heathrow meet & greet</strong> services include fully insured drivers and 24/7 tracking. <a href='/security' className='text-indigo-400 hover:underline'>View security measures</a>."
            }
          ].map((item, index) => (
            <div key={index} className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2">{item.q}</h3>
              <div 
                className="text-gray-300" 
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-indigo-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Park at <span className="text-indigo-400">Heathrow</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book now and use code <strong>HEATHROW70</strong> for 70% off first booking!
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all inline-block"
          >
            SECURE MY DISCOUNT
          </a>
        </div>
      </div>
    </section>
  )
}