import { MessageCircle } from "lucide-react";

const WhatsappFloat = () => {
  return (
    <>
      {/* Floating WhatsApp Button - Visible on all pages */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <a
          href="https://wa.me/918888830696?text=Hi%20Shree%20Graphics!%20I%27m%20interested%20in%20your%20services%20%F0%9F%98%8A"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce-slow"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-9 w-9" />
        </a>

        {/* Tooltip on hover (desktop only) */}
        <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-xl">
            Chat with us on WhatsApp!
            <div className="absolute bottom-0 right-6 transform translate-y-full -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>

        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></span>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </>
  );
};

export default WhatsappFloat;