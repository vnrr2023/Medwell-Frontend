import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Link } from "react-router-dom";
import { google_ngrok_url } from '../../utils/global'
import { MapPin, Search, AlertTriangle, Stethoscope, Pill, FileText, UserPlus } from 'lucide-react'

const DoctorIcon = new L.Icon({
  iconUrl: 'modiji.svg',
  iconAnchor: [44, 60],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: [80, 100],
});

const dummyDoctors = [
  { id: 1, name: "Dr. Sanika", specialty: "General Physician", address: "123 MG Road, Bangalore, Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { id: 2, name: "Dr. Nishikant", specialty: "Pediatrician", address: "456 Anna Salai, Chennai, Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { id: 3, name: "Mc. Rohit Seshmukh", specialty: "Church priest", address: "789 SV Road, Mumbai, Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { id: 4, name: "Dr. Rehan 👁️sha", specialty: "Gynecologist", address: "101 Camac Street, Kolkata, West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { id: 5, name: "Dr. Rehan", specialty: "Other", address: "16 SV Road, Mumbai, Maharashtra", latitude: 18.5726, longitude: 73.3639 },
  { id: 6, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
]

function MapUpdater({ center, onMapClick }) {
  const map = useMap();
  map.setView(center, 13);

  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return null;
}

export default function DoctorSearch() {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState(dummyDoctors)
  const [filteredDoctors, setFilteredDoctors] = useState(dummyDoctors)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [isBlurred, setIsBlurred] = useState(true)
  const [error, setError] = useState(null)
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [locationOption, setLocationOption] = useState('current') // Updated
  const [userLocation, setUserLocation] = useState(null)
  const doctorsPerPage = 5
  const [districts] = useState([
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ])

  const searchNearbyDoctors = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(google_ngrok_url+'/search_doctors', {
        latitude: lat,
        longitude: lon
      })

      if (response.data && response.data.length > 0) {
        setDoctors(response.data)
        setFilteredDoctors(response.data)
      } else {
        setDoctors([])
        setFilteredDoctors([])
        setError('No doctors found in this location.')
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Failed to fetch nearby doctors. Please try again.')
    } finally {
      setLoading(false)
      setIsBlurred(false)
    }
  }, [])

  const handleLocationChange = async (e) => { // Updated
    const selectedOption = e.target.value;
    setLocationOption(selectedOption);

    if (selectedOption === 'current') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          searchNearbyDoctors(latitude, longitude);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setError('Failed to get your current location. Please ensure location services are enabled.');
        }
      );
    } else {
      const dummyCoordinates = {
        'Mumbai': [19.0760, 72.8777],
        'Delhi': [28.6139, 77.2090],
        'Bangalore': [12.9716, 77.5946],
        'Hyderabad': [17.3850, 78.4867],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Pune': [18.5204, 73.8567],
        'Ahmedabad': [23.0225, 72.5714],
        'Jaipur': [26.9124, 75.7873],
        'Lucknow': [26.8467, 80.9462]
      };

      const [latitude, longitude] = dummyCoordinates[selectedOption] || [20.5937, 78.9629];
      setMapCenter([latitude, longitude]);
      searchNearbyDoctors(latitude, longitude);
    }
  }

  const handleLocationSearch = async (e) => { // Updated
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (locationOption === 'current') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setMapCenter([latitude, longitude])
            searchNearbyDoctors(latitude, longitude)
          },
          (error) => {
            console.error('Error getting current location:', error)
            setError('Failed to get your current location. Please ensure location services are enabled.')
            setLoading(false)
          }
        )
      } else {
        // Use the coordinates set by handleLocationChange
        await searchNearbyDoctors(mapCenter[0], mapCenter[1])
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred while searching for doctors.')
      setLoading(false)
    }
  }

  const handleMapClick = (latlng) => {
    setMapCenter([latlng.lat, latlng.lng])
    searchNearbyDoctors(latlng.lat, latlng.lng)
  }

  useEffect(() => {
    const filtered = doctors.filter(doctor => 
      specialtyFilter === '' || doctor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
    )
    setFilteredDoctors(filtered)
    setCurrentPage(1)
  }, [doctors, specialtyFilter])

  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-[#27428c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Your home for health</h1>
        <h2 className="text-2xl text-white text-center mb-8">Find Your Doctor</h2>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <form onSubmit={handleLocationSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0 md:pr-4">
              <MapPin className="text-gray-400" />
              <select
                value={locationOption}
                onChange={handleLocationChange}
                className="w-full p-2 focus:outline-none"
              >
                <option value="current">Use current location</option> 
                {districts.map((district) => ( 
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <Search className="text-gray-400" />
              <input
                type="text"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                placeholder="Search doctors, clinics, hospitals, etc."
                className="w-full p-2 focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Search
            </button>
          </form>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {["Dermatologist", "Pediatrician", "Gynecologist", "Other"].map((specialty) => (
              <button 
                key={specialty}
                onClick={() => setSpecialtyFilter(specialty)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="relative">
            <div className={`${isBlurred ? 'filter blur-md' : ''}`}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <div className="h-[calc(100vh-300px)] w-full rounded-lg overflow-hidden shadow-lg">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapUpdater center={mapCenter} onMapClick={handleMapClick} />
                      {filteredDoctors.map((doctor) => (
                        <Marker 
                          key={doctor.id} 
                          position={[doctor.latitude, doctor.longitude]} 
                          icon={DoctorIcon}
                          eventHandlers={{
                            click: () => setSelectedDoctor(doctor),
                          }}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-bold">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialty}</p>
                              <p className="text-sm">{doctor.address}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <h2 className="text-2xl font-bold mb-4">Doctors</h2>
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto pr-4">
                    {currentDoctors.map((doctor) => (
                      <div key={doctor.id} className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h3 className="font-bold text-lg text-blue-600">{doctor.name}</h3>
                        <p className="text-gray-700">{doctor.specialty}</p>
                        <p className="text-gray-600 text-sm mt-1">{doctor.address}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    {Array.from({ length: Math.ceil(filteredDoctors.length / doctorsPerPage) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isBlurred && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                onClick={() => setIsBlurred(false)}
              >
                <p className="text-2xl font-bold text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg">
                  Click here to find nearby doctors
                </p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

      <div className="bg-[#152a63] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <Link to="/doctor/login" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <Stethoscope className="h-6 w-6 mb-1" />
                <span>Doctor Login</span>
              </div>
            </Link>
            <Link to="/login" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <Pill className="h-6 w-6 mb-1" />
                <span>Patient Login</span>
              </div>
            </Link>
            <Link to="/pricing" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <FileText className="h-6 w-6 mb-1" />
                <span>Pricing</span>
              </div>
            </Link>
            <a href="#" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-6 w-6 mb-1" />
                <span>Book test</span>
              </div>
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <Search className="h-6 w-6 mb-1" />
                <span>Read articles</span>
              </div>
            </a>
            <Link to="/auth" className="text-white hover:text-gray-200">
              <div className="flex flex-col items-center">
                <UserPlus className="h-6 w-6 mb-1" />
                <span>Get Started</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedDoctor.name}</h2>
            <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
            <p><strong>Address:</strong> {selectedDoctor.address}</p>
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}