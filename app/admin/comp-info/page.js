"use client";
import { useState } from 'react';
import { ArrowLeft, Save, Eye, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function CompanyInfoPage() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Company Info',
      content: 'We are a leading company in our industry, dedicated to providing exceptional services and products to our customers worldwide.'
    },
    {
      id: 2,
      title: 'Privacy Policy',
      content: 'To innovate and deliver high-quality solutions that empower businesses and individuals to achieve their goals.'
    },
    {
      id: 3,
      title: 'Return & Refund Policy',
      content: 'To be the most trusted and respected company in our field, known for excellence, integrity, and innovation.'
    }
  ]);

  const [successMessage, setSuccessMessage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTitleChange = (id, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, title: value } : section
    ));
  };

  const handleContentChange = (id, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content: value } : section
    ));
  };

  const handleSubmit = () => {
    console.log('Company info updated:', sections);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const EditorToolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300 rounded-t-lg">
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Bold">
        <Bold className="w-4 h-4 text-gray-700" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Italic">
        <Italic className="w-4 h-4 text-gray-700" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Underline">
        <Underline className="w-4 h-4 text-gray-700" />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
        <List className="w-4 h-4 text-gray-700" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
        <ListOrdered className="w-4 h-4 text-gray-700" />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Align Left">
        <AlignLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Align Center">
        <AlignCenter className="w-4 h-4 text-gray-700" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded transition" title="Align Right">
        <AlignRight className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Company Information
                </h1>
                <p className="text-gray-600 mt-2">Manage your company's public information and content</p>
              </div>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  previewMode 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow animate-pulse">
            <p className="text-green-700 font-semibold">✓ Company information updated successfully!</p>
          </div>
        )}

        {/* Content Sections */}
        {previewMode ? (
          // Preview Mode
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={section.id} className="bg-white rounded-lg shadow-lg p-6 transform transition hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Section {index + 1}</h3>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleTitleChange(section.id, e.target.value)}
                    className="w-full px-4 py-3 text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="Enter section title"
                  />
                </div>

                {/* CKEditor-style Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <EditorToolbar />
                    <textarea
                      value={section.content}
                      onChange={(e) => handleContentChange(section.id, e.target.value)}
                      rows="8"
                      className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                      placeholder="Enter section content here..."
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{section.content.length} characters</span>
                    <span className="text-gray-400">Rich text editor toolbar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {!previewMode && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
}