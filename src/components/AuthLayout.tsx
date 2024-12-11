import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-white/30 z-50">
        <button 
          onClick={() => navigate('/')} 
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text"
        >
          FructiFlow
        </button>
      </nav>

      {/* Auth Content */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="relative rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;