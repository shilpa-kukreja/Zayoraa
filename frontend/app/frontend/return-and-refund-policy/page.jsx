'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReturnRefundPolicy() {
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Cancellation & Refund Policy</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation & Refund Policy</h1>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              At Zayoraa, customer satisfaction is important to us. This Cancellation & Refund Policy outlines the conditions under which cancellations, returns, replacements, and refunds are processed for purchases made through our website.
              By placing an order with Zayoraa, you agree to the terms mentioned below.
            </p>
          </header>

          {/* Policy Sections */}
          <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200 overflow-hidden">
            {/* Policy Updates */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> */}
                Policy Updates
              </h2>
              <div className="ml-9 pl-1">
                <p className="text-gray-700">
                  Zayoraa reserves the right to modify, update, or revise this policy at any time without prior notice. Any changes will be reflected on this page with the updated effective date.
                  We encourage customers to review this policy periodically.
                </p>
              </div>
            </section>

            {/* Cancellation & Refund Policy */}
            <section className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg> */}
                Cancellation & Refund Policy
              </h2>
              <div className="ml-9 pl-1 space-y-6">
                {/* Order Cancellation */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Cancellation</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Orders can be cancelled only before they are dispatched from our warehouse.
                          To request a cancellation, customers must contact our support team immediately with their Order ID and registered contact details.
                          Once an order has been shipped, cancellation requests cannot be accepted.
                          If a prepaid order is successfully cancelled before dispatch, the refund will be processed to the original payment method.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Eligibility */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Refund Eligibility</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Refunds or replacements may be approved under the following circumstances:
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Damaged Product Received</div>
                        <div className="text-sm text-gray-600">Product received in damaged, broken, leaking, or unusable condition.</div>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Incorrect Product Delivered</div>
                        <div className="text-sm text-gray-600">Customer receives a product different from the one ordered.</div>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Missing Item in Order</div>
                        <div className="text-sm text-gray-600">One or more items are missing from the delivered package.</div>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Lost Shipment</div>
                        <div className="text-sm text-gray-600">Order confirmed by the courier partner as lost during transit.</div>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Undelivered Prepaid Orders</div>
                        <div className="text-sm text-gray-600">Order is returned to origin due to logistical issues and not delivered to the customer.</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Refund Request Process */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Refund Request Process</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <div>
                        <p className="text-gray-700">To initiate a refund or replacement request:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Contact our customer support team within 48 hours of delivery.</li>
                          <li>Share your Order ID.</li>
                          <li>Provide clear photographs or videos of the product and packaging.</li>
                          <li>Include a brief description of the issue.</li>
                          <li>Our team will review the request and may ask for additional information if required.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Processing Timeline */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Refund Processing Timeline</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-gray-700">Once the request is approved:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Refunds will be initiated to the original payment method.</li>
                          <li>Processing may take 5-7 business days depending on the payment provider or banking partner.</li>
                          <li>Customers will receive confirmation once the refund has been initiated.</li>
                          <li>For Cash on Delivery orders, refunds may be processed via bank transfer after verification.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-Refundable & Non-Returnable Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Non-Refundable & Non-Returnable Items</h3>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          Due to hygiene and safety reasons, the following products are not eligible for return or refund:
                        </p>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>❌ Opened or used oral care products</li>
                            <li>❌ Products with tampered packaging</li>
                            <li>❌ Products damaged due to misuse, improper storage, or negligence</li>
                            <li>❌ Orders where the customer has provided an incorrect shipping address</li>
                            <li>❌ Products purchased during special promotions, clearance sales, or marked as non-returnable</li>
                            <li>❌ Requests raised after the specified reporting period</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replacement Policy */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Replacement Policy</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <div>
                        <p className="text-gray-700">Where applicable, Zayoraa may offer a replacement instead of a refund.</p>
                        <p className="text-gray-700 mt-2">Replacement eligibility will be determined after reviewing the submitted evidence and verifying the issue.</p>
                        <p className="text-gray-700 mt-2">Zayoraa reserves the right to approve or reject replacement requests based on internal quality checks and policy guidelines.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failed Deliveries */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Failed Deliveries</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-gray-700">If a delivery attempt fails due to customer unavailability, incorrect address, or refusal to accept the package:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Additional shipping charges may apply for re-dispatch.</li>
                          <li>Refunds, if approved, may be processed after deducting applicable shipping and handling charges.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section className="p-6 md:p-8 ">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {/* <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg> */}
                Contact Us
              </h2>
              <div className="ml-9 pl-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">For cancellations, refund requests, replacement requests, or order-related assistance, please contact:</h3>
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