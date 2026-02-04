// 'use client';

// import React, { useEffect } from 'react';
// import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
// import { useNotificationStore } from './notification';

// const GlobalNotification = () => {
//   const { open, content, type, hideNotification } = useNotificationStore();

//   useEffect(() => {
//     if (open && type !== 'pending') {
//       const timer = setTimeout(() => {
//         hideNotification();
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [open, type, hideNotification]);

//   const handleClose = () => {
//     hideNotification();
//   };

//   const getIcon = () => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5" />;
//       case 'error':
//         return <AlertCircle className="w-5 h-5" />;
//       case 'warning':
//       case 'pending':
//         return <AlertTriangle className="w-5 h-5" />;
//       default:
//         return <Info className="w-5 h-5" />;
//     }
//   };

//   const getColorClasses = () => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-700 border-green-500 text-white';
//       case 'error':
//         return 'bg-red-600 border-red-500 text-white';
//       case 'warning':
//       case 'pending':
//         return 'bg-yellow-500 border-yellow-500 text-white';
//       default:
//         return 'bg-blue-500 border-blue-500 text-white';
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
//       <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg shadow-lg border min-w-80 max-w-96 ${getColorClasses()}`}>
//         {getIcon()}
//         <span className="flex-1 text-sm font-medium">{content}</span>
//         <button
//           onClick={handleClose}
//           className="p-1 hover:bg-white/20 rounded transition-colors"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GlobalNotification;