import React, { useState } from 'react'
import { Edit, QrCode, Briefcase, MapPin, Phone, Mail, User } from 'lucide-react'
import EditProfile from './EditProfile'

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
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  const handleEditSubmit = (updatedInfo) => {
    setDoctorInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }))
    setIsEditProfileOpen(false)
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
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
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
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            {[
              { icon: Briefcase, label: 'Experience', value: doctorInfo.experience },
              { icon: MapPin, label: 'Location', value: doctorInfo.location },
              { icon: Phone, label: 'Phone', value: doctorInfo.phone },
              { icon: Mail, label: 'Email', value: doctorInfo.email },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-lg font-medium text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      {isEditProfileOpen && (
        <EditProfile
          doctorInfo={doctorInfo}
          onSave={handleEditSubmit}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
          </div>
        </div>
      )}
    </div>
  )
}

