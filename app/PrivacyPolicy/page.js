'use client';

import Footer from '@/components/Footer';
import Navbarcmp from '@/components/Navbar';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {

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
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Privacy Policy</span>
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
                This is the privacy notice of Simple Parking Ltd. In this document, "we", "our", or "us" refer to Simple Parking Ltd. Protecting your private information is our priority. This Statement of Privacy applies to Simple Parking Ltd and governs data collection and usage.
              </p>
              <p className="mb-4">
                We have developed this policy in order for you to understand how we collect, use, communicate and make use of personal information. The following outlines our privacy policy.
              </p>
              <p className="mb-4">
                When accessing the Simple Parking website, we will learn certain information about you during your visit.
              </p>
              <p>
                Similar to other commercial websites, our website utilizes a standard technology called 'cookies' (see explanation below) and server logs to collect information about how our site is used.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Information We Collect</h2>
              <p className="mb-4">
                Simple Parking Ltd may collect personally identifiable information when you sign up on our membership site. We collect information such as:
              </p>
              <ul className="space-y-2 list-disc pl-5 mb-4">
                <li>Name</li>
                <li>Address</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Payment Information</li>
                <li>Vehicle Details</li>
                <li>Flight Details</li>
              </ul>
              <p>
                We may also collect anonymous demographic information, which is not unique to you. We may gather additional personal or non-personal information in the future.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">How We Use Your Information</h2>
              <p className="mb-4">
                Simple Parking Ltd collects and uses your personal information to operate its website(s) and deliver the services you have requested. We may also use your personally identifiable information to inform you of other products or services available from Simple Parking Ltd and its affiliates.
              </p>
              <p>
                Specifically, we use your information to:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2">
                <li>Identify you and any account you hold with us</li>
                <li>Provide and manage the services you request</li>
                <li>Communicate with you about bookings and services</li>
                <li>Improve our website and services</li>
                <li>Customize your experience</li>
                <li>Troubleshoot problems and resolve disputes</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Data Protection Rights Under GDPR</h2>
              <p className="mb-4">
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Simple Parking Ltd aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
              </p>
              <p className="mb-2">
                If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
              </p>
              <p className="mb-2">
                In certain circumstances, you have the following data protection rights:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>The right to access, update or delete your information</li>
                <li>The right of rectification</li>
                <li>The right to object</li>
                <li>The right of restriction</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Cookies Policy</h2>
              <p className="mb-4">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
              </p>
              <p className="mb-2">
                We use cookies in the following ways:
              </p>
              <ul className="space-y-2 list-disc pl-5 mb-4">
                <li>To track how you use our website</li>
                <li>To record whether you have seen specific messages we display</li>
                <li>To keep you signed in to our site</li>
                <li>To record your answers to surveys and questionnaires</li>
              </ul>
              <p>
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect the security of your personal information both online and offline. These measures include:
              </p>
              <ul className="space-y-2 list-disc pl-5 mb-4">
                <li>Encryption of sensitive data</li>
                <li>Secure servers and networks</li>
                <li>Regular security assessments</li>
                <li>Restricted access to personal information</li>
              </ul>
              <p>
                While we strive to protect your personal information, we cannot guarantee the absolute security of any information you transmit to us or from our online products or services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Third-Party Services</h2>
              <p className="mb-4">
                We may employ third-party companies and individuals to facilitate our services ("Service Providers"), provide services on our behalf, perform service-related services or assist us in analyzing how our services are used.
              </p>
              <p className="mb-4">
                These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              <p>
                We may use third-party Service Providers to monitor and analyze the use of our services, such as Google Analytics.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">Contact Us</h2>
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
                    <p className="text-gray-400 text-sm">Postal Address</p>
                    <p className="font-medium">Data Protection Officer, Simple Parking Ltd, 595 Sipson Rd, Sipson, West Drayton UB7 0JD</p>
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

export default PrivacyPolicy;