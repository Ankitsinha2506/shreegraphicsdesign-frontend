import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'
import ScrollToTop from './ScrollToTop'
import { Suspense, lazy } from 'react' // ✅ Added for lazy loading
import 'react-medium-image-zoom/dist/styles.css';
import WhatsappFloat from './components/WhatsappFloat'


// ✅ Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Podcasts = lazy(() => import('./pages/Podcasts'))
const Contact = lazy(() => import('./pages/Contact'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./components/auth/Login'))
const Register = lazy(() => import('./components/auth/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Embroidery = lazy(() => import('./pages/Embroidery'))
const Clients = lazy(() => import('./pages/Clients'))
const CustomLogoDesign = lazy(() => import('./pages/CustomLogoDesign'))
const CustomLogoRequest = lazy(() => import('./pages/CustomLogoRequest'))
const CustomEmbroideryRequest = lazy(() => import('./pages/CustomEmbroideryRequest'))
const CustomDesignOrder = lazy(() => import('./pages/CustomDesignOrder'))

// Layout component to conditionally render navbar and footer
function Layout({ children }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        {children}
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">

        {children}
      </main>
      <Footer />
      {/* <WhatsappFloat /> */}
      <CartSidebar />
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            {/* ✅ Suspense added around Routes */}
            <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/proadcasts" element={<Podcasts />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/embroidery" element={<Embroidery />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/custom-logo-design" element={<CustomLogoDesign />} />
                <Route path="/custom-logo-request" element={<CustomLogoRequest />} />
                <Route path="/custom-embroidery-request" element={<CustomEmbroideryRequest />} />
                <Route path="/custom-design-order" element={<CustomDesignOrder />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App


// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
// import { Toaster } from 'react-hot-toast'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import Home from './pages/Home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Products from './pages/Products'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import Checkout from './pages/Checkout'
// import Login from './components/auth/Login'
// import Register from './components/auth/Register'
// import Profile from './pages/Profile'
// import AdminDashboard from './pages/AdminDashboard'
// import Embroidery from './pages/Embroidery'
// import Clients from './pages/Clients'
// import CustomLogoDesign from './pages/CustomLogoDesign'
// import CustomLogoRequest from './pages/CustomLogoRequest'
// import CustomEmbroideryRequest from './pages/CustomEmbroideryRequest'
// import CustomDesignOrder from './pages/CustomDesignOrder'
// import { AuthProvider } from './context/AuthContext'
// import { CartProvider } from './context/CartContext'
// import CartSidebar from './components/CartSidebar'
// import ScrollToTop from './ScrollToTop'




// // Layout component to conditionally render navbar and footer
// function Layout({ children }) {
//   const location = useLocation()
//   const isAdminRoute = location.pathname.startsWith('/admin')

//   if (isAdminRoute) {
//     return (
//       <div className="min-h-screen">
//         {children}
//         <Toaster position="top-right" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="flex-1">
//         {children}
//       </main>
//       <Footer />
//       <CartSidebar />
//       <Toaster position="top-right" />
//     </div>
//   )
// }

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <ScrollToTop />
//           <Layout>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/products/:id" element={<ProductDetail />} />
//               <Route path="/embroidery" element={<Embroidery />} />
//               <Route path="/clients" element={<Clients />} />
//               <Route path="/custom-logo-design" element={<CustomLogoDesign />} />
//               <Route path="/custom-logo-request" element={<CustomLogoRequest />} />
//               <Route path="/custom-embroidery-request" element={<CustomEmbroideryRequest />} />
//               <Route path="/custom-design-order" element={<CustomDesignOrder />} />
//               <Route path="/cart" element={<Cart />} />
//               <Route path="/checkout" element={<Checkout />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/profile" element={<Profile />} />
//               <Route path="/admin" element={<AdminDashboard />} />
//             </Routes>
//           </Layout>
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   )
// }

// export default App

