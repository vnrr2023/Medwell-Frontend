import React, { useState } from 'react'
import { Edit, X, User, Briefcase, MapPin, Phone, Mail, Camera, QrCode } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const initialDoctorInfo = {
  name: "Dr. Nishi Sir",
  specialization: "Engiologist",
  experience: "15 years",
  location: "India, IN",
  phone: "+91 9819191971",
  email: "nishi@gmail.com",
  profilePicture: './doctorpfp.png',
  qrCodePicture: './dummyqr.png'
}

export function DoctorProfile() {
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [tempProfilePicture, setTempProfilePicture] = useState(null)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedInfo = Object.fromEntries(formData.entries())
    updatedInfo.profilePicture = tempProfilePicture || doctorInfo.profilePicture
    setDoctorInfo(updatedInfo)
    setIsEditModalOpen(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Background */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[250px] md:h-[350px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-[50px] md:rounded-b-[100px]">
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 320"
              className="w-full h-auto transform translate-y-1"
              preserveAspectRatio="none"
            >
              <path
                fill="rgb(239 246 255)"
                fillOpacity="1"
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Profile Content */}
        <div className="relative pt-12 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:flex-row md:items-start md:space-x-8"
          >
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {doctorInfo.profilePicture ? (
                  <img
                    src={doctorInfo.profilePicture}
                    alt={doctorInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <User className="w-16 h-16 text-blue-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-6 md:mt-0 text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white md:mb-2">{doctorInfo.name}</h1>
                  <p className="text-lg text-blue-100 mb-4">{doctorInfo.specialization}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsQRModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8"
          >
            {[
              { icon: Briefcase, label: 'Experience', value: doctorInfo.experience },
              { icon: MapPin, label: 'Location', value: doctorInfo.location },
              { icon: Phone, label: 'Phone', value: doctorInfo.phone },
              { icon: Mail, label: 'Email', value: doctorInfo.email },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-lg font-medium text-gray-900">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mb-4">
                      {tempProfilePicture || doctorInfo.profilePicture ? (
                        <img
                          src={tempProfilePicture || doctorInfo.profilePicture}
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

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {[
                      { id: 'name', label: 'Name', type: 'text', value: doctorInfo.name },
                      { id: 'specialization', label: 'Specialization', type: 'text', value: doctorInfo.specialization },
                      { id: 'experience', label: 'Experience', type: 'text', value: doctorInfo.experience },
                      { id: 'location', label: 'Location', type: 'text', value: doctorInfo.location },
                      { id: 'phone', label: 'Phone', type: 'tel', value: doctorInfo.phone },
                      { id: 'email', label: 'Email', type: 'email', value: doctorInfo.email },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          defaultValue={field.value}
                          className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isQRModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
                <button
                  onClick={() => setIsQRModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={doctorInfo.qrCodePicture}
                  alt="Doctor QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Scan this QR code to quickly access the doctor's information.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}