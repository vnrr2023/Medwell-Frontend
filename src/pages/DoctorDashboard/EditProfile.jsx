import React, { useState } from 'react'
import { User, Camera } from 'lucide-react'

const EditProfile = ({ doctorInfo, onSave, onClose }) => {
  const [activeSection, setActiveSection] = useState('info')
  const [tempInfo, setTempInfo] = useState({ ...doctorInfo })
  const [tempProfilePicture, setTempProfilePicture] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const updatedInfo = { ...tempInfo }
    if (tempProfilePicture) {
      updatedInfo.profilePicture = tempProfilePicture
    }
    onSave(updatedInfo)
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-1/4">
            <ul className="space-y-2">
              {['info', 'address', 'picture'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeSection === section
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full md:w-3/4">
            {activeSection === 'info' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
                {[
                  { id: 'name', label: 'Name', type: 'text' },
                  { id: 'specialization', label: 'Specialization', type: 'text' },
                  { id: 'experience', label: 'Experience', type: 'text' },
                  { id: 'phone', label: 'Phone', type: 'tel' },
                  { id: 'email', label: 'Email', type: 'email' },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={tempInfo[field.id]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'address' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Address Information</h2>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={tempInfo.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeSection === 'picture' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mb-4">
                    {tempProfilePicture || tempInfo.profilePicture ? (
                      <img
                        src={tempProfilePicture || tempInfo.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-blue-400" />
                    )}
                  </div>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Picture
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile

