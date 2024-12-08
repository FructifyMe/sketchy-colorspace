import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Dashboard from './pages/dashboard';
import EstimateView from './pages/estimates/[id]';
import EstimateForm from './components/EstimateForm';
import AuthLayout from './components/AuthLayout';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<AuthLayout><Outlet /></AuthLayout>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/estimates/new" element={<EstimateForm />} />
            <Route path="/estimates/:id" element={<EstimateView />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;