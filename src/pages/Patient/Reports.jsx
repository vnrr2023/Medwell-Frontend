import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, AlertCircle, ExternalLink, Download, Search } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import CombinedChat from '../Chatbots/CombinedChat'
import { useFetch } from '../components/useFetch'

const mockReports = [
  {
    id: 1,
    title: 'Annual Checkup',
    date: '28 Sept, 2024',
    collectionDate: '25 Sept, 2024',
    doctorName: 'Dr. Nishi',
    summary: 'Overall health is good. Calcium levels are slightly elevated.',
    elements: {
      calcium: { max: 10.2, min: 8.5, unit: 'mg/dL', value: 10.5 },
      hemoglobin: { max: 17.5, min: 13.5, unit: 'g/dL', value: 14.5 },
      redBloodCells: { max: 5.9, min: 4.5, unit: 'million/µL', value: 5.2 },
      whiteBloodCells: { max: 11000, min: 4500, unit: '/µL', value: 7500 },
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },
  {
    id: 2,
    title: 'Lipid Panel',
    date: '15 Oct, 2024',
    collectionDate: '12 Oct, 2024',
    doctorName: 'Dr. Rehan',
    summary: 'Cholesterol levels are within normal range.',
    elements: {
      totalCholesterol: { max: 200, min: 125, unit: 'mg/dL', value: 180 },
      ldlCholesterol: { max: 130, min: 0, unit: 'mg/dL', value: 100 },
      hdlCholesterol: { max: 60, min: 40, unit: 'mg/dL', value: 50 },
      triglycerides: { max: 150, min: 0, unit: 'mg/dL', value: 120 },
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },
  {
    id: 3,
    title: "Nutrient Deficiency Panel",
    date: "15 Nov, 2024",
    collectionDate: "12 Nov, 2024",
    doctorName: "Dr. Vivek",
    summary: "Several nutrient levels are below the normal range, indicating deficiencies in calcium, iron, and vitamin D.",
    elements: {
      calcium: { max: 10.5, min: 8.5, unit: "mg/dL", value: 7.9 },
      iron: { max: 170, min: 60, unit: "µg/dL", value: 50 },
      vitaminD: { max: 100, min: 30, unit: "ng/mL", value: 20 },
      magnesium: { max: 2.6, min: 1.8, unit: "mg/dL", value: -1 }
    },
    reportUrl: 'https://drive.google.com/file/d/1XvgQ7lpsXazqMiH7dRiRs4prRbyjTEy4/view?usp=sharing',
  },
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [reports, setReports] = useState([])
  const { fetchReports } = useFetch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [globalSearch, setGlobalSearch] = useState('')
  const [similarReports, setSimilarReports] = useState([])

  useEffect(() => {
    const loadReports = async () => {
      try {
        const reportsResult = await fetchReports()
        if (reportsResult && reportsResult.reports && Array.isArray(reportsResult.reports) && reportsResult.reports.length > 0) {
          const formattedReports = reportsResult.reports.map(report => ({
            id: report.id,
            title: report.report_file ? report.report_file.split("/")[3].split(".")[0] : 'Unknown Report Type',
            date: report.date_of_report || 'Date not available',
            collectionDate: report.date_of_collection || 'Collection date not available',
            doctorName: report.doctor_name || 'Doctor name not available',
            summary: report.summary || 'Summary not available',
            elements: report.reportdetail?.report_data || {},
            reportUrl: report.report_file || '',
            reportType: report.report_type || 'Unknown',
            submittedAt: report.submitted_at || 'Submission date not available',
          }))
          setReports([...formattedReports, ...mockReports])
        } else {
          console.log("No reports data received from API, using mock data")
          setReports(mockReports)
        }
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching reports:', err)
        setError(err.message)
        setReports(mockReports)
        setIsLoading(false)
      }
    }

    loadReports()
  }, [fetchReports])

  const handleReportClick = useCallback((report) => {
    setSelectedReport(report)
    const similar = reports.filter(r => 
      r.id !== report.id && 
      (r.title.toLowerCase().includes(report.title.toLowerCase()) ||
       r.doctorName === report.doctorName ||
       Object.keys(r.elements).some(key => report.elements.hasOwnProperty(key)))
    )
    setSimilarReports(similar)
  }, [reports])

  const handleBackClick = useCallback(() => {
    setSelectedReport(null)
    setSimilarReports([])
  }, [])

  const handleViewReport = useCallback(() => {
    if (selectedReport && selectedReport.reportUrl) {
      window.open(selectedReport.reportUrl, '_blank')
    }
  }, [selectedReport])

  const handleDownloadPDF = useCallback((report) => {
    const doc = new jsPDF()

    doc.rect(5, 5, 200, 287)

    doc.setFontSize(28)
    doc.setTextColor(128, 0, 128)
    doc.text("MEDWELL", 20, 25)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text("Empowering Health Through Innovation", 20, 32)

    doc.setDrawColor(128, 0, 128)
    doc.line(20, 35, 100, 35)

    doc.setFontSize(16)
    doc.setTextColor(128, 0, 128)
    doc.text("R E P O R T", 200, 40, null, 90)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const detailsX = 20
    const valuesX = 50
    doc.text("CID", detailsX, 45)
    doc.text(`: ${report.id}`, valuesX, 45)
    doc.text("Name", detailsX, 51)
    doc.text(`: ${report.title}`, valuesX, 51)
    doc.text("Age / Gender", detailsX, 57)
    doc.text(": Not Available", valuesX, 57)
    doc.text("Consulting Dr.", detailsX, 63)
    doc.text(`: ${report.doctorName}`, valuesX, 63)
    doc.text("Reg. Location", detailsX, 69)
    doc.text(": Not Available", valuesX, 69)

    const datesX = 140
    doc.text(`Collected : ${report.collectionDate}`, datesX, 63)
    doc.text(`Reported  : ${report.date}`, datesX, 69)

    doc.line(20, 75, 190, 75)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(report.title, 20, 85)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(report.summary, 170)
    doc.text(splitSummary, 20, 95)

    const tableData = Object.entries(report.elements).map(([name, data]) => {
      const isInRange = data.value >= data.min && data.value <= data.max
      return [
        name.replace(/([A-Z])/g, ' $1').trim(),
        `${data.value} ${data.unit}`,
        `${data.min} - ${data.max} ${data.unit}`,
        { content: isInRange ? 'In Range' : 'Out of Range', styles: { fillColor: isInRange ? [220, 252, 231] : [254, 226, 226], textColor: isInRange ? [22, 101, 52] : [185, 28, 28] } }
      ]
    })

    doc.autoTable({
      startY: 105,
      head: [['Test', 'Value', 'Normal Range', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [128, 0, 128], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 5, fontSize: 8 }
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text('MedWell AI © 2024 | Empowering Health Through Innovation', 20, doc.internal.pageSize.height - 10)
    }

    doc.save(`${report.title.replace(/\s+/g, '_')}_Report.pdf`)
  }, [])

  const handleGlobalSearchChange = useCallback((e) => {
    setGlobalSearch(e.target.value)
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter(report => 
      report.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      report.doctorName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      report.summary.toLowerCase().includes(globalSearch.toLowerCase()) ||
      Object.entries(report.elements).some(([key, value]) => 
        key.toLowerCase().includes(globalSearch.toLowerCase()) ||
        value.value.toString().includes(globalSearch.toLowerCase())
      )
    )
  }, [reports, globalSearch])

  const ReportCard = useCallback(({ report, onClick, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
      onClick={() => onClick(report)}
    >
      <h3 className="text-xl font-semibold mb-3">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.date}</p>
    </motion.div>
  ), [])

  const DetailedReport = useCallback(({ report }) => {
    const [localSearch, setLocalSearch] = useState('')
    const [localRangeFilter, setLocalRangeFilter] = useState('all')

    const handleLocalSearchChange = (e) => {
      setLocalSearch(e.target.value)
    }

    const handleLocalRangeFilterChange = (e) => {
      setLocalRangeFilter(e.target.value)
    }

    const filteredElements = Object.entries(report.elements).filter(([name, data]) => {
      const isValuePresent = data.value !== -1
      const isInRange = isValuePresent && data.value >= data.min && data.value <= data.max
      const matchesSearch = localSearch.toLowerCase() === '' ||
        name.toLowerCase().includes(localSearch.toLowerCase()) ||
        data.value.toString().includes(localSearch.toLowerCase())

      let matchesRangeFilter = true
      switch (localRangeFilter) {
        case 'inRange':
          matchesRangeFilter = isInRange
          break
        case 'outOfRange':
          matchesRangeFilter = !isInRange && isValuePresent
          break
        case 'notAvailable':
          matchesRangeFilter = !isValuePresent
          break
      }

      return matchesSearch && matchesRangeFilter
    })

    const sortedElements = filteredElements.sort(([, a], [, b]) => {
      if (a.value === -1 && b.value !== -1) return 1
      if (a.value !== -1 && b.value === -1) return -1
      return 0
    })

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          onClick={handleBackClick}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </motion.button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">{report.title}</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownloadPDF(report)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </motion.button>
            {report.reportUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewReport}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Report
              </motion.button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Report Date</p>
            <p className="font-semibold">{report.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Collection Date</p>
            <p className="font-semibold">{report.collectionDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Doctor</p>
            <p className="font-semibold">{report.doctorName}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-700">{report.summary}</p>
        </div>
        <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search test names or values"
              value={localSearch}
              onChange={handleLocalSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={localRangeFilter}
            onChange={handleLocalRangeFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="all">All Results</option>
            <option value="inRange">In Range</option>
            <option value="outOfRange">Out of Range</option>
            <option value="notAvailable">Not Available</option>
          </select>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {sortedElements.map(([name, data]) => {
            const isValuePresent = data.value !== -1
            const isInRange = isValuePresent && data.value >= data.min && data.value <= data.max
            return (
              <motion.div
                key={name}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg ${
                  isValuePresent
                    ? isInRange
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    : 'bg-gray-100'
                } cursor-pointer`}
              >
                <h4 className="font-semibold mb-2 capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</h4>
                {isValuePresent ? (
                  <>
                    <p className="text-lg">
                      {data.value} {data.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Range: {data.min} - {data.max} {data.unit}
                    </p>
                    {!isInRange && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Out of normal range
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Values not present
                  </p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
        {similarReports.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Similar Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarReports.map((similarReport, index) => (
                <ReportCard key={similarReport.id} report={similarReport} onClick={handleReportClick} index={index} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }, [handleBackClick, handleViewReport, handleDownloadPDF, handleReportClick, ReportCard])

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="text-center">Loading reports...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error loading reports: {error}</div>
      ) : (
        <AnimatePresence mode="wait">
          {selectedReport ? (
            <motion.div
              key="detailed-report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DetailedReport report={selectedReport} />
            </motion.div>
          ) : (
            <motion.div
              key="report-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-6 flex items-center">
                <FileText className="w-8 h-8 mr-2" />
                Your Reports
              </h1>
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search across all reports"
                  value={globalSearch}
                  onChange={handleGlobalSearchChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => (
                  <ReportCard key={report.id} report={report} onClick={handleReportClick} index={index} />
                ))}
              </div>
              {filteredReports.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No reports found matching your search.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <CombinedChat/>
    </div>
  )
}