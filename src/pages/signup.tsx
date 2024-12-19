import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import AuthLayout from "@/components/AuthLayout";

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_UP') {
        console.log('Signup successful:', session);
      }
      if (event === 'SIGNED_IN') {
        console.log('Sign in successful:', session);
        navigate("/dashboard");
      }
      if (event === 'USER_DELETED') {
        console.log('Signup failed:', session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUpError = async (error: Error) => {
    console.error('Signup error:', error);
    setError(error.message);
    
    // Try a direct signup to see the raw error
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
      });
      if (signUpError) {
        console.error('Direct signup error:', signUpError);
      } else {
        console.log('Direct signup success:', data);
      }
    } catch (e) {
      console.error('Direct signup exception:', e);
    }
  };

  return (
    <AuthLayout>
      {error && (
        <div className="text-red-500 text-sm mb-4">
          Error: {error}
        </div>
      )}
      <Auth 
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        view="sign_up"
        providers={[]}
        showLinks={false}
        onError={handleSignUpError}
      />
    </AuthLayout>
  );
};

export default SignupPage;