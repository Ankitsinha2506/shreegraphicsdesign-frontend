import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react' // optional icon from lucide-react

export default function BackButton({ label = 'Back', className = '' }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-all ${className}`}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  )
}
