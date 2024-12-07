import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const isLoggedIn = false; // This should be replaced with actual auth state when implemented
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="absolute top-0 w-full px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">EstimateFlow</div>
        {!isLoggedIn && (
          <Button 
            variant="secondary" 
            onClick={handleSignIn}
            className="hover:bg-gray-100"
          >
            Sign In
          </Button>
        )}
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative px-6 lg:px-8 pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Professional Estimates,<br />
              Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your field estimates into polished invoices instantly. 
              Built for contractors, service providers, and small businesses who value efficiency.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="px-8"
              >
                Get Started
              </Button>
              <Link 
                to="/templates" 
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
              >
                View Templates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto max-w-7xl mt-20 px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Industry Templates
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  Pre-built templates for every trade and service, fully customizable to your needs
                </p>
              </div>
              <div className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Field-Ready
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  Create professional estimates on-site, right from your mobile device
                </p>
              </div>
              <div className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Instant Invoicing
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  Convert approved estimates into invoices with a single click
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