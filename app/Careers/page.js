'use client';

import Footer from '@/components/Footer';
import Navbarcmp from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useState } from 'react';


const CareersPage = () => {
  const [showContact, setShowContact] = useState(false);

  const handleApplyClick = () => {
    setShowContact(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
    <Navbarcmp />
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="grid-dots"></div>
        </div>
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900/20 filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold tracking-wider text-indigo-400 mb-4 inline-block">
            JOIN OUR TEAM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Careers at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">SimpleParking</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Join the team that's redefining convenient airport parking solutions
          </p>
        </motion.div>

        {/* About Working at SimpleParking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Grow Your Career With Us
              </h3>
              <div className="space-y-6 text-gray-300">
                <p>
                  At SimpleParking, we take pride in delivering secure, reliable, and affordable airport parking solutions. 
                  As a rapidly expanding company in the travel and transportation sector, we're continuously seeking 
                  passionate, dependable professionals to join our team.
                </p>
                <p>
                  Whether you're looking for full-time or part-time opportunities, we provide various career paths in our 
                  dynamic, customer-centric environment. We value professional growth and invest in our team members' 
                  development.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2669&auto=format&fit=crop"
              alt="SimpleParking team"
              className="w-full h-auto rounded-2xl object-cover min-h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-white font-medium">Our dedicated team at Heathrow Airport</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Join Us Section */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">SimpleParking</span>
            </h3>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We offer more than just a job - we provide career opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Reputable Brand",
                description: "Join a trusted leader in UK airport parking services with an established market presence."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Professional Development",
                description: "Comprehensive training programs and ongoing skill development opportunities."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Career Advancement",
                description: "Clear pathways for professional growth as we continue our expansion."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Flexible Scheduling",
                description: "Work arrangements designed to accommodate your lifestyle needs."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Collaborative Culture",
                description: "Work with a professional team that values integrity, punctuality, and service excellence."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: "Competitive Benefits",
                description: "Attractive compensation packages and performance incentives."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Openings Section */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Current <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Opportunities</span>
            </h3>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Explore our available positions and find your perfect fit
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "Meet & Greet Parking Drivers",
                location: "Heathrow, Gatwick, Stansted & Manchester Airports",
                type: "Full-time/Part-time",
                responsibilities: [
                  "Provide premium meet and greet services at designated airports",
                  "Ensure safe vehicle handling and transportation",
                  "Deliver exceptional customer service during vehicle handovers",
                  "Maintain professional appearance and demeanor at all times"
                ],
                requirements: [
                  "Valid UK driving license with clean record",
                  "Minimum 2 years driving experience",
                  "Excellent time management skills",
                  "Professional presentation and communication skills"
                ]
              },
              {
                title: "Customer Service Representatives",
                location: "Remote/On-site (London Office)",
                type: "Full-time/Part-time",
                responsibilities: [
                  "Handle customer inquiries via phone and email",
                  "Manage booking modifications and cancellations",
                  "Resolve customer issues with efficiency and professionalism",
                  "Maintain accurate customer service records"
                ],
                requirements: [
                  "Proven customer service experience",
                  "Exceptional verbal and written communication skills",
                  "Ability to work in fast-paced environment",
                  "Technical proficiency with CRM systems"
                ]
              },
              {
                title: "Parking Facility Supervisors",
                location: "Heathrow & Manchester Airports",
                type: "Full-time",
                responsibilities: [
                  "Oversee daily parking operations",
                  "Manage team scheduling and performance",
                  "Ensure compliance with safety protocols",
                  "Coordinate with airport authorities as needed"
                ],
                requirements: [
                  "Previous supervisory experience",
                  "Strong organizational and leadership skills",
                  "Full UK driving license",
                  "Flexibility for shift work including weekends"
                ]
              }
            ].map((job, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-white mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        {job.responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        {job.requirements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleApplyClick}
                    className="md:self-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Core Values</span>
            </h3>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              The qualities we look for in every team member
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Professionalism",
                description: "We maintain the highest standards of conduct and appearance in all interactions."
              },
              {
                title: "Reliability",
                description: "Our team members demonstrate consistent dependability in all responsibilities."
              },
              {
                title: "Communication",
                description: "Clear, effective communication is fundamental to our customer relationships."
              },
              {
                title: "Service Excellence",
                description: "We're committed to delivering exceptional experiences at every touchpoint."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                  <span className="text-white text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{value.title}</h3>
                <p className="text-gray-400 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Process</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Submit Your Application",
                description: "Email your CV and cover letter to our recruitment team, specifying your desired position."
              },
              {
                step: "2",
                title: "Initial Screening",
                description: "Our HR team will review your application and contact qualified candidates."
              },
              {
                step: "3",
                title: "Interview Process",
                description: "Successful candidates will be invited for interviews (in-person or virtual)."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute top-6 right-6 text-6xl font-bold text-gray-800/30 z-0">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                <p className="text-gray-400 relative z-10">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Information (shown when Apply is clicked or by default) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContact ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/50 ${showContact ? 'block' : 'hidden'}`}
        >
          <h3 className="text-2xl font-bold text-white mb-6">How to Apply</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Call Our Recruitment Team</h4>
                <p className="text-gray-300">+44 7444 277 110</p>
                <p className="text-gray-400 text-sm">Monday-Friday, 9am-5pm GMT</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Email Your Application</h4>
                <p className="text-gray-300">support@simpleparking.com</p>
                <p className="text-gray-400 text-sm">Include position title in subject line</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-gray-400">
                We appreciate your interest in joining SimpleParking. Our recruitment team typically responds to applications within 3-5 business days. For urgent inquiries, please call during business hours.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />    
    </section>
  );
};

export default CareersPage;