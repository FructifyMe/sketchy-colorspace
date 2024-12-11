import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-white/30 z-50">
        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">FructiFlow</div>
        {!isLoggedIn && (
          <Button 
            variant="secondary" 
            onClick={handleSignIn}
            className="hover:bg-white/50 transition-all duration-300 text-sm sm:text-base"
          >
            Sign In
          </Button>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-14">
        <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-24 sm:pb-32">
          <div className="mx-auto max-w-2xl text-center animate-fade-in px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text leading-tight">
              Create Estimates<br className="hidden sm:block" />
              <span className="sm:inline">instantly in the field!</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0">
              Built by Fructify LLC, FructiFlow helps contractors, service providers, and small businesses 
              turn voice recordings into polished estimates instantly.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6 px-4">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto max-w-7xl mt-12 sm:mt-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-2xl border border-violet-100 bg-white/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 sm:block">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 mb-0 sm:mb-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold leading-7 sm:leading-8 text-gray-900">
                      Voice-to-Text Magic
                    </h3>
                    <p className="mt-2 sm:mt-4 text-sm text-gray-600">
                      Simply speak your estimate details into your device, and watch as they transform into a professional document
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl border border-violet-100 bg-white/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 sm:block">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 mb-0 sm:mb-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold leading-7 sm:leading-8 text-gray-900">
                      AI-Powered
                    </h3>
                    <p className="mt-2 sm:mt-4 text-sm text-gray-600">
                      Our advanced AI understands context and automatically structures your estimates with smart formatting
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl border border-violet-100 bg-white/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 sm:block">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 mb-0 sm:mb-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold leading-7 sm:leading-8 text-gray-900">
                      Professional PDFs
                    </h3>
                    <p className="mt-2 sm:mt-4 text-sm text-gray-600">
                      Generate beautiful, branded PDF estimates that you can instantly share with your clients
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="mx-auto max-w-7xl mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10 sm:mb-14 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text px-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-3 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-violet-100"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xl sm:text-2xl font-bold">1</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Record Your Voice</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-[250px] mx-auto">
                  Simply speak your estimate details into your device - materials, labor, costs, and any special notes.
                </p>
                <div className="absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100 md:block hidden"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xl sm:text-2xl font-bold">2</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">AI Processing</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-[250px] mx-auto">
                  Our AI instantly converts your voice into structured text and organizes it into a professional estimate format.
                </p>
                <div className="absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100 md:block hidden"></div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xl sm:text-2xl font-bold">3</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Share & Send</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-[250px] mx-auto">
                  Review, edit if needed, and share your professionally formatted PDF estimate with your clients.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;