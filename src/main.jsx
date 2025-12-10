import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/routes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./i18n"
const queryClient = new QueryClient()
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react"; // optional icon

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="
        fixed 
        bottom-5 left-5
        z-[9999]
        w-12 h-12
        rounded-full
        bg-indigo-600
        hover:bg-indigo-700
        text-white 
        flex items-center justify-center
        shadow-lg
        transition-all
        backdrop-blur-md
      "
    >
      <span className="text-sm font-semibold">
        {i18n.language === "en" ? "ব" : "EN"}
      </span>
    </button>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <ToastContainer 
      position="top-right" 
      autoClose={10000} 
      hideProgressBar={false} 
      newestOnTop={false} 
      closeOnClick 
      rtl={false} 
      pauseOnFocusLoss 
      draggable 
      pauseOnHover 
      style={{ zIndex: 9999 }}
    />
        <RouterProvider router={router} />
        <LanguageSwitch />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
