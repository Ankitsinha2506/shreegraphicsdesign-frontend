import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  XMarkIcon,
  CloudArrowUpIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Embroidery = () => {
  const [showDesignUpload, setShowDesignUpload] = useState(false)
  const [designImages, setDesignImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isSubmittingDesign, setIsSubmittingDesign] = useState(false)
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleDesignUpload = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size 10MB`)
        return false
      }
      return true
    })

    if (designImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 design images allowed')
      return
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDesignImages(prev => [
          ...prev,
          { id: Date.now() + Math.random(), file, preview: e.target.result, name: file.name }
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeDesignImage = (id) => {
    setDesignImages(prev => prev.filter(img => img.id !== id))
  }

  const openFileDialog = () => fileInputRef.current?.click()

  const handleDesignSubmission = async () => {
    if (!user) return toast.error('Please login to submit a design request')
    if (designImages.length === 0) return toast.error('Upload at least one design image')

    setIsSubmittingDesign(true)
    try {
      const formData = new FormData()
      designImages.forEach(img => formData.append('images', img.file))
      formData.append('businessName', user?.name || 'Individual Customer')
      formData.append('embroideryType', 'Logo Embroidery')
      formData.append('contactEmail', user?.email || '')

      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5003'
      const res = await axios.post(`${baseURL}/api/custom-embroidery-requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.data.success) {
        toast.success('Design submitted successfully!')
        setDesignImages([])
        setShowDesignUpload(false)
      } else throw new Error(res.data.message)
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit design')
    } finally {
      setIsSubmittingDesign(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-700 to-black rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)] mb-6">
            <span className="text-3xl">🧵</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Professional Embroidery
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Transform your apparel and accessories with premium embroidery work.
            From corporate logos to personalized designs, we deliver with precision and style.
          </p>
        </div>

        {/* Process */}
        <section className="bg-zinc-900/60 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.15)] p-10 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-red-500">Our Embroidery Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              ['🔄', 'Convert Your Logo', 'Professional digitization for embroidery machines.'],
              ['🧵', 'Choose Stitch Styles', 'Select optimal stitch types for durability and beauty.'],
              ['🎨', 'Match Brand Colors', 'We match threads to your brand identity.'],
              ['🧪', 'Test Sample', 'We ensure perfection before production.'],
              ['✨', 'Final Embroidery', 'Delivered with accuracy and elegance.']
            ].map(([emoji, title, desc], i) => (
              <div
                key={i}
                className="bg-black/70 border border-red-900/40 rounded-xl p-6 text-center hover:-translate-y-2 transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-red-400 text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-red-500">Our Embroidery Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['🧵', 'Logo Embroidery', 'Professional logo embroidery for apparel and uniforms.'],
              ['✂️', 'Custom Patches', 'Embroidered patches for branding and identity.'],
              ['🎨', 'Custom Designs', 'Unique embroidery concepts made to order.', '/custom-design-order'],
              ['⚡', 'Quick Turnaround', 'Fast delivery without compromising quality.']
            ].map(([emoji, title, desc, link], i) => {
              const card = (
                <div className="bg-zinc-900 border border-red-900/40 rounded-2xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:-translate-y-2 transition-all">
                  <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    {emoji}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              )
              return link ? (
                <Link key={i} to={link}>{card}</Link>
              ) : (
                <div key={i}>{card}</div>
              )
            })}
          </div>
        </section>

        {/* Upload Design Section */}
        <section className="bg-zinc-900/60 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.15)] border border-red-900/40 overflow-hidden">
          <div className="p-6 border-b border-red-900/30 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Upload Your Design</h3>
              <p className="text-sm text-gray-400">Share your design idea or logo for a custom quote.</p>
            </div>
            <button
              onClick={() => setShowDesignUpload(!showDesignUpload)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
            >
              <PhotoIcon className="h-4 w-4 inline mr-2" />
              {showDesignUpload ? 'Hide' : 'Upload'}
            </button>
          </div>

          {showDesignUpload && (
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-red-800/40 hover:border-red-600 hover:bg-red-900/10'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleDesignUpload}
                  className="hidden"
                />
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <p className="text-lg text-white font-medium mb-2">
                  {dragActive ? 'Drop your design here' : 'Drag & drop your design'}
                </p>
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-400 mt-4">Max 5 images | JPG, PNG, WebP | 10MB each</p>
              </div>

              {/* Image Preview */}
              {designImages.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {designImages.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-red-900/30">
                      <img
                        src={img.preview}
                        alt={img.name}
                        className="object-cover w-full h-40 group-hover:opacity-70 transition"
                      />
                      <button
                        onClick={() => removeDesignImage(img.id)}
                        className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <XMarkIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {designImages.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleDesignSubmission}
                    disabled={isSubmittingDesign}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmittingDesign ? 'Submitting...' : 'Submit Design Request'}
                  </button>
                  <button
                    onClick={() => {
                      setDesignImages([])
                      toast.success('Designs cleared')
                    }}
                    className="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 hover:text-white rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-700 to-black rounded-2xl p-10 text-center text-white shadow-[0_0_30px_rgba(255,0,0,0.3)]">
          <h2 className="text-3xl font-bold mb-4">Need Custom Embroidery?</h2>
          <p className="text-gray-300 mb-6">
            Have something special in mind? Let’s create your perfect embroidered design today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDesignUpload(true)}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Upload Design & Request Quote
            </button>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Embroidery
