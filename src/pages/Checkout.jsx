import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TruckIcon, QrCodeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api'

const MERCHANT_UPI_ID = "7492936645@ybl"
const MERCHANT_NAME = "TrendyTees"

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showQR, setShowQR] = useState(false)
  const [transactionId, setTransactionId] = useState('') // ← NEW: Transaction ID

  const [formData, setFormData] = useState({
    shipping: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    payment: {
      method: 'cod',
      upiId: ''
    }
  })

  const subtotal = getCartTotal()
  const tax = Math.round(subtotal * 0.18)
  const shipping = 0
  const total = subtotal + tax + shipping

  const updateShipping = (field, value) => {
    setFormData(prev => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value }
    }))
  }

  const updatePayment = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value }
    }))
    if (field === 'method' && value !== 'upi') {
      setShowQR(false)
      setTransactionId('') // Reset when switching
    }
  }

  // Generate Transaction ID + Show QR
  const generateTransactionAndQR = () => {
    const newTxnId = `TT${Date.now()}${Math.floor(Math.random() * 999)}`.slice(-12)
    setTransactionId(newTxnId)
    setShowQR(true)
    toast.success(`Transaction ID Generated: ${newTxnId}`)
  }

  const goToStep = (nextStep) => {
    if (nextStep === 2 && step === 1) {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
      const missing = required.filter(f => !formData.shipping[f].trim())
      if (missing.length > 0) {
        toast.error('Please fill all shipping details')
        return
      }
    }

    if (nextStep === 3 && step === 2) {
      if (formData.payment.method === 'upi' && !transactionId) {
        toast.error('Please generate QR code to get Transaction ID')
        return
      }
    }

    setStep(nextStep)
  }

  const handlePlaceOrder = async () => {
    if (loading) return
    setLoading(true)

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId || item._id || item.product?._id,
          quantity: item.customization?.quantity || item.quantity || 1,
          price: item.price || item.product?.price,
          customization: item.customization || {},
          tier: item.tier || "base"
        })),
        shippingAddress: {
          fullName: `${formData.shipping.firstName} ${formData.shipping.lastName}`.trim(),
          email: formData.shipping.email,
          phone: formData.shipping.phone,
          address: formData.shipping.address,
          city: formData.shipping.city,
          state: formData.shipping.state,
          pincode: formData.shipping.pincode,
          country: formData.shipping.country,
        },
        paymentMethod: formData.payment.method,
        paymentStatus: formData.payment.method === 'cod' ? 'pending' : 'paid',
        transactionId: formData.payment.method === 'upi' ? transactionId : null, // ← STORED HERE
        paymentDetails: {
          upiId: formData.payment.method === 'upi' ? (formData.payment.upiId.trim() || MERCHANT_UPI_ID) : null,
        },
        totalAmount: total
      }

      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      clearCart()
      toast.success(`Order placed! Transaction ID: ${transactionId || 'COD'}`)
      navigate('/profile?tab=orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = (item) => {
    return item.image || 
           item.product?.images?.[0]?.url || 
           item.product?.image || 
           item.images?.[0]?.url || 
           '/placeholder.jpg'
  }

  const generateQRCode = () => {
    const note = `TrendyTees Order - Txn: ${transactionId || 'Pending'}`
    const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(note)}`
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=560x560&bgcolor=FFFFFF&color=FF4500&margin=30&qzone=6`
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-2 border-orange-200 max-w-md w-full">
          <h2 className="text-4xl font-black text-orange-600 mb-6">Your Cart is Empty</h2>
          <button onClick={() => navigate('/products')} className="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl rounded-full shadow-xl">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Steps */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-10">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-2xl font-black transition-all
                ${step > i + 1 ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                  : step === i + 1 ? 'bg-white text-orange-600 ring-4 ring-orange-400 shadow-lg' 
                  : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`ml-3 text-sm sm:text-base font-bold ${step >= i + 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                {label}
              </span>
              {i < 2 && <div className={`hidden sm:block w-24 sm:w-32 h-1 mx-8 ${step > i + 1 ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-orange-100 p-6 sm:p-8">

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="space-y-8">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map(field => (
                      <div key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-bold text-orange-700 mb-2">
                          {field.replace('pincode', 'Pincode').toUpperCase()} *
                        </label>
                        {field === 'address' ? (
                          <textarea
                            rows={3}
                            value={formData.shipping[field]}
                            onChange={e => updateShipping(field, e.target.value)}
                            className="w-full bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
                            placeholder="House no, Street, Landmark..."
                          />
                        ) : (
                          <input
                            type={field === 'email' ? 'email' : field === 'phone' || field === 'pincode' ? 'tel' : 'text'}
                            value={formData.shipping[field]} 
                            onChange={e => updateShipping(field, e.target.value)}
                            className="w-full bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => goToStep(2)} className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl rounded-xl shadow-xl">
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="space-y-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Payment Method
                    </h2>
                    <button onClick={() => setStep(1)} className="text-orange-600 hover:underline font-bold text-base">
                      Edit Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className={`p-8 border-4 rounded-2xl cursor-pointer transition-all text-center ${formData.payment.method === 'cod' ? 'border-orange-500 bg-orange-50 shadow-xl ring-4 ring-orange-200' : 'border-gray-200 hover:border-orange-300'}`}>
                      <input type="radio" name="payment" value="cod" checked={formData.payment.method === 'cod'} onChange={e => updatePayment('method', e.target.value)} className="sr-only" />
                      <TruckIcon className="h-20 w-20 text-orange-600 mx-auto mb-5" />
                      <p className="text-2xl font-black text-gray-800">Cash on Delivery</p>
                      <p className="text-gray-600 mt-2">Pay when you receive</p>
                    </label>

                    <label className={`p-8 border-4 rounded-2xl cursor-pointer transition-all text-center ${formData.payment.method === 'upi' ? 'border-orange-500 bg-orange-50 shadow-xl ring-4 ring-orange-200' : 'border-gray-200 hover:border-orange-300'}`}>
                      <input type="radio" name="payment" value="upi" checked={formData.payment.method === 'upi'} onChange={e => updatePayment('method', e.target.value)} className="sr-only" />
                      <QrCodeIcon className="h-20 w-20 text-orange-600 mx-auto mb-5" />
                      <p className="text-2xl font-black text-gray-800">UPI Payment</p>
                      <p className="text-gray-600 mt-2">Instant • Secure</p>
                    </label>
                  </div>

                  {/* UPI Section */}
                  {formData.payment.method === 'upi' && (
                    <div className="text-center space-y-8">
                      {/* Transaction ID Display */}
                      {transactionId && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-8 rounded-2xl inline-block text-xl font-black shadow-xl">
                          Transaction ID: <span className="tracking-wider">{transactionId}</span>
                        </div>
                      )}

                      <button 
                        onClick={generateTransactionAndQR}
                        disabled={!!transactionId}
                        className={`px-12 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 text-white font-black text-xl rounded-2xl shadow-2xl flex items-center gap-4 mx-auto transition-all ${transactionId ? 'opacity-70' : ''}`}
                      >
                        <QrCodeIcon className="h-10 w-10" />
                        {transactionId ? 'QR Code Generated' : 'Generate QR Code & Transaction ID'}
                      </button>

                      {showQR && (
                        <div className="mt-10 bg-white rounded-3xl p-10 shadow-2xl border-4 border-orange-300 max-w-md mx-auto">
                          <h3 className="text-5xl font-black text-orange-600 mb-4">PAY ₹{total.toLocaleString()}</h3>
                          <p className="text-xl font-bold text-gray-800 mb-2">Transaction ID:</p>
                          <p className="text-2xl font-black text-orange-600 mb-8 tracking-wider">{transactionId}</p>
                          <p className="text-lg text-gray-600 mb-8">Scan with any UPI App • Amount Auto-filled</p>
                          <img src={generateQRCode()} alt="UPI QR" className="w-full max-w-xs mx-auto rounded-2xl shadow-xl" />
                          <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map(app => (
                              <span key={app} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg">
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => goToStep(3)} 
                    disabled={formData.payment.method === 'upi' && !transactionId}
                    className="w-full mt-12 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-black text-2xl rounded-xl shadow-2xl transition-all"
                  >
                    {formData.payment.method === 'upi' && !transactionId ? 'Generate Transaction ID First' : 'REVIEW ORDER'}
                  </button>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-10">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Final Review
                  </h2>

                  <div className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-300">
                    <p className="text-orange-700 font-bold text-lg mb-4">Delivery Address</p>
                    <p className="text-2xl font-bold text-gray-800">{formData.shipping.firstName} {formData.shipping.lastName}</p>
                    <p className="text-gray-700 mt-2">{formData.shipping.address}</p>
                    <p className="text-gray-700">{formData.shipping.city}, {formData.shipping.state} - {formData.shipping.pincode}</p>
                    <p className="text-gray-700 font-medium mt-2">{formData.shipping.phone}</p>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-300">
                    <p className="text-orange-700 font-bold text-lg mb-4">Payment Method</p>
                    <p className="text-2xl font-black text-gray-800">
                      {formData.payment.method === 'cod' ? 'Cash on Delivery' : `UPI Payment • Txn ID: ${transactionId}`}
                    </p>
                  </div>

                  <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-70 text-white font-black text-3xl rounded-2xl shadow-2xl">
                    {loading ? 'Placing Order...' : `PLACE ORDER – ₹${total.toLocaleString()}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-orange-100 p-6 sm:p-8 sticky top-4">
              <h3 className="text-2xl sm:text-3xl font-black text-orange-600 mb-6">Order Summary</h3>

              <div className="space-y-5 max-h-80 overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-orange-100 last:border-0">
                    <img
                      src={getProductImage(item)}
                      alt={item.name || item.product?.name}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-orange-200"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{item.name || item.product?.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.customization?.quantity || item.quantity || 1}</p>
                    </div>
                    <p className="font-bold text-orange-600 text-sm sm:text-base">
                      ₹{((item.price || item.product?.price) * (item.customization?.quantity || item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {transactionId && (
                <div className="my-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border-2 border-orange-400">
                  <p className="text-sm font-bold text-orange-700">Your Transaction ID</p>
                  <p className="text-xl font-black text-orange-600 tracking-wider">{transactionId}</p>
                </div>
              )}

              <div className="border-t-4 border-orange-300 mt-8 pt-6 space-y-4">
                <div className="flex justify-between text-base sm:text-lg font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-medium">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t-4 border-orange-400 pt-6">
                  <div className="flex justify-between text-3xl sm:text-4xl font-black text-orange-600">
                    <span>TOTAL</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center text-orange-600">
                  <ShieldCheckIcon className="h-8 w-8 mr-3" />
                  <span className="font-bold text-base">100% Secure • Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout