import React from 'react';

interface ToastContainerProps {
  message: string | null;
  variant?: 'success' | 'error' | 'info';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  message,
  variant = 'success',
}) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-[#006b53]',
      iconColor: 'text-[#79f9d0]',
      border: 'border-[#79f9d0]/30',
      icon: 'check_circle',
    },
    error: {
      bg: 'bg-[#ba1a1a]',
      iconColor: 'text-[#ffdad6]',
      border: 'border-[#ffdad6]/30',
      icon: 'error',
    },
    info: {
      bg: 'bg-[#006c4a]',
      iconColor: 'text-[#85f8c4]',
      border: 'border-[#85f8c4]/30',
      icon: 'info',
    },
  }[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 right-6 z-50 ${styles.bg} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border ${styles.border} animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm`}
    >
      <span className={`material-symbols-outlined text-[20px] ${styles.iconColor} shrink-0`}>
        {styles.icon}
      </span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
