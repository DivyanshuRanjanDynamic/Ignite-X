import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { verifyEmail, resendVerification } from '../api/auth';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromQuery = searchParams.get('token');
  const emailFromQuery = searchParams.get('email') || '';

  const [status, setStatus] = useState({ loading: !!tokenFromQuery, success: null, message: '' });
  const [tokenInput, setTokenInput] = useState('');
  const [email, setEmail] = useState(emailFromQuery);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    async function run() {
      if (!tokenFromQuery) return;
      try {
        const res = await verifyEmail(tokenFromQuery);
        const message = res?.message || 'Email verified successfully.';
        setStatus({ loading: false, success: true, message });
        setTimeout(() => navigate('/verification-success'), 1000);
      } catch (err) {
        const msg = err?.response?.data?.error?.message || 'Invalid or expired verification token.';
        setStatus({ loading: false, success: false, message: msg });
      }
    }
    run();
  }, [tokenFromQuery, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 max-w-md w-full text-center">
        {status.loading ? (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        ) : status.success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Email Verified</h2>
            <p className="text-gray-600">{status.message}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-12 h-12 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
            {status.message && <p className="text-gray-600">{status.message}</p>}

            {/* Manual Code Entry */}
            <div className="w-full text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paste verification code</label>
              <textarea
                placeholder="Paste the verification code from your email here (it may look long)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl"
                rows={4}
              />
              <button
                onClick={async () => {
                  setStatus(s => ({ ...s, loading: true }));
                  try {
                    const res = await verifyEmail(tokenInput.trim());
                    const message = res?.message || 'Email verified successfully.';
                    setStatus({ loading: false, success: true, message });
                    setTimeout(() => navigate('/verification-success'), 1000);
                  } catch (err) {
                    const msg = err?.response?.data?.error?.message || 'Invalid or expired verification code.';
                    setStatus({ loading: false, success: false, message: msg });
                  }
                }}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-xl"
              >Verify</button>
            </div>

            {/* Resend */}
            <div className="w-full text-left mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
              <button
                disabled={resending || !email}
                onClick={async () => {
                  try {
                    setResending(true);
                    await resendVerification(email);
                    alert('Verification email sent. Please check your inbox.');
                  } finally {
                    setResending(false);
                  }
                }}
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-xl"
              >{resending ? 'Sending...' : 'Resend verification email'}</button>
            </div>

            <div className="flex gap-3 mt-4">
              <Link className="px-4 py-2 bg-blue-600 text-white rounded-xl" to="/login">Go to Login</Link>
              <Link className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700" to="/">
                <Home className="w-4 h-4 inline mr-1"/> Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default VerifyEmail;

