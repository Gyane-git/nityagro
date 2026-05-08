"use client";
import { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Video, Save } from 'lucide-react';

export default function AdminContactPage() {
  const [contactData, setContactData] = useState({
    address: '123 Main Street, New York, NY 10001',
    mapLink: 'https://maps.google.com/?q=123+Main+Street',
    phone: '+1 (555) 123-4567',
    email: 'contact@company.com',
    facebookUrl: 'https://facebook.com/yourcompany',
    instagramUrl: 'https://instagram.com/yourcompany',
    youtubeUrl: 'https://youtube.com/@yourcompany',
    tiktokUrl: 'https://tiktok.com/@yourcompany'
  });

  const [successMessage, setSuccessMessage] = useState(false);

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Contact data updated:', contactData);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setContactData({
        address: '',
        mapLink: '',
        phone: '',
        email: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        tiktokUrl: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Contact Us Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your company's contact information and social media links</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow animate-pulse">
            <p className="text-green-700 font-semibold">✓ Contact information updated successfully!</p>
          </div>
        )}

        <div className=" lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 ml-4">Location Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Address
                  </label>
                  <textarea
                    name="address"
                    value={contactData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    name="mapLink"
                    value={contactData.mapLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="https://maps.google.com/..."
                  />
                  {contactData.mapLink && (
                    <a
                      href={contactData.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-orange-600 hover:text-orange-800 text-sm transition"
                    >
                      Preview Map →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 ml-4">Contact Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 ml-4">Social Media Links</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 mr-2 text-orange-600" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={contactData.facebookUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 mr-2 text-pink-600" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={contactData.instagramUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 mr-2 text-red-600" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={contactData.youtubeUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="https://youtube.com/@..."
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 mr-2 text-black" />
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    name="tiktokUrl"
                    value={contactData.tiktokUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition shadow hover:shadow-md"
              >
                Reset
              </button>
            </div>
          </div>

          
          
        </div>
      </div>
    </div>
  );
}
