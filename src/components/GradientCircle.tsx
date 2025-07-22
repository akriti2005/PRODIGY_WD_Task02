import React from 'react';

interface GradientCircleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'half-top' | 'half-bottom' | 'half-left' | 'half-right';
  gradient?: 'blue-purple' | 'pink-orange' | 'green-blue' | 'purple-pink' | 'orange-red' | 'rainbow';
  className?: string;
  animate?: boolean;
}

const GradientCircle: React.FC<GradientCircleProps> = ({
  size = 'md',
  variant = 'full',
  gradient = 'blue-purple',
  className = '',
  animate = false
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
    '2xl': 'w-64 h-64'
  };

  const gradientClasses = {
    'blue-purple': 'from-blue-500 via-purple-500 to-indigo-600',
    'pink-orange': 'from-pink-500 via-rose-500 to-orange-500',
    'green-blue': 'from-emerald-500 via-teal-500 to-blue-500',
    'purple-pink': 'from-purple-600 via-pink-500 to-rose-400',
    'orange-red': 'from-orange-500 via-red-500 to-pink-600',
    'rainbow': 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
  };

  const getShapeClasses = () => {
    switch (variant) {
      case 'half-top':
        return 'rounded-t-full';
      case 'half-bottom':
        return 'rounded-b-full';
      case 'half-left':
        return 'rounded-l-full';
      case 'half-right':
        return 'rounded-r-full';
      default:
        return 'rounded-full';
    }
  };

  const getClipPath = () => {
    switch (variant) {
      case 'half-top':
        return { clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' };
      case 'half-bottom':
        return { clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' };
      case 'half-left':
        return { clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' };
      case 'half-right':
        return { clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' };
      default:
        return {};
    }
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br ${gradientClasses[gradient]}
        ${getShapeClasses()}
        ${animate ? 'animate-spin' : ''}
        shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110
        ${className}
      `}
      style={getClipPath()}
    />
  );
};

export default GradientCircle;