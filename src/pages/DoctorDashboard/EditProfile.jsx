import React, { useState } from 'react'
import { User, Camera, Plus, Trash2 } from 'lucide-react'
import { google_ngrok_url } from '../../utils/global'

const EditProfile = ({ doctorInfo, onSave, onClose }) => {
  const [activeSection, setActiveSection] = useState('info')
  const [tempInfo, setTempInfo] = useState({
    ...doctorInfo,
    addresses: [
      {
        address: "India",
        lat: "40.7128",
        lon: "-74.0060",
        address_type: "home"
      },
      ...(doctorInfo.addresses || [])
    ]
  })
  const [tempProfilePicture, setTempProfilePicture] = useState(null)
  const [newAddress, setNewAddress] = useState({
    address: '',
  })

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

  const handleAddressInputChange = (e) => {
    const { value } = e.target
    setNewAddress({ address: value })
  }

  const handleAddAddress = async () => {
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(newAddress.address)}&apiKey=${import.meta.env.VITE_GEO_CODE}`)
      const data = await response.json()
      if (data.features[0].properties.lat) {
        const { lat, lon, result_type } = data.features[0].properties
        
        const addressData = {
          address: newAddress.address,
          lat,
          lon,
          address_type: result_type
        }
        console.log(addressData)
        const backendResponse = await fetch(google_ngrok_url+'/doctor/add_doctor_address/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        })

        if (!backendResponse.ok) {
          throw new Error('Failed to add address')
        }

        const addedAddress = await backendResponse.json()
        setTempInfo(prev => ({
          ...prev,
          addresses: [...prev.addresses, addedAddress]
        }))
        setNewAddress({ address: '' })
      } else {
        throw new Error('No results found for the given address')
      }
    } catch (error) {
      console.error('Error adding address:', error)
    }
  }

  const handleRemoveAddress = (addressToRemove) => {
    setTempInfo(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr !== addressToRemove)
    }))
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
              {['info', 'addresses', 'picture'].map((section) => (
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

            {activeSection === 'addresses' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
                {tempInfo.addresses.map((address, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-gray-300 rounded-lg mb-2">
                    <span>{address.address}</span>
                    <button
                      onClick={() => handleRemoveAddress(address)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newAddress.address}
                    onChange={handleAddressInputChange}
                    placeholder="Enter new address"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

