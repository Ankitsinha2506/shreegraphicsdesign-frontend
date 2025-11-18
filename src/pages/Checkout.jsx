import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showQR, setShowQR] = useState(false)

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
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
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
      setShowQR(false) // Reset QR when switching away from UPI
    }
  }

  const goToStep = (nextStep) => {
    if (nextStep === 2 && step === 1) {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
      const missing = required.filter(f => !formData.shipping[f].trim())
      if (missing.length > 0) {
        toast.error('Please fill all shipping fields')
        return
      }
    }

    if (nextStep === 3 && step === 2) {
      if (formData.payment.method === 'card') {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
        const missing = required.filter(f => !formData.payment[f].trim())
        if (missing.length > 0) {
          toast.error('Please complete card details')
          return
        }
      }
      if (formData.payment.method === 'upi' && !formData.payment.upiId.trim() && !showQR) {
        toast.error('Please enter UPI ID or generate QR code')
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
          price: item.price,
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
        paymentMethod: formData.payment.method.toLowerCase(),
        paymentStatus: formData.payment.method === 'cod' ? 'pending' : 'paid',
        paymentId: formData.payment.method === 'cod' ? null : `TXN-${Date.now()}`,
        paymentDetails: {
          cardLast4: formData.payment.method === 'card'
            ? formData.payment.cardNumber.replace(/\s/g, '').slice(-4)
            : null,
          upiId: formData.payment.method === 'upi'
            ? formData.payment.upiId.trim().toLowerCase()
            : null,
        },
        totalAmount: total
      }

      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      clearCart()
      toast.success('Order placed successfully!')
      navigate('/profile?tab=orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-12 text-center max-w-md">
          <h2 className="text-3xl font-black text-white mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  // UPI QR Code URL (Free & Reliable)
  // YOUR REAL UPI ID → 7492936645@ybl (PhonePe)
const upiQRUrl = `https://quickchart.io/qr?text=upi://pay?pa=7492936645@ybl&pn=TrendyTees&am=${total}&cu=INR&tn=Order+Payment+₹${total}&size=420&margin=20`;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Progress Bar */}
        <div className="flex justify-center items-center gap-8 mb-12">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${step > i + 1 ? 'bg-red-600' : step === i + 1 ? 'bg-gradient-to-r from-red-600 to-red-800 ring-4 ring-red-600/50' : 'bg-zinc-800 text-zinc-500'}`}>
                {i + 1}
              </div>
              <span className={`ml-3 text-sm font-medium ${step >= i + 1 ? 'text-red-400' : 'text-zinc-600'}`}>
                {label}
              </span>
              {i < 2 && <div className={`w-24 h-1 mx-4 ${step > i + 1 ? 'bg-red-600' : 'bg-zinc-800'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/80 border border-red-900/40 rounded-2xl p-8 shadow-2xl">

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-red-500">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map(field => (
                      <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                          {field.replace('pincode', 'Pincode')} <span className="text-red-500">*</span>
                        </label>
                        {field === 'address' ? (
                          <textarea
                            value={formData.shipping[field]}
                            onChange={(e) => updateShipping(field, e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-red-900/50 rounded-xl px-5 py-3 focus:border-red-600 outline-none transition"
                            required
                          />
                        ) : (
                          <input
                            type={field === 'email' ? 'email' : field === 'phone' || field === 'pincode' ? 'tel' : 'text'}
                            value={formData.shipping[field]}
                            onChange={(e) => updateShipping(field, e.target.value)}
                            className="w-full bg-black/50 border border-red-900/50 rounded-xl px-5 py-3 focus:border-red-600 outline-none transition"
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => goToStep(2)}
                    className="w-full mt-8 py-5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black text-xl rounded-xl shadow-xl transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-red-500">Payment Method</h2>
                    <button onClick={() => setStep(1)} className="text-red-400 hover:underline">
                      ← Edit Shipping
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { value: 'cod', label: 'Cash on Delivery', icon: TruckIcon },
                      { value: 'upi', label: 'UPI (Google Pay, PhonePe, etc.)', icon: null },
                      { value: 'card', label: 'Credit / Debit Card', icon: CreditCardIcon },
                    ].map(({ value, label, icon: IconComponent }) => (
                      <label
                        key={value}
                        className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.payment.method === value
                          ? 'border-red-600 bg-red-900/20'
                          : 'border-zinc-800 hover:border-red-900/50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={value}
                          checked={formData.payment.method === value}
                          onChange={(e) => updatePayment('method', e.target.value)}
                          className="sr-only"
                        />
                        {value === 'upi' ? (
                          <span className="text-4xl mr-5 font-bold text-red-500">UPI</span>
                        ) : (
                          IconComponent && <IconComponent className="h-9 w-9 mr-5 text-red-500" />
                        )}
                        <span className="text-lg font-semibold">{label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.payment.method === 'card' && (
                    <div className="space-y-5 mt-8 p-6 bg-black/40 rounded-2xl border border-red-900/30">
                      <input type="text" placeholder="Card Number • 1234 5678 9012 3456" value={formData.payment.cardNumber} onChange={(e) => updatePayment('cardNumber', e.target.value)} className="w-full bg-black/60 border border-red-900/50 rounded-xl px-5 py-4 focus:border-red-500 outline-none transition" />
                      <div className="grid grid-cols-2 gap-5">
                        <input type="text" placeholder="MM/YY" value={formData.payment.expiryDate} onChange={(e) => updatePayment('expiryDate', e.target.value)} className="bg-black/60 border border-red-900/50 rounded-xl px-5 py-4 focus:border-red-500 outline-none" />
                        <input type="text" placeholder="CVV" value={formData.payment.cvv} onChange={(e) => updatePayment('cvv', e.target.value)} className="bg-black/60 border border-red-900/50 rounded-xl px-5 py-4 focus:border-red-500 outline-none" />
                      </div>
                      <input type="text" placeholder="Name on Card" value={formData.payment.cardName} onChange={(e) => updatePayment('cardName', e.target.value)} className="w-full bg-black/60 border border-red-900/50 rounded-xl px-5 py-4 focus:border-red-500 outline-none" />
                    </div>
                  )}

                  {/* UPI with QR Code */}
                  {formData.payment.method === 'upi' && (
                    <div className="mt-8 space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-red-500 mb-3">
                          Enter UPI ID (Optional if scanning QR)
                        </label>
                        <input
                          type="text"
                          placeholder="example@oksbi • example@ybl • example@paytm"
                          value={formData.payment.upiId}
                          onChange={(e) => updatePayment('upiId', e.target.value)}
                          className="w-full bg-black/50 border border-red-900/50 rounded-xl px-6 py-5 text-lg focus:border-red-600 outline-none transition placeholder-gray-500"
                        />
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => setShowQR(true)}
                          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg"
                        >
                          Generate QR Code for Payment
                        </button>
                      </div>

                      {showQR && (
                        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm mx-auto text-center">
                          <p className="text-4xl font-black text-red-600 mb-2">₹{total.toLocaleString()}</p>
                          <p className="text-gray-700 font-medium mb-6">Scan with any UPI App</p>
                          <img
                            src={upiQRUrl}
                            alt="UPI QR Code"
                            className="mx-auto rounded-xl border-4 border-gray-200"
                          />
                          <div className="mt-6 flex justify-center gap-4 flex-wrap">
                            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                              <span key={app} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
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
                    className="w-full mt-10 py-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black text-xl uppercase tracking-wider rounded-2xl shadow-2xl transition-all duration-300"
                  >
                    Review Order
                  </button>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-red-500">Order Review</h2>
                    <button onClick={() => setStep(2)} className="text-red-400 hover:underline">← Edit Payment</button>
                  </div>

                  <div className="bg-zinc-900/60 border border-red-900/30 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="font-bold text-red-400">Shipping To</h3>
                      <p className="text-gray-300 mt-2">{formData.shipping.firstName} {formData.shipping.lastName}<br />
                        {formData.shipping.address}, {formData.shipping.city}, {formData.shipping.state} - {formData.shipping.pincode}<br />
                        {formData.shipping.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-red-400">Payment Method</h3>
                      <p className="text-gray-300 mt-2 capitalize">
                        {formData.payment.method === 'cod' ? 'Cash on Delivery' :
                         formData.payment.method === 'upi' ? `UPI${formData.payment.upiId ? ` (${formData.payment.upiId})` : ' (QR Code)'}` :
                         `Card ending **** ${formData.payment.cardNumber.slice(-4)}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 disabled:from-zinc-800 text-white font-black text-2xl rounded-2xl shadow-2xl transition"
                  >
                    {loading ? 'Placing Order...' : `Place Order – ₹${total.toLocaleString()}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/80 border border-red-900/40 rounded-2xl p-8 sticky top-6 shadow-2xl">
              <h3 className="text-2xl font-black mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <img src={item.image || item.images?.[0]?.url || item.product?.images?.[0]?.url} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-red-900/30" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.name || item.product?.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.customization?.quantity || item.quantity || 1}</p>
                      {item.customization?.color && <p className="text-xs text-red-400">Color: {item.customization.color}</p>}
                      {item.customization?.size && <p className="text-xs text-red-400">Size: {item.customization.size}</p>}
                    </div>
                    <p className="font-bold">₹{((item.price || item.product?.price) * (item.customization?.quantity || item.quantity || 1)).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-red-900/40 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-lg"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-lg"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString()}</span></div>
                <div className="flex justify-between text-lg"><span>Shipping</span><span className="text-green-500">FREE</span></div>
                <div className="border-t border-red-900/60 pt-4 flex justify-between text-2xl font-black text-red-500">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Secure & Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout