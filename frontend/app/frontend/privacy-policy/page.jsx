'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow border-t border-gray-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Privacy Policy</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              Last Updated: June 2026
              <br /><br />
              At Zayoraa, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website, place an order, or interact with our services.
              By accessing or using our website, you agree to the practices described in this Privacy Policy.
            </p>
          </header>

          {/* Policy Sections */}
          <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200 overflow-hidden">
            {/* Introduction */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> */}
                Introduction
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Zayoraa is committed to maintaining the privacy and security of customer information. We collect only the information necessary to process orders, improve customer experience, provide support, and operate our business efficiently.</p>
                <p>This Privacy Policy explains what information we collect, how we use it, and the choices available to you regarding your personal data.</p>
                <p>We encourage all users to read this policy carefully before using our website or purchasing our products.</p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg> */}
                Information We Collect
              </h2>
              <div className="ml-9 pl-1 space-y-6">
                <p className="text-gray-700">We may collect information directly from customers as well as information automatically generated through website usage.</p>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                    <li className="flex items-center">✔ Full Name</li>
                    <li className="flex items-center">✔ Email Address</li>
                    <li className="flex items-center">✔ Mobile Number</li>
                    <li className="flex items-center">✔ Billing Address</li>
                    <li className="flex items-center">✔ Shipping Address</li>
                    <li className="flex items-center">✔ Order History</li>
                    <li className="flex items-center">✔ Customer Support Communications</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Information</h3>
                  <p className="text-gray-700">✔ Payment details are processed securely through authorized payment gateways.</p>
                  <p className="text-gray-700">✔ Zayoraa does not store complete debit card, credit card, UPI, or banking credentials on its servers.</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Usage Information</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                    <li className="flex items-center">✔ IP Address</li>
                    <li className="flex items-center">✔ Browser Type</li>
                    <li className="flex items-center">✔ Device Information</li>
                    <li className="flex items-center">✔ Pages Visited</li>
                    <li className="flex items-center">✔ Website Activity</li>
                    <li className="flex items-center">✔ Session Data</li>
                  </ul>
                  <p className="text-gray-700 mt-3">This information helps us improve website performance and customer experience.</p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg> */}
                How We Use Your Information
              </h2>
              <div className="ml-9 pl-1 space-y-6">
                <p className="text-gray-700">We use customer information for legitimate business purposes, including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Order Processing</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Processing purchases and transactions</li>
                      <li>• Managing order fulfillment and delivery</li>
                      <li>• Providing order updates and tracking information</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Customer Support</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Responding to customer inquiries</li>
                      <li>• Resolving complaints and service requests</li>
                      <li>• Providing after-sales support</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Marketing & Communication</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Sending promotional offers and product launches</li>
                      <li>• Sharing newsletters and brand updates</li>
                      <li>• Conducting customer feedback surveys</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-2">Customers may opt out of marketing communications at any time.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Website Improvement</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Analyzing website traffic and user behavior</li>
                      <li>• Improving navigation and functionality</li>
                      <li>• Enhancing overall shopping experience</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Security & Compliance</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Detecting fraudulent activities</li>
                      <li>• Preventing unauthorized transactions</li>
                      <li>• Complying with applicable legal requirements</li>
                      <li>• Protecting customers and company interests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Sharing Of Information */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg> */}
                Sharing Of Information
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Zayoraa does not sell, rent, or trade customer information to third parties.</p>
                <p>However, information may be shared with trusted service providers when necessary for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Order fulfillment</li>
                  <li>Payment processing</li>
                  <li>Logistics and shipping</li>
                  <li>Customer support</li>
                  <li>Website analytics</li>
                </ul>
                <p>All such partners are expected to maintain appropriate security and confidentiality standards.</p>
              </div>
            </section>

            {/* Cookies & Tracking Technologies */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg> */}
                Cookies & Tracking Technologies
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Our website may use cookies and similar technologies to improve user experience and website functionality.</p>
                <p>Cookies help us:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Remember customer preferences</li>
                  <li>Analyze website performance</li>
                  <li>Improve navigation</li>
                  <li>Deliver a personalized experience</li>
                </ul>
                <p>Users may choose to disable cookies through their browser settings, although some website features may be affected.</p>
              </div>
            </section>

            {/* Data Security */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg> */}
                Data Security
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>We implement reasonable administrative, technical, and security measures to protect customer information from unauthorized access, misuse, loss, or disclosure.</p>
                <p>While we strive to maintain strong security practices, no online platform can guarantee absolute security.</p>
                <p>Customers are encouraged to keep their account credentials confidential.</p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4z"></path>
                </svg> */}
                Data Retention
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>We retain customer information only for as long as necessary to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fulfill orders</li>
                  <li>Provide customer support</li>
                  <li>Meet legal and regulatory obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p>When information is no longer required, it is securely deleted or anonymized.</p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> */}
                Your Rights
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Depending on applicable laws, customers may have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access their personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of eligible information</li>
                  <li>Withdraw marketing consent</li>
                  <li>Raise privacy-related concerns</li>
                </ul>
                <p>Requests may be submitted through our customer support team.</p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg> */}
                Third-Party Links
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Our website may contain links to third-party websites, payment gateways, or services.</p>
                <p>Zayoraa is not responsible for the privacy practices, content, or policies of external websites. Customers are encouraged to review their respective privacy policies before sharing information.</p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg> */}
                Children's Privacy
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Our website and products are not intended for individuals under the age of 18.</p>
                <p>We do not knowingly collect personal information from children.</p>
                <p>If such information is discovered, appropriate steps will be taken to remove it.</p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> */}
                Policy Updates
              </h2>
              <div className="ml-9 pl-1 space-y-4 text-gray-700">
                <p>Zayoraa reserves the right to update this Privacy Policy at any time.</p>
                <p>Any modifications will be posted on this page along with the updated revision date.</p>
                <p>Continued use of the website after updates constitutes acceptance of the revised policy.</p>
              </div>
            </section>

            {/* Contact Us */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg> */}
                Contact Us
              </h2>
              <div className="ml-9 pl-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">For questions, concerns, or requests related to this Privacy Policy, please contact:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <a href="mailto:support@zayoraa.in" className="text-blue-600 hover:underline">enquiry@zayoraa.in</a>
                      </li>
                      <li className="flex items-start">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <a href="tel:+918288985469" className="text-blue-600 hover:underline">+91 8288985469</a>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Customer Support Hours</h3>
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-gray-700">Monday to Saturday</p>
                        <p className="text-gray-700">09:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start mt-4">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div>
                        <p className="text-gray-700">Registered Office:</p>
                        <p className="text-gray-700">SF-221,2-floor, IT
	Complex, JMD Megapolis, Village Tikri, Sohna Road, Gurgaon, Haryana-122018
</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}