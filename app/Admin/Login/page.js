'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const raw = await res.json();

      if (!res.ok) {
        // show the server’s message if it sent one
        throw new Error(raw.message || 'Login failed');
      }

      // your API returns: { message, tokens: { idToken, accessToken, refreshToken } }
      const { tokens } = raw;
      if (!tokens || !tokens.idToken) {
        throw new Error(raw.message || 'Invalid token response from server');
      }

      // store them under the keys you’ll read later
      sessionStorage.setItem('idToken', tokens.idToken);
      sessionStorage.setItem('accessToken', tokens.accessToken);

      // redirect into your admin dashboard
      router.push('/Admin/Dashboard');
    } catch (err) {
      console.error('Login error (client):', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">User ID</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 rounded ${
            isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
