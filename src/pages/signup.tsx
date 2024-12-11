import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state changed:', event, session);
      if (event === "SIGNED_IN") {
        if (session?.user?.id) {
          try {
            // Create a profile for the new user
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  email: session.user.email,
                  created_at: new Date().toISOString()
                }
              ]);
            
            if (profileError) {
              console.error('Error creating profile:', profileError);
              toast({
                variant: "destructive",
                title: "Error",
                description: "There was an error creating your profile. Please try again.",
              });
              return;
            }

            navigate("/dashboard");
          } catch (error) {
            console.error('Error in signup process:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="font-medium text-violet-600 hover:text-violet-500 transition-colors"
          >
            Sign in
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
                brand: 'rgb(124 58 237)',           // violet-600
                brandAccent: 'rgb(99 102 241)',     // indigo-500
                brandButtonText: 'white',
                defaultButtonBackground: 'white',
                defaultButtonBackgroundHover: 'rgb(243 244 246)',  // gray-100
                defaultButtonBorder: 'rgb(229 231 235)',          // gray-200
                defaultButtonText: 'rgb(17 24 39)',              // gray-900
                dividerBackground: 'rgb(229 231 235)',           // gray-200
                inputBackground: 'white',
                inputBorder: 'rgb(229 231 235)',                // gray-200
                inputBorderHover: 'rgb(156 163 175)',          // gray-400
                inputBorderFocus: 'rgb(124 58 237)',           // violet-600
                inputText: 'rgb(17 24 39)',                    // gray-900
                inputPlaceholder: 'rgb(156 163 175)',          // gray-400
              },
              space: {
                buttonPadding: '0.75rem 1rem',
                inputPadding: '0.75rem 1rem',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '0.5rem',
                buttonBorderRadius: '0.5rem',
                inputBorderRadius: '0.5rem',
              },
              fontSizes: {
                baseButtonSize: '0.875rem',
                baseInputSize: '0.875rem',
              },
            },
          },
          className: {
            button: 'font-medium transition-all duration-200',
            container: 'space-y-4',
            divider: 'my-6',
            label: 'text-sm font-medium text-gray-700',
            input: 'transition-all duration-200',
            loader: 'border-violet-600',
          }
        }}
        theme="custom"
        providers={[]}
        redirectTo={window.location.origin + "/dashboard"}
        view="sign_up"
        magicLink={false}
        showLinks={false}
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