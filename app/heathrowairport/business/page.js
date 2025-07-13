export const metadata = {
  title: "Heathrow Business Parking | Fast Track for Corporate Travel",
  description: "Dedicated parking solutions for business travelers at Heathrow - meet & greet, priority lanes, and expense tracking.",
}

export default function BusinessPage() {
  return (
    <section className="bg-gray-950 text-white">
      {/* Hero */}
      <div className="py-20 px-6 bg-[url('/business-bg.jpg')] bg-cover bg-center">
        <div className="max-w-7xl mx-auto text-center backdrop-blur-sm bg-black/40 p-12 rounded-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Heathrow <span className="text-indigo-400">Business Parking</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            <strong>⚡ Fast Track | 📈 Expense Reports | 🚗 Priority Parking</strong>
          </p>
          <a 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-lg"
          >
            ENQUIRE ABOUT CORPORATE RATES
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          For <span className="text-indigo-400">Frequent Business Travelers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Dedicated Business Lane",
              icon: "🚘",
              desc: "Skip queues with our priority entry lane"
            },
            {
              title: "Monthly Billing",
              icon: "🧾",
              desc: "Single invoice for all employee parking"
            },
            {
              title: "Free Cancellation",
              icon: "🔄",
              desc: "Change plans without penalty"
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl text-center">
              <span className="text-4xl block mb-4">{item.icon}</span>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}