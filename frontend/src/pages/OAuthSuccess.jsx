import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processOAuthResult = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const userType = searchParams.get('user_type');
      const redirectUrl = searchParams.get('redirect_url');

      if (accessToken && refreshToken && userType) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', userType);

        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('authStateChanged', {
          detail: { 
            isAuthenticated: true, 
            userType: userType,
            userName: 'OAuth User' // Will be updated when user data is fetched
          }
        }));

        // Redirect to the appropriate dashboard
        navigate(redirectUrl || (userType === 'admin' ? '/admin' : '/student-dashboard'), { 
          replace: true 
        });
      } else {
        // Missing required parameters - redirect to login with error
        navigate('/login?oauth_error=missing_params', { replace: true });
      }
    };

    processOAuthResult();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="text-center">
        <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In...</h2>
        <p className="text-gray-600">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
