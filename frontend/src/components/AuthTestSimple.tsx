import React, { useState } from 'react';

const AuthTestSimple: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `[${timestamp}] ${type.toUpperCase()}: ${message}`]);
  };

  const runAuthTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🚀 Starting Authentication Test...', 'info');
    
    // Test 1: Backend connectivity
    addResult('📡 Testing backend connection...', 'info');
    try {
      const response = await fetch('http://localhost:5000/');
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Backend connected: ${data.message}`, 'success');
      } else {
        addResult('❌ Backend connection failed', 'error');
      }
    } catch (error) {
      addResult(`❌ Backend error: ${error}`, 'error');
    }
    
    // Test 2: Registration endpoint (without database)
    addResult('🔐 Testing registration endpoint...', 'info');
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass123',
          email: 'test@example.com'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult('✅ Registration endpoint working', 'success');
      } else {
        addResult(`⚠️ Registration endpoint responded: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Registration error: ${error}`, 'error');
    }
    
    // Test 3: Login endpoint (without database)
    addResult('🔑 Testing login endpoint...', 'info');
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass123'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult(`✅ Login successful! Token: ${data.access_token?.substring(0, 20)}...`, 'success');
      } else {
        addResult(`⚠️ Login endpoint responded: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Login error: ${error}`, 'error');
    }
    
    // Test 4: Protected endpoint
    addResult('🛡️ Testing protected endpoint...', 'info');
    try {
      const response = await fetch('http://localhost:5000/customers', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token-for-test'
        }
      });
      
      if (response.status === 401) {
        addResult('✅ Protected endpoint correctly rejects invalid token', 'success');
      } else if (response.ok) {
        addResult('⚠️ Protected endpoint accepted fake token (check JWT config)', 'error');
      } else {
        addResult(`⚠️ Protected endpoint status: ${response.status}`, 'info');
      }
    } catch (error) {
      addResult(`❌ Protected endpoint error: ${error}`, 'error');
    }
    
    // Test 5: Frontend routing
    addResult('🧭 Testing frontend routing...', 'info');
    if (window.location.pathname === '/auth-test-simple') {
      addResult('✅ Frontend routing working', 'success');
    } else {
      addResult('⚠️ Frontend routing may have issues', 'error');
    }
    
    addResult('🏁 Authentication test completed!', 'info');
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Authentication System Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="flex space-x-4">
            <button
              onClick={runAuthTest}
              disabled={isRunning}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? '🔄 Running Tests...' : '🚀 Run Authentication Test'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
            >
              🗑️ Clear Results
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>📝 This test will check:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Backend connectivity</li>
              <li>Registration endpoint</li>
              <li>Login endpoint</li>
              <li>Protected endpoint security</li>
              <li>Frontend routing</li>
            </ul>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">📋 Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => {
                let bgColor = 'bg-gray-800';
                if (result.includes('SUCCESS')) bgColor = 'bg-green-900';
                if (result.includes('ERROR')) bgColor = 'bg-red-900';
                if (result.includes('INFO')) bgColor = 'bg-blue-900';
                if (result.includes('WARNING')) bgColor = 'bg-yellow-900';
                
                return (
                  <div key={index} className={`${bgColor} rounded p-3 font-mono text-sm text-white`}>
                    {result}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🔧 Database Issues?</h3>
          <p className="text-yellow-700 text-sm">
            If tests show database connection errors, you need to:
          </p>
          <ol className="list-decimal list-inside mt-2 text-yellow-700 text-sm space-y-1">
            <li>Start MySQL service</li>
            <li>Run the setup script: <code className="bg-yellow-100 px-1 rounded">setup_mysql.sql</code></li>
            <li>Update .env file with correct MySQL password</li>
            <li>Restart the backend server</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTestSimple;
