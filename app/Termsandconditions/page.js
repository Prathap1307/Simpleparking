'use client';

import Footer from '@/components/Footer';
import Navbarcmp from '@/components/Navbar';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {

      // Scroll to search function
  const scrollToSearch = () => {
    const searchSection = document.getElementById('Searchfrom');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className='w-full'>
        <Navbarcmp onFindParkingClick={scrollToSearch} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Terms & Conditions</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </motion.p>
        </div>

        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Introduction</h2>
              <p className="mb-4">
                Simple Parking Ltd acts as a booking agent. All responsibility and liability for vehicles lie with the selected parking service provider.
              </p>
              <p className="mb-4">
                We aim to make your airport parking experience seamless. Please carefully review all the details below and on our website <a href="http://www.simpleparking.uk" className="text-indigo-400 hover:underline">www.simpleparking.uk</a> to ensure you understand the service(s) offered before making a booking.
              </p>
              <p className="mb-4">
                By using our booking services, you agree to be bound by the terms and conditions of both <strong>Simple Parking Ltd</strong> and the chosen service provider. These terms help us maintain competitive pricing and ensure transparency for our customers.
              </p>
              <p className="mb-4">
                These terms and conditions are governed by English law and are effective from the time we issue a booking reference, either by phone or online.
              </p>
              <p className="mb-4">
                If any term is deemed unenforceable, the remainder of the agreement shall remain valid and enforceable.
              </p>
              <p>
                Simple Parking Ltd reserves the right to amend these Terms at any time. However, the Terms that apply to your booking will be those displayed at the time of booking.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Bookings</h2>
              <ul className="space-y-4 list-disc pl-5">
                <li>Customers must read all information and the service provider's own terms before completing a booking.</li>
                <li>Bookings are confirmed via email once a reference number has been issued. If you do not receive a confirmation email, contact us immediately.</li>
                <li>Telephone or chat bookings will also be confirmed with a reference number.</li>
                <li>Bookings are subject to availability and may be cancelled if the provider cannot fulfil the service. In such cases, a refund will be issued, but <strong>Simple Parking Ltd</strong> is not liable for consequential losses.</li>
                <li>Bookings are non-transferable.</li>
                <li>It is your responsibility to provide accurate contact information and to read all arrival instructions.</li>
                <li>You must carry your confirmation email when travelling.</li>
                <li>Mystery or Saver products may not disclose the specific parking provider until after booking. These are offered at a lower rate and may not suit all needs.</li>
                <li>We may occasionally need to change your booking. If this occurs and the new arrangement is unsuitable, you will receive a full refund.</li>
                <li>Dashcams and trackers may be disallowed by service providers for insurance and security reasons. Please confirm with them before booking.</li>
                <li>Vehicles may be moved between compounds owned by the provider for operational purposes.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Prices and Payments</h2>
              <ul className="space-y-4 list-disc pl-5">
                <li>All prices are in GBP and for pre-booking only.</li>
                <li>Bookings include a <strong>non-refundable booking fee</strong>.</li>
                <li>Payments are accepted via all major credit/debit cards and PayPal. We use third-party payment processors, so you may see their name on your bank statements.</li>
                <li>If card payment fails, the service will not be fulfilled.</li>
                <li>Service providers may charge additional fees for extras (e.g., terminal access, delays, large vehicles). These are set independently by the provider.</li>
                <li><strong>Simple Parking Ltd</strong> cannot issue VAT receipts, as we act only as booking agents. You must request VAT invoices directly from the service provider.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Amendments and Cancellations</h2>
              <ul className="space-y-4 list-disc pl-5">
                <li>All requests must be sent in writing to <a href="mailto:support@simpleparking.uk" className="text-indigo-400 hover:underline">support@simpleparking.uk</a> with your booking reference.</li>
                <li>You may cancel up to <strong>48 hours</strong> before the drop-off time (excluding non-flexible offers). A £15 admin fee applies unless you purchased Cancellation Cover.</li>
                <li><strong>Cancellation Cover</strong>, if bought, allows cancellation up to 48 hours prior, with a full refund of the parking price (excluding booking fees and extras).</li>
                <li>No refunds are issued for cancellations within 48 hours of drop-off or for no-shows.</li>
                <li>Same-day or next-day bookings are <strong>non-refundable</strong>.</li>
                <li>Amendments within 48 hours incur a £15 admin fee per amendment, in addition to any price difference.</li>
                <li>Post drop-off amendments must be directed to the service provider and paid on return, if available.</li>
                <li>Once cancelled or amended and confirmed, bookings cannot be reversed.</li>
                <li>Refunds are made to the original payment method.</li>
                <li>The service is deemed to commence at midnight the day before your drop-off date.</li>
                <li><strong>Non-refundable</strong> bookings (Savers or non-flexible products) cannot be amended or cancelled.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Simple Parking Ltd's Liability</h2>
              <ul className="space-y-4 list-disc pl-5">
                <li>We act only as a <strong>booking agent</strong>. We do not own, operate, or control any parking service. Your contract for vehicle handling is with the selected provider.</li>
                <li>You agree to both our Terms and the provider's Terms when you book.</li>
                <li><strong>Simple Parking Ltd</strong> is not liable for any damage, loss, or theft related to your vehicle – such matters must be taken up directly with the provider.</li>
                <li>Vehicles are parked at your own risk. Do not leave valuables in the vehicle.</li>
                <li>We do not warrant or guarantee the safety, security, or condition of any vehicles or premises.</li>
                <li>Our liability is limited to errors caused by our own negligence in processing bookings and is capped at the total amount you paid to us.</li>
                <li>We are not responsible for indirect or consequential losses (e.g., missed flights, loss of earnings, etc.). Ensure you have appropriate travel insurance.</li>
                <li>Information listed on our website is based on details provided by the service providers. While we strive for accuracy, we cannot guarantee completeness or ongoing accuracy.</li>
                <li>We do not endorse or guarantee the standards of any provider. Always review their terms before booking.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Complaints</h2>
              <ul className="space-y-4 list-disc pl-5">
                <li>For issues related to <strong>car parking services</strong>, contact the service provider directly and send a copy to <strong>Simple Parking Ltd</strong> at <a href="mailto:support@simpleparking.uk" className="text-indigo-400 hover:underline">support@simpleparking.uk</a>.</li>
                <li>Include as much detail as possible, such as booking reference, photos, and supporting documents.</li>
                <li>For complaints regarding the <strong>booking process</strong>, email us directly.</li>
                <li><strong>Simple Parking Ltd</strong> accepts liability only for issues directly caused by our own booking process negligence.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Contact Information</h2>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Simple Parking Ltd</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Website</p>
                    <p className="font-medium">
                      <a href="https://www.simpleparking.uk" className="text-indigo-400 hover:underline">www.simpleparking.uk</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-medium">
                      <a href="mailto:support@simpleparking.uk" className="text-indigo-400 hover:underline">support@simpleparking.uk</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Operating Hours</p>
                    <p className="font-medium">24/7 including bank holidays</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    <Footer />
    </div>
  );
};

export default TermsAndConditions;