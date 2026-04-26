import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import carUtils from '../../../../ulti/CarUlti';
import Modal from '../../../../layout/modal/Modal';

export default function PaymentPage() {

    const { id } = useParams();
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [selectedBank, setSelectedBank] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [car, setCar] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(600); // 10 phút
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
    const [modalProps, setModalProps] = useState({
        type: "success",
        title: "Thành công",
        message: "Thông báo thành công",
    })

    const checkPaymentStatus = () => {
        setModalProps({
            type: "warning",
            title: "Chú ý",
            message: `Chỉ xác nhận khi da chuyển khoản thành công cho đơn hàng #${car?.orderId}. Bạn có chắc chắn đã thanh toán?`,
            onConfirmAction: () => {
                setPaymentStatus('processing');
                setShowModal(false);
                console.log("Chuyển sang processing");

            },
            onCancelAction: () => setShowModal(false),
        });
        setShowModal(true);
    }

    useEffect(() => {
        const stored = localStorage.getItem('cars_data');
        if (stored) {
            deploy(JSON.parse(stored));
        }
        function getPaymentInfo(car) {
            if (!car) return null;

            return {
                carName: car?.name || 'Mercedes-Benz C300 AMG',
                carImage: car?.images[3] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80',
                price: Number(car?.price) || 2099000000,
                color: car?.colors[2]?.name || 'Đen',
                year: car?.year || 2024,
                orderId: 'ORD' + Date.now(),
                discount: 50000000,
                tax: 209900000,
                deliveryFee: 0
            };
        }

        function deploy(data) {
            const carData = carUtils.getCarById(data, Number(id));
            const filterData = getPaymentInfo(carData);
            setCar(filterData);
        }

    }, []);

    const totalAmount = car?.price - car?.discount + car?.tax + car?.deliveryFee;

    // Banks data
    const banks = [
        { id: 'vcb', name: 'Vietcombank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png', accountNumber: '0123456789', accountName: 'CONG TY AUTOPRO' },
        { id: 'tcb', name: 'Techcombank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Techcombank.png', accountNumber: '0987654321', accountName: 'CONG TY AUTOPRO' },
        { id: 'mbbank', name: 'MB Bank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-MB-Bank-MBB.png', accountNumber: '0369852147', accountName: 'CONG TY AUTOPRO' },
        { id: 'bidv', name: 'BIDV', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-BIDV.png', accountNumber: '0741852963', accountName: 'CONG TY AUTOPRO' },
        { id: 'acb', name: 'ACB', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-ACB.png', accountNumber: '0159753486', accountName: 'CONG TY AUTOPRO' },
        { id: 'vpbank', name: 'VPBank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-VPBank.png', accountNumber: '0852963741', accountName: 'CONG TY AUTOPRO' }
    ];

    const selectedBankInfo = banks.find(b => b.id === selectedBank);

    // Countdown timer
    useEffect(() => {
        if (showQR && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showQR, countdown]);

    // Format countdown
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Generate QR Code URL (VietQR)
    const generateQRCode = () => {
        if (!selectedBankInfo) return '';

        const bankId = selectedBankInfo.id.toUpperCase();
        const accountNo = selectedBankInfo.accountNumber;
        const accountName = selectedBankInfo.accountName;
        const amount = totalAmount;
        const addInfo = `AUTOPRO ${car?.orderId}`;

        // VietQR API format
        return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;
    };

    const handlePayment = () => {
        if (paymentMethod === 'bank_transfer' && !selectedBank) {
            alert('Vui lòng chọn ngân hàng!');
            return;
        }

        if (paymentMethod === 'bank_transfer') {
            setShowQR(true);

            // Simulate payment checking
            // setTimeout(() => {
            //     setPaymentStatus('processing');
            // }, 2000);

            // setTimeout(() => {
            //     setPaymentStatus('success');
            // }, 5000);
        } else if (paymentMethod === 'cash') {
            setPaymentStatus('success');
        } else if (paymentMethod === 'installment') {
            alert('Chuyển đến trang trả góp...');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Đã copy!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white p-2 rounded-lg">
                                <i className="fas fa-car text-blue-600 text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">AutoPro</h1>
                                <p className="text-blue-100 text-xs">Thanh toán an toàn</p>
                            </div>
                        </div>
                        <button className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                            <i className="fas fa-arrow-left"></i>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left - Payment Methods */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Payment Success */}
                        {paymentStatus === 'success' && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                                <i className="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                                <p className="text-gray-600 mb-6">Đơn hàng #{car?.orderId} đã được xác nhận</p>
                                <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                    Xem đơn hàng
                                </button>
                            </div>
                        )}

                        {/* Payment Methods */}
                        {paymentStatus === 'pending' && (
                            <>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Phương thức thanh toán</h2>

                                    <div className="space-y-4">
                                        {/* Bank Transfer */}
                                        <button
                                            onClick={() => setPaymentMethod('bank_transfer')}
                                            className={`w-full p-4 border-2 rounded-xl transition-all ${paymentMethod === 'bank_transfer'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <i className="fas fa-university text-blue-600 text-2xl"></i>
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-800">Chuyển khoản ngân hàng</p>
                                                        <p className="text-sm text-gray-500">Quét mã QR hoặc chuyển khoản thủ công</p>
                                                    </div>
                                                </div>
                                                <i className={`fas fa-circle ${paymentMethod === 'bank_transfer' ? 'text-blue-600' : 'text-gray-300'}`}></i>
                                            </div>
                                        </button>

                                        {/* Cash */}
                                        <button
                                            onClick={() => setPaymentMethod('cash')}
                                            className={`w-full p-4 border-2 rounded-xl transition-all ${paymentMethod === 'cash'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <i className="fas fa-money-bill-wave text-green-600 text-2xl"></i>
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-800">Tiền mặt</p>
                                                        <p className="text-sm text-gray-500">Thanh toán khi nhận xe</p>
                                                    </div>
                                                </div>
                                                <i className={`fas fa-circle ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-300'}`}></i>
                                            </div>
                                        </button>

                                        {/* Installment */}
                                        <button
                                            onClick={() => setPaymentMethod('installment')}
                                            className={`w-full p-4 border-2 rounded-xl transition-all ${paymentMethod === 'installment'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <i className="fas fa-credit-card text-purple-600 text-2xl"></i>
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-800">Trả góp</p>
                                                        <p className="text-sm text-gray-500">Lãi suất từ 0% - Duyệt nhanh 30 phút</p>
                                                    </div>
                                                </div>
                                                <i className={`fas fa-circle ${paymentMethod === 'installment' ? 'text-blue-600' : 'text-gray-300'}`}></i>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Bank Selection */}
                                {paymentMethod === 'bank_transfer' && !showQR && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Chọn ngân hàng</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {banks.map(bank => (
                                                <button
                                                    key={bank.id}
                                                    onClick={() => setSelectedBank(bank.id)}
                                                    className={`p-4 border-2 rounded-xl transition-all ${selectedBank === bank.id
                                                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                        }`}
                                                >
                                                    <img src={bank.logo} alt={bank.name} className="h-12 mx-auto mb-2" />
                                                    <p className="text-sm font-semibold text-gray-800 text-center">{bank.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* QR Code Display */}
                                {paymentMethod === 'bank_transfer' && showQR && (
                                    <>
                                        <div className="bg-white rounded-2xl shadow-lg p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold text-gray-800">Quét mã QR để thanh toán</h3>
                                                <div className={`px-4 py-2 rounded-lg font-semibold ${countdown > 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    <i className="far fa-clock mr-2"></i>
                                                    {formatTime(countdown)}
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* QR Code */}
                                                <div className="flex-1 flex flex-col items-center">
                                                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4">
                                                        <img
                                                            src={generateQRCode()}
                                                            alt="QR Code"
                                                            className="w-64 h-64"
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <img src={selectedBankInfo?.logo} alt="" className="h-8" />
                                                        <span className="font-semibold text-gray-800">{selectedBankInfo?.name}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Mở app ngân hàng và quét mã QR để thanh toán
                                                    </p>
                                                </div>

                                                {/* Transfer Info */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="bg-blue-50 rounded-xl p-4">
                                                        <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xl font-bold text-gray-800">{selectedBankInfo?.accountNumber}</p>
                                                            <button
                                                                onClick={() => copyToClipboard(selectedBankInfo?.accountNumber)}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <i className="fas fa-copy"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 rounded-xl p-4">
                                                        <p className="text-sm text-gray-600 mb-1">Chủ tài khoản</p>
                                                        <p className="text-lg font-bold text-gray-800">{selectedBankInfo?.accountName}</p>
                                                    </div>

                                                    <div className="bg-blue-50 rounded-xl p-4">
                                                        <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xl font-bold text-red-600">
                                                                {new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫
                                                            </p>
                                                            <button
                                                                onClick={() => copyToClipboard(totalAmount.toString())}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <i className="fas fa-copy"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-yellow-50 rounded-xl p-4">
                                                        <p className="text-sm text-gray-600 mb-1">Nội dung chuyển khoản</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-bold text-gray-800">AUTOPRO {car?.orderId}</p>
                                                            <button
                                                                onClick={() => copyToClipboard(`AUTOPRO ${car?.orderId}`)}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <i className="fas fa-copy"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                        <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                                        <span className="text-sm text-red-700 font-semibold">
                                                            Lưu ý: Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý tự động
                                                        </span>
                                                    </div>
                                                    {/* button */}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={checkPaymentStatus}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Xác nhận đã thanh toán
                                        </button>
                                    </>
                                )}

                                {/* Payment Button */}
                                {!showQR && (
                                    <button
                                        onClick={handlePayment}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {paymentMethod === 'bank_transfer' ? 'Tiếp tục thanh toán' :
                                            paymentMethod === 'cash' ? 'Xác nhận đặt hàng' :
                                                'Đăng ký trả góp'}
                                    </button>
                                )}
                            </>
                        )}

                        {/* Processing */}
                        {paymentStatus === 'processing' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Đang xác nhận thanh toán...</h3>
                                <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                            </div>
                        )}

                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Thông tin đơn hàng</h3>

                            {/* Car Info */}
                            <div className="mb-6">
                                <img
                                    src={car?.carImage}
                                    alt={car?.carName}
                                    className="w-full h-48 object-cover rounded-xl mb-4"
                                />
                                <h4 className="font-bold text-gray-800 text-lg mb-2">{car?.carName}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Màu sắc:</span>
                                        <span className="font-semibold text-gray-800">{car?.color}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Năm sản xuất:</span>
                                        <span className="font-semibold text-gray-800">{car?.year}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Giá xe:</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('vi-VN').format(car?.price)} ₫
                                    </span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá:</span>
                                    <span className="font-semibold">
                                        -{new Intl.NumberFormat('vi-VN').format(car?.discount)} ₫
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Thuế (10%):</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('vi-VN').format(car?.tax)} ₫
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t-2 border-gray-300 mt-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫
                                    </span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-6 bg-green-50 rounded-lg p-4 text-center">
                                <i className="fas fa-shield-alt text-green-600 text-2xl mb-2"></i>
                                <p className="text-sm text-green-700 font-semibold">Thanh toán an toàn & bảo mật</p>
                            </div>
                        </div>
                    </div>

                </div>
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    type="success"
                    title="Thành công!"
                    message="Đăng nhập thành công"
                    confirmText="OK"
                    autoClose={3000}
                />
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400">© 2024 AutoPro. Tất cả quyền được bảo lưu.</p>
                </div>
            </footer>


        </div>
    );
}