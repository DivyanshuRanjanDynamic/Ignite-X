import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function TestAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout,
    register 
  } = useAuth();

  const handleTestLogin = async () => {
    const result = await login({
      email: 'test@example.com',
      password: 'test123',
      userType: 'student'
    });
    console.log('Login result:', result);
  };

  const handleTestRegister = async () => {
    const result = await register({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      // Add other required fields as needed
    });
    console.log('Register result:', result);
  };

  const handleTestLogout = async () => {
    const result = await logout();
    console.log('Logout result:', result);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Authentication Status</h2>
          <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
          <p>Error: {error || 'None'}</p>
        </div>

        <div className="space-x-4">
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            Test Login
          </button>
          
          <button
            onClick={handleTestRegister}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isLoading}
          >
            Test Register
          </button>
          
          <button
            onClick={handleTestLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isLoading || !isAuthenticated}
          >
            Test Logout
          </button>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold">Instructions:</h3>
          <p>1. First, register a test user using the register form</p>
          <p>2. Then try logging in with those credentials</p>
          <p>3. Check that protected routes work correctly</p>
          <p>4. Test logout functionality</p>
        </div>
      </div>
    </div>
  );
}

export default TestAuth;
