import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PasswordTest from './components/PasswordTest';
import AuthTestSimple from './components/AuthTestSimple';
import PasswordDemo from './components/PasswordDemo';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/password-test" element={<PasswordTest />} />
            <Route path="/auth-test-simple" element={<AuthTestSimple />} />
            <Route path="/password-demo" element={<PasswordDemo />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
