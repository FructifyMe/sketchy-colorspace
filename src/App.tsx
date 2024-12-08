import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Dashboard from './pages/dashboard';
import EstimateView from './pages/estimates/[id]';
import EstimateForm from './components/EstimateForm';
import AuthLayout from './components/AuthLayout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estimates/new" element={<EstimateForm />} />
          <Route path="/estimates/:id" element={<EstimateView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;