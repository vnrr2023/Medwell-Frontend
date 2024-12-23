import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Activity, FileText, DollarSign, Github, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-blue-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className='text-blue-600'>Med</span><span className='text-blue-800'>Well</span>
            </h3>
            <p className="text-sm">Empowering health, one patient at a time.</p>
            <div className="flex space-x-4">
              <a href="https://github.com/medwell" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com/company/medwell" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', link: '/', icon: Heart },
                { name: 'Dashboard', link: '/Dashboard', icon: Activity },
                { name: 'Pricing', link: '/pricing', icon: DollarSign },
                { name: 'About', link: '/about', icon: FileText },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="flex items-center hover:text-blue-600 transition-colors">
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:csgptmail@gmail.com" className="hover:text-blue-600 transition-colors">csgptmail@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+91 98923 62829" className="hover:text-blue-600 transition-colors">+91 98923 62829</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Stay updated with our latest health tips and news.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-200 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MedWell. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            "My health is Mine." - Rohit
          </p>
        </div>
      </div>
    </footer>
  )
}