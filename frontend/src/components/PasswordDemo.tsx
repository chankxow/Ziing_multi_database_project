import React, { useState } from 'react';

const PasswordDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [testPassword, setTestPassword] = useState('mypassword123');
  const [hashedResult, setHashedResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const demonstratePasswordFlow = async () => {
    setIsProcessing(true);
    setShowDemo(true);
    
    // Simulate what happens when you register
    console.log('🔐 Password you type:', testPassword);
    console.log('📝 This gets sent to backend');
    console.log('🔒 Backend hashes it with bcrypt');
    
    // Simulate bcrypt hashing (simplified for demo)
    const mockHash = `$2b$12$${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setHashedResult(mockHash);
    
    console.log('🗄️ Hashed password stored in database:', mockHash);
    console.log('🚫 Original password is NEVER stored!');
    
    setTimeout(() => setIsProcessing(false), 1000);
  };

  const clearDemo = () => {
    setShowDemo(false);
    setHashedResult('');
    setTestPassword('mypassword123');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔐 Password Flow Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📝 Enter Password to See Flow</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (you can see this):
              </label>
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type any password here"
              />
              <p className="text-sm text-gray-500 mt-1">
                🔍 This is the password you type - you can see it clearly!
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={demonstratePasswordFlow}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? '🔄 Processing...' : '👁️ Show Password Flow'}
              </button>
              
              <button
                onClick={clearDemo}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>

        {showDemo && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">🔐 Step 1: Registration</h3>
              <div className="space-y-3 text-blue-700">
                <p><strong>👤 You type:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testPassword}</span></p>
                <p><strong>📡 Sent to backend:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testPassword}</span></p>
                <p><strong>🔒 Backend hashes with bcrypt:</strong></p>
                <p className="font-mono text-sm bg-white p-2 rounded border">{hashedResult}</p>
                <p><strong>🗄️ Stored in database:</strong> Only the hash above (60 characters)</p>
                <p><strong>🚫 Original password:</strong> <span className="text-red-600 font-semibold">NEVER stored!</span></p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🔑 Step 2: Login</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>👤 You type same password:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testPassword}</span></p>
                <p><strong>📡 Sent to backend:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{testPassword}</span></p>
                <p><strong>🔍 Backend checks:</strong> bcrypt.compare(your_password, stored_hash)</p>
                <p><strong>✅ Result:</strong> <span className="font-semibold">Password matches!</span></p>
                <p><strong>🎯 Important:</strong> Backend never sees your original password after registration!</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔍 Security Summary</h3>
              <div className="space-y-2 text-yellow-700">
                <p>✅ <strong>Plain password:</strong> Only visible when you type it</p>
                <p>✅ <strong>Hashed password:</strong> Stored securely in database</p>
                <p>✅ <strong>One-way encryption:</strong> Cannot reverse to get original</p>
                <p>✅ <strong>Unique each time:</strong> Same password = different hash</p>
                <p>✅ <strong>Database breach safe:</strong> Hackers only get hashes, not passwords</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ What Hackers See</h3>
              <div className="space-y-2 text-red-700">
                <p>If database is hacked, attackers see:</p>
                <p className="font-mono text-sm bg-white p-2 rounded border">{hashedResult}</p>
                <p><strong>🚫 They CANNOT get your original password!</strong></p>
                <p><strong>🔓 They would need to brute-force (very slow with bcrypt)</strong></p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">🎮 Try Real Authentication:</h3>
          <p className="text-gray-700 text-sm">
            Now test the real system at <a href="/auth-test-simple" className="text-blue-600 hover:underline">/auth-test-simple</a>
            or <a href="/password-test" className="text-blue-600 hover:underline">/password-test</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordDemo;
