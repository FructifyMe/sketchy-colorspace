import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F2FCE2] to-[#FEF7CD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-800">FructiFlow</h1>
          <p className="mt-2 text-emerald-600">Transform Your Field Estimates Into Success</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;