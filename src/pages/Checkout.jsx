import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api'

// Checkout page updated to match the site's red/black premium theme
// Functionality is kept exactly the same as the original file you provided.

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', // card, upi, cod
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: ''
  })

  const subtotal = getCartTotal()
  const tax = Math.round(subtotal * 0.18)
  const shipping = 0 // Free shipping
  const total = subtotal + tax + shipping

  const handleShippingSubmit = (e) => {
    e.preventDefault()

    // Validate shipping info
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    const missing = required.filter(field => !shippingInfo[field])

    if (missing.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setStep(2)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()

    // Validate payment info based on method
    if (paymentInfo.method === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      const missing = required.filter(field => !paymentInfo[field])

      if (missing.length > 0) {
        toast.error('Please fill in all card details')
        return
      }
    } else if (paymentInfo.method === 'upi' && !paymentInfo.upiId) {
      toast.error('Please enter UPI ID')
      return
    }

    setStep(3)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)

    try {
      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          tier: item.tier || 'base',
          quantity: item.quantity,
          customization: item.customization || {},
          price: item.price
        })),
        shippingAddress: {
          fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          country: shippingInfo.country
        },
        paymentMethod: paymentInfo.method,
        specialInstructions: ''
      }

      // Send order to backend
      const response = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Clear cart and redirect
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/profile?tab=orders')

    } catch (error) {
      console.error('Order placement error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full px-6">
          <div className="bg-gradient-to-tr from-zinc-900/70 to-zinc-800/60 border border-red-900/30 rounded-2xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-extrabold text-white mb-4">No items to checkout</h2>
            <p className="text-zinc-300 mb-6">Your cart is empty. Add some items to proceed.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(255,0,0,0.14)]"
            >
              Continue Shopping
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-sm ${
                  step >= stepNumber ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' : 'bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}>
                  {stepNumber}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  step >= stepNumber ? 'text-red-300' : 'text-zinc-400'
                }`}>
                  {stepNumber === 1 ? 'Shipping' : stepNumber === 2 ? 'Payment' : 'Review'}
                </span>
                {stepNumber < 3 && (
                  <div className={`w-20 h-0.5 ml-4 ${step > stepNumber ? 'bg-red-600' : 'bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-red-900/20 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">First Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Last Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Email *</label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Address *</label>
                      <textarea
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">City *</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">State *</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Pincode *</label>
                        <input
                          type="text"
                          value={shippingInfo.pincode}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(255,0,0,0.14)] mt-2">
                      Continue to Payment
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-white">Payment Information</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Back to Shipping
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">Payment Method</label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-800/60">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentInfo.method === 'card'}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                            className="mr-3"
                          />
                          <CreditCardIcon className="h-5 w-5 mr-2 text-zinc-300" />
                          <span className="text-zinc-200">Credit/Debit Card</span>
                        </label>

                        <label className="flex items-center p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-800/60">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentInfo.method === 'upi'}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                            className="mr-3"
                          />
                          <span className="mr-2">💳</span>
                          <span className="text-zinc-200">UPI Payment</span>
                        </label>

                        <label className="flex items-center p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-800/60">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentInfo.method === 'cod'}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                            className="mr-3"
                          />
                          <TruckIcon className="h-5 w-5 mr-2 text-zinc-300" />
                          <span className="text-zinc-200">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    {/* Card Details */}
                    {paymentInfo.method === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-1">Card Number *</label>
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Expiry Date *</label>
                            <input
                              type="text"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">CVV *</label>
                            <input
                              type="text"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="123"
                              className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-1">Cardholder Name *</label>
                          <input
                            type="text"
                            value={paymentInfo.cardName}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* UPI Details */}
                    {paymentInfo.method === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">UPI ID *</label>
                        <input
                          type="text"
                          value={paymentInfo.upiId}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="yourname@upi"
                          className="w-full px-3 py-2 bg-zinc-800 border border-red-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    )}

                    <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(255,0,0,0.14)] mt-2">
                      Review Order
                    </button>
                  </form>
                </div>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-white">Review Your Order</h2>
                    <button
                      onClick={() => setStep(2)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Back to Payment
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
                      <h3 className="font-medium text-zinc-100 mb-2">Shipping Address</h3>
                      <div className="text-sm text-zinc-300">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
                      <h3 className="font-medium text-zinc-100 mb-2">Payment Method</h3>
                      <div className="text-sm text-zinc-300">
                        {paymentInfo.method === 'card' && (
                          <p>Credit/Debit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        )}
                        {paymentInfo.method === 'upi' && (
                          <p>UPI: {paymentInfo.upiId}</p>
                        )}
                        {paymentInfo.method === 'cod' && (
                          <p>Cash on Delivery</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-lg shadow-[0_12px_40px_rgba(255,0,0,0.16)] disabled:opacity-60"
                    >
                      {loading ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-red-900/20 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] sticky top-8">
              <h3 className="text-xl font-extrabold text-white mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=50&h=50&fit=crop'}
                      alt={item.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-zinc-100">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-300">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-extrabold text-zinc-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-sm text-zinc-400">
                <ShieldCheckIcon className="h-4 w-4 mr-2 text-zinc-400" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
