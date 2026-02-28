import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PasswordTest: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const testPasswordHash = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Step 1: Register user
      console.log('🔐 Testing password flow...');
      console.log('📝 Username:', username);
      console.log('🔑 Plain password:', password);
      
      await register(username, password, email);
      
      setTestResult({
        step: 'Registration Success',
        username: username,
        plainPassword: password,
        message: 'Password has been hashed and stored in database',
        note: 'The password is now encrypted using bcrypt and cannot be reversed'
      });

    } catch (error) {
      setTestResult({
        step: 'Registration Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        username: username,
        plainPassword: password
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🔑 Testing login with password...');
      console.log('📝 Username:', username);
      console.log('🔑 Password being sent:', password);
      
      await login(username, password);
      
      setTestResult({
        step: 'Login Success',
        username: username,
        passwordTested: password,
        message: 'Password verified successfully against hashed version',
        security: 'Password was compared using bcrypt.compare()'
      });

    } catch (error) {
      setTestResult({
        step: 'Login Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        username: username,
        attemptedPassword: password
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔐 Password Security Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="testuser123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (will be shown for testing):
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="mypassword123"
              />
              <p className="text-sm text-gray-500 mt-1">
                🔍 This password will be hashed using bcrypt before storing
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={testPasswordHash}
              disabled={isLoading || !username || !password}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : '🔐 Test Registration & Hashing'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={isLoading || !username || !password}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : '🔑 Test Login Verification'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`rounded-lg p-6 ${testResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <h3 className="text-lg font-semibold mb-4">
              {testResult.error ? '❌ Test Result' : '✅ Test Result'}
            </h3>
            
            <div className="space-y-2">
              <p><strong>Step:</strong> {testResult.step}</p>
              
              {testResult.username && (
                <p><strong>Username:</strong> {testResult.username}</p>
              )}
              
              {testResult.plainPassword && (
                <p><strong>Plain Password (what you typed):</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testResult.plainPassword}</span></p>
              )}
              
              {testResult.passwordTested && (
                <p><strong>Password Tested:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testResult.passwordTested}</span></p>
              )}
              
              {testResult.message && (
                <p><strong>Message:</strong> {testResult.message}</p>
              )}
              
              {testResult.security && (
                <p><strong>Security Note:</strong> {testResult.security}</p>
              )}
              
              {testResult.note && (
                <p><strong>Important:</strong> {testResult.note}</p>
              )}
              
              {testResult.error && (
                <p className="text-red-700"><strong>Error:</strong> {testResult.error}</p>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h4 className="font-semibold mb-2">🔍 How Password Security Works:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Plain password: <span className="font-mono">"{testResult.plainPassword || testResult.passwordTested || 'N/A'}"</span></li>
                <li>Hashed with bcrypt (one-way encryption)</li>
                <li>Stored in database as: <span className="font-mono text-xs">$2b$12$...randomsalt...hash</span></li>
                <li>During login: bcrypt.compare(plain_password, stored_hash)</li>
                <li>Original password can NEVER be retrieved from hash</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordTest;
