import React, { useEffect, useState } from 'react';

/**
 * Modal Component - Hiển thị thông báo
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Hàm đóng modal
 * @param {string} type - Loại modal: 'success', 'error', 'warning', 'info'
 * @param {string} title - Tiêu đề modal
 * @param {string} message - Nội dung thông báo
 * @param {string} confirmText - Text nút xác nhận (mặc định: 'OK')
 * @param {string} cancelText - Text nút hủy (optional)
 * @param {function} onConfirm - Hàm xử lý khi nhấn confirm
 * @param {function} onCancel - Hàm xử lý khi nhấn cancel
 * @param {boolean} showCloseButton - Hiển thị nút X đóng (mặc định: true)
 * @param {number} autoClose - Tự động đóng sau một thời gian (ms)
 */
export const Modal = ({
  isOpen = false,
  onClose,
  type = 'info',
  title = 'Thông báo',
  message = '',
  confirmText = 'OK',
  cancelText = '',
  onConfirm,
  onCancel,
  showCloseButton = true,
  autoClose = null,
  children
}) => {
  // Auto close modal
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon và màu theo type
  const modalStyles = {
    success: {
      icon: 'fa-check-circle',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: 'fa-times-circle',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: 'fa-exclamation-triangle',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: 'fa-info-circle',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const currentStyle = modalStyles[type] || modalStyles.info;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slide-up relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          )}

          {/* Header with Icon */}
          <div className={`${currentStyle.bgColor} ${currentStyle.borderColor} border-b px-8 pt-8 pb-6 rounded-t-2xl`}>
            <div className="flex flex-col items-center">
              <div className={`${currentStyle.iconColor} mb-4`}>
                <i className={`fas ${currentStyle.icon} text-6xl`}></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {title}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {children ? (
              children
            ) : (
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                {message}
              </p>
            )}
          </div>

          {/* Footer with Buttons */}
          <div className="px-8 pb-8">
            <div className={`flex gap-3 ${cancelText ? 'justify-between' : 'justify-center'}`}>
              {cancelText && (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`${cancelText ? 'flex-1' : 'w-full'} px-6 py-3 ${currentStyle.buttonColor} text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// Demo Component để test Modal
export default function ModalDemo() {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: '',
    autoClose: null
  });

  const openModal = (type, title, message, options = {}) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || '',
      autoClose: options.autoClose || null
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Modal Component Demo</h1>
        <p className="text-gray-600 text-center mb-8">Click vào các nút để xem modal</p>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Success Modal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Success Modal</h3>
            </div>
            <p className="text-gray-600 mb-4">Hiển thị thông báo thành công</p>
            <button
              onClick={() => openModal(
                'success',
                'Đăng nhập thành công!',
                'Chào mừng bạn quay trở lại. Bạn đã đăng nhập thành công vào hệ thống.',
                { autoClose: 3000 }
              )}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Mở Modal Success
            </button>
          </div>

          {/* Error Modal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-times-circle text-red-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Error Modal</h3>
            </div>
            <p className="text-gray-600 mb-4">Hiển thị thông báo lỗi</p>
            <button
              onClick={() => openModal(
                'error',
                'Đăng nhập thất bại!',
                'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'
              )}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Mở Modal Error
            </button>
          </div>

          {/* Warning Modal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Warning Modal</h3>
            </div>
            <p className="text-gray-600 mb-4">Hiển thị cảnh báo với nút Confirm/Cancel</p>
            <button
              onClick={() => openModal(
                'warning',
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn tác.',
                { confirmText: 'Xóa', cancelText: 'Hủy' }
              )}
              className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Mở Modal Warning
            </button>
          </div>

          {/* Info Modal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-info-circle text-blue-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Info Modal</h3>
            </div>
            <p className="text-gray-600 mb-4">Hiển thị thông tin</p>
            <button
              onClick={() => openModal(
                'info',
                'Thông tin quan trọng',
                'Hệ thống sẽ bảo trì từ 23:00 - 01:00 đêm nay. Vui lòng hoàn tất giao dịch trước thời gian này.'
              )}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Mở Modal Info
            </button>
          </div>

          {/* Payment Success */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-credit-card text-green-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Payment Success</h3>
            </div>
            <p className="text-gray-600 mb-4">Thanh toán thành công</p>
            <button
              onClick={() => openModal(
                'success',
                'Thanh toán thành công!',
                'Đơn hàng #12345 của bạn đã được thanh toán thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
              )}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Mở Modal Payment
            </button>
          </div>

          {/* Registration Success */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-user-check text-green-500 text-2xl mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800">Registration Success</h3>
            </div>
            <p className="text-gray-600 mb-4">Đăng ký thành công</p>
            <button
              onClick={() => openModal(
                'success',
                'Đăng ký thành công!',
                'Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
                { confirmText: 'Đến trang chủ' }
              )}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Mở Modal Registration
            </button>
          </div>

        </div>

        {/* Code Example */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-code mr-2"></i>
            Cách sử dụng
          </h3>
          <pre className="text-sm overflow-x-auto">
{`// Import Modal component từ file này
import { Modal } from './Modal';

// Trong component
const [isModalOpen, setIsModalOpen] = useState(false);

// Sử dụng
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  type="success"
  title="Thành công!"
  message="Đăng nhập thành công"
  confirmText="OK"
  autoClose={3000}
/>

// Với nút Cancel
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  type="warning"
  title="Xác nhận"
  message="Bạn có chắc?"
  confirmText="Xác nhận"
  cancelText="Hủy"
  onConfirm={() => console.log('Confirmed')}
  onCancel={() => console.log('Cancelled')}
/>`}
          </pre>
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        autoClose={modalConfig.autoClose}
        onConfirm={() => console.log('Confirmed!')}
        onCancel={() => console.log('Cancelled!')}
      />
    </div>
  );
}