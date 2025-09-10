import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Shield, AlertTriangle, CheckCircle, Lock, Activity, MousePointer, Keyboard, Eye, Clock } from 'lucide-react';
import SecurityLoadingAnimation from './SecurityLoadingAnimation.jsx';

const BotProtection = ({ 
  onProtectionChange, 
  onBehaviorScore, 
  formData, 
  isVisible = true 
}) => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [behaviorScore, setBehaviorScore] = useState(0);
  const [protectionStatus, setProtectionStatus] = useState('pending'); // pending, protected, suspicious
  const [honeypotValue, setHoneypotValue] = useState('');
  
  const recaptchaRef = useRef(null);
  const formStartTime = useRef(Date.now());
  const keystrokes = useRef([]);
  const mouseMovements = useRef([]);
  const focusEvents = useRef([]);

  // reCAPTCHA site key (you'll need to get this from Google reCAPTCHA console)
  const RECAPTCHA_SITE_KEY = import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Test key

  // Behavior Analysis Functions
  const trackKeystroke = useCallback((event) => {
    keystrokes.current.push({
      timestamp: Date.now(),
      key: event.key,
      interval: keystrokes.current.length > 0 ? 
        Date.now() - keystrokes.current[keystrokes.current.length - 1].timestamp : 0
    });
  }, []);

  const trackMouseMovement = useCallback((event) => {
    mouseMovements.current.push({
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY
    });
    
    // Keep only last 50 movements to avoid memory issues
    if (mouseMovements.current.length > 50) {
      mouseMovements.current = mouseMovements.current.slice(-25);
    }
  }, []);

  const trackFocusEvent = useCallback((event) => {
    focusEvents.current.push({
      timestamp: Date.now(),
      type: event.type,
      target: event.target.name || event.target.id
    });
  }, []);

  // Calculate behavior score
  const calculateBehaviorScore = useCallback(() => {
    let score = 0;
    const now = Date.now();
    const formDuration = now - formStartTime.current;

    // 1. Form filling speed analysis (20 points)
    if (formDuration > 30000) { // More than 30 seconds
      score += 20;
    } else if (formDuration > 10000) { // More than 10 seconds
      score += 15;
    } else if (formDuration > 5000) { // More than 5 seconds
      score += 10;
    } else if (formDuration < 2000) { // Less than 2 seconds (suspicious)
      score -= 10;
    }

    // 2. Keystroke pattern analysis (20 points)
    if (keystrokes.current.length > 0) {
      const avgKeystrokeInterval = keystrokes.current.reduce((acc, curr) => acc + curr.interval, 0) / keystrokes.current.length;
      if (avgKeystrokeInterval > 100 && avgKeystrokeInterval < 2000) { // Human-like typing
        score += 20;
      } else if (avgKeystrokeInterval < 50) { // Too fast (bot-like)
        score -= 15;
      }
    }

    // 3. Mouse movement analysis (20 points)
    if (mouseMovements.current.length > 10) {
      score += 20;
    } else if (mouseMovements.current.length > 5) {
      score += 10;
    } else if (mouseMovements.current.length === 0) {
      score -= 10; // No mouse movement is suspicious
    }

    // 4. Focus events analysis (20 points)
    if (focusEvents.current.length > 3) {
      score += 20;
    } else if (focusEvents.current.length > 1) {
      score += 10;
    }

    // 5. Honeypot check (20 points)
    if (honeypotValue === '') {
      score += 20; // Good, honeypot not filled
    } else {
      score -= 50; // Bot likely filled honeypot
    }

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));
    return score;
  }, [honeypotValue]);

  // Update behavior score periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const score = calculateBehaviorScore();
      setBehaviorScore(score);
      onBehaviorScore && onBehaviorScore(score);

      // Update protection status
      if (score >= 70 && captchaToken) {
        setProtectionStatus('protected');
      } else if (score < 30 || honeypotValue !== '') {
        setProtectionStatus('suspicious');
      } else {
        setProtectionStatus('pending');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [calculateBehaviorScore, captchaToken, onBehaviorScore, honeypotValue]);

  // Add event listeners
  useEffect(() => {
    document.addEventListener('keydown', trackKeystroke);
    document.addEventListener('mousemove', trackMouseMovement);
    document.addEventListener('focus', trackFocusEvent, true);
    document.addEventListener('blur', trackFocusEvent, true);

    return () => {
      document.removeEventListener('keydown', trackKeystroke);
      document.removeEventListener('mousemove', trackMouseMovement);
      document.removeEventListener('focus', trackFocusEvent, true);
      document.removeEventListener('blur', trackFocusEvent, true);
    };
  }, [trackKeystroke, trackMouseMovement, trackFocusEvent]);

  // Notify parent about protection status changes
  useEffect(() => {
    onProtectionChange && onProtectionChange({
      isProtected: protectionStatus === 'protected',
      captchaToken,
      behaviorScore,
      honeypotValue,
      status: protectionStatus,
      analytics: {
        formDuration: Date.now() - formStartTime.current,
        keystrokes: keystrokes.current.length,
        mouseMovements: mouseMovements.current.length,
        focusEvents: focusEvents.current.length
      }
    });
  }, [protectionStatus, captchaToken, behaviorScore, honeypotValue, onProtectionChange]);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaToken(null);
  };

  const getStatusColor = () => {
    switch (protectionStatus) {
      case 'protected': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'suspicious': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const getSecurityBarColor = () => {
    if (behaviorScore >= 80) return 'bg-emerald-500';
    if (behaviorScore >= 60) return 'bg-blue-500';
    if (behaviorScore >= 40) return 'bg-yellow-500';
    if (behaviorScore >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreText = () => {
    if (behaviorScore >= 80) return { text: 'Excellent', color: 'text-emerald-600' };
    if (behaviorScore >= 60) return { text: 'Good', color: 'text-blue-600' };
    if (behaviorScore >= 40) return { text: 'Fair', color: 'text-yellow-600' };
    if (behaviorScore >= 20) return { text: 'Poor', color: 'text-orange-600' };
    return { text: 'Very Low', color: 'text-red-600' };
  };

  const getStatusIcon = () => {
    switch (protectionStatus) {
      case 'protected': return <CheckCircle className="w-5 h-5" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (protectionStatus) {
      case 'protected': return 'Security verification completed';
      case 'suspicious': return 'Unusual activity detected';
      default: return 'Analyzing your behavior patterns...';
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Honeypot Field (Hidden from users, visible to bots) */}
      <input
        type="text"
        name="website"
        value={honeypotValue}
        onChange={(e) => setHoneypotValue(e.target.value)}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          overflow: 'hidden'
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />


      {/* reCAPTCHA Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-gray-700 mb-2">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Human Verification</span>
          </div>
          <p className="text-sm text-gray-500">
            Complete this step to verify you're not a robot
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="transform hover:scale-105 transition-transform">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              onExpired={handleCaptchaExpired}
              theme="light"
              size="normal"
            />
          </div>
          
          {captchaToken ? (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Verification completed!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Click the checkbox above</span>
            </div>
          )}
           <button
              type="button"
              onClick={resetCaptcha}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Reset CAPTCHA
            </button>
        </div>
      </div>
    </div>
  );
};

export default BotProtection;
