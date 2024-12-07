import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { google_ngrok_url } from '../../utils/global'

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
  { id: 5, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
  { id: 5, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
  { id: 5, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
  { id: 5, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
  { id: 5, name: "Dr. Vivek Backender", specialty: "Orthopedic Surgeon", address: "202 Banjara Hills, Hyderabad, Telangana", latitude: 17.4126, longitude: 78.4387 },
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
  const [location, setLocation] = useState('')
  const [error, setError] = useState(null)
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const doctorsPerPage = 5

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

  const handleNearbySearch = () => {
    if (isBlurred) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          searchNearbyDoctors(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Failed to get your location. Please ensure location services are enabled.')
          setLoading(false)
        }
      )
    }
  }

  const handleLocationSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const geocodeResponse = await fetch(`https://api.openstreetmap.org/nominatim/search?format=json&q=${encodeURIComponent(location)}`)
      const geocodeData = await geocodeResponse.json()

      if (geocodeData.length === 0) {
        throw new Error('Location not found')
      }

      const { lat, lon } = geocodeData[0]
      setMapCenter([parseFloat(lat), parseFloat(lon)])
      await searchNearbyDoctors(lat, lon)
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
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <div className="relative">
        <div className={`mt-8 ${isBlurred ? 'filter blur-md' : ''}`}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="mb-4">
                <form onSubmit={handleLocationSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="flex-grow p-2 border rounded"
                    required
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Search
                  </button>
                </form>
              </div>
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
              <div className="mb-4">
                <input
                  type="text"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  placeholder="Filter by specialty"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto pr-4">
                {currentDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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
            onClick={handleNearbySearch}
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
  )
}

