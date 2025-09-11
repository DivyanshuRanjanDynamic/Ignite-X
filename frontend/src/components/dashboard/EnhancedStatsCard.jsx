import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Info, ArrowRight, 
  Sparkles, Target, Award, Zap, MoreHorizontal,
  RefreshCw, ExternalLink, Calendar, Clock
} from 'lucide-react';

const EnhancedStatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  description,
  trend = [],
  actionButton,
  additionalInfo = [],
  isLoading = false,
  gradient = 'from-blue-500 to-purple-600',
  size = 'medium' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate value counting up
  useEffect(() => {
    if (typeof value === 'number') {
      let startTime = null;
      const duration = 1500;
      const startValue = 0;
      const endValue = value;

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

        setAnimatedValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const iconSizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTrendIcon = (type) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <div className="w-3 h-3 bg-current rounded-full" />;
    }
  };

  // Mini trend chart component
  const MiniTrendChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end space-x-1 h-8 mt-2">
        {data.map((point, index) => {
          const height = ((point - min) / range) * 100;
          return (
            <motion.div
              key={index}
              className="bg-current opacity-30 rounded-sm flex-1"
              style={{ height: `${Math.max(height, 10)}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 10)}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      className={`
        relative bg-white/80 backdrop-blur-lg border border-white/20 
        rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500
        ${sizeClasses[size]} group overflow-hidden
      `}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
      
      {/* Sparkle Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-2 right-2 text-yellow-400"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`${iconSizeClasses[size]} bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1 max-w-32 truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* More Options */}
        <motion.button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg"
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>

      {/* Value and Change */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-3">
          <motion.div 
            className="text-3xl font-bold text-gray-900"
            key={animatedValue}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-lg text-gray-400">Loading...</span>
              </div>
            ) : (
              typeof value === 'number' ? animatedValue : value
            )}
          </motion.div>

          {change && (
            <motion.div
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs font-medium ${getChangeColor(changeType)}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {getTrendIcon(changeType)}
              <span>{change}</span>
            </motion.div>
          )}
        </div>

        {/* Trend Chart */}
        {trend && trend.length > 0 && (
          <div className="text-blue-500">
            <MiniTrendChart data={trend} />
          </div>
        )}
      </div>

      {/* Additional Info */}
      <AnimatePresence>
        {showDetails && additionalInfo.length > 0 && (
          <motion.div
            className="mb-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {additionalInfo.map((info, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-gray-600 flex items-center space-x-2">
                  {info.icon}
                  <span>{info.label}</span>
                </span>
                <span className="font-semibold text-gray-900">{info.value}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      {actionButton && (
        <motion.button
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={actionButton.onClick}
        >
          <span>{actionButton.label}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}

      {/* Progress Ring (for percentage values) */}
      {typeof value === 'number' && value <= 100 && (
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-current text-gray-300"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="stroke-current text-blue-500"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${animatedValue} 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
        </div>
      )}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-5 blur-xl`} />
      </div>
    </motion.div>
  );
};

// Pre-configured card variants for common use cases
export const ProfileCompletionCard = ({ completion }) => (
  <EnhancedStatsCard
    title="Profile Completion"
    value={completion}
    change="+5% this week"
    changeType="positive"
    icon={<Target className="w-5 h-5" />}
    description="Complete to improve matches"
    gradient="from-green-500 to-emerald-600"
    additionalInfo={[
      { 
        icon: <Clock className="w-4 h-4" />, 
        label: "Last updated", 
        value: "2 hours ago" 
      },
      { 
        icon: <Award className="w-4 h-4" />, 
        label: "Achievement", 
        value: "85%+" 
      }
    ]}
    actionButton={{
      label: "Complete Profile",
      onClick: () => console.log("Navigate to profile")
    }}
  />
);

export const AIMatchesCard = ({ matches }) => (
  <EnhancedStatsCard
    title="AI Matches"
    value={matches}
    change="+2 new matches"
    changeType="positive"
    icon={<Zap className="w-5 h-5" />}
    description="Personalized recommendations"
    gradient="from-purple-500 to-pink-600"
    trend={[12, 15, 18, 22, 19, 25, matches]}
    additionalInfo={[
      { 
        icon: <Calendar className="w-4 h-4" />, 
        label: "This month", 
        value: `${matches * 2} total` 
      },
      { 
        icon: <TrendingUp className="w-4 h-4" />, 
        label: "Match rate", 
        value: "94%" 
      }
    ]}
    actionButton={{
      label: "View Matches",
      onClick: () => console.log("Navigate to recommendations")
    }}
  />
);

export const ApplicationsCard = ({ applications }) => (
  <EnhancedStatsCard
    title="Active Applications"
    value={applications}
    change="2 pending review"
    changeType="neutral"
    icon={<Award className="w-5 h-5" />}
    description="Track your progress"
    gradient="from-blue-500 to-cyan-600"
    additionalInfo={[
      { 
        icon: <Clock className="w-4 h-4" />, 
        label: "Response time", 
        value: "3-5 days" 
      },
      { 
        icon: <TrendingUp className="w-4 h-4" />, 
        label: "Success rate", 
        value: "67%" 
      }
    ]}
    actionButton={{
      label: "View Applications",
      onClick: () => console.log("Navigate to applications")
    }}
  />
);

export default EnhancedStatsCard;
