import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <button
            onClick={() => navigate("/signin")}
            className="font-medium text-primary hover:text-primary/80"
          >
            sign in to your account
          </button>
        </p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#059669',
                brandAccent: '#10B981',
              },
            },
          },
        }}
        theme="light"
        providers={[]}
        redirectTo={`${window.location.origin}/dashboard`}
        onError={(error) => {
          console.error("Auth error:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message,
          });
        }}
      />
    </AuthLayout>
  );
};

export default SignupPage;