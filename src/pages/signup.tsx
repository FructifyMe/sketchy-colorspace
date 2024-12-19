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
      if (event === "SIGNED_IN" && session?.user?.id) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (!existingProfile) {
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
              ])
              .select()
              .single();
            
            if (profileError) {
              console.error('Error creating profile:', profileError);
              toast({
                variant: "destructive",
                title: "Error",
                description: "There was an error creating your profile. Please try again.",
              });
              // Sign out the user if profile creation fails
              await supabase.auth.signOut();
              return;
            }
          } catch (error) {
            console.error('Error in signup process:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
            });
            // Sign out the user if there's an error
            await supabase.auth.signOut();
            return;
          }
        }

        navigate("/dashboard");
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
              }
            }
          }
        }}
        providers={[]}
      />
    </AuthLayout>
  );
};

export default SignupPage;