import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_UP') {
        console.log("User signed up:", session?.user);
        // Check if profile was created
        if (session?.user?.id) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log("Profile check after signup:", { profile, error });
          
          if (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "There was an error creating your profile. Please try again.",
            });
            return;
          }
        }
      }

      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

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
        view="sign_up"
        localization={{
          variables: {
            sign_up: {
              email_label: "Email address",
              password_label: "Create a password",
              button_label: "Create account",
              loading_button_label: "Creating your account...",
              social_provider_text: "Sign up with {{provider}}",
              link_text: "Don't have an account? Sign up",
            },
          },
        }}
      />
    </AuthLayout>
  );
};

export default SignupPage;