import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../../modal/Modal'

export default function AuthPage() {

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({
        type: "success",
        title: "Thành công",
        message: "Thông báo thành công",
        onConfirmAction: () => navigate("/"),
        onCancelAction: () => navigate("/"),
    })
    const { type } = useParams();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        try {
            setIsLogin(type === "login")
        } catch (error) {

        }
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            const loginData = { username: formData.username, password: formData.password, phone: formData.phone };

            let isOk = true;
            if (formData.password.length == 0 || formData.username.length == 0) {
                setShowModal(true)
                setModalProps({
                    type: "error",
                    title: "Có lỗi xảy ra",
                    message: "Sai tài khoản hoặc mật khẩu",
                })
                isOk = false;
            }

            if (!isOk) return;
            axios.post('http://localhost:5000/user/login', loginData)
                .then(response => {
                    console.log("Phản hồi từ server:", response.data);
                    setShowModal(true)
                    setModalProps({
                        type: "success",
                        title: "Thành công!",
                        message: "Đăng nhập thành công",
                        onConfirmAction: () => navigate("/"),
                        onCancelAction: () => navigate("/")
                    })
                    if (response.data) {
                        localStorage.setItem("accessToken", response.data.token);
                        localStorage.setItem('userID', response.data.id);
                    }
                })
                .catch(error => {
                    console.error("Lỗi:", error.response?.data || error.message);
                    // alert("Đăng nhập thất bại!");
                    switch (error.response?.data.message) {
                        case "User already exists":
                            setShowModal(true)
                            setModalProps({
                                type: "warning",
                                title: "Thông báo",
                                message: "Người dùng đã tồn tại",
                            })
                            break;
                        case "User does not exist":
                            setShowModal(true)
                            setModalProps({
                                type: "error",
                                title: "Có lỗi xảy ra",
                                message: "Người dùng không tồn tại",
                            })
                            break;
                        case "Invalid credentials":
                            setShowModal(true)
                            setModalProps({
                                type: "error",
                                title: "Có lỗi xảy ra",
                                message: "Sai tài khoản hoặc mật khẩu",
                            })
                            break;
                        default:
                            break;
                    }
                });
        } else {
            const loginData = { 
                username: formData.username, 
                password: formData.password, 
                email: formData.email, 
                fullName: formData.fullName,
                phone: formData.phone
            };

            let isOk = true;
            if (formData.phone.length != 10) {
                setShowModal(true)
                setModalProps({
                    type: "error",
                    title: "Có lỗi xảy ra",
                    message: "Số điện thoại chưa đúng định dạng",
                })
                isOk = false;
            }
            if (formData.fullName == "") {
                setShowModal(true)
                setModalProps({
                    type: "error",
                    title: "Có lỗi xảy ra",
                    message: "Bạn chưa nhập tên",
                })
                isOk = false;
            }

            // SUBMIT TRƯỚC KHI GỌI API
            ///////////////////////////////////////////////////////////
            if (!isOk) return;
            axios.post('http://localhost:5000/user/sign_in', loginData)
                .then(response => {
                    console.log("Phản hồi từ server:", response.data);
                    setShowModal(true)
                    setModalProps({
                        type: "success",
                        title: "Thành công!",
                        message: "Đăng ký người dùng thành công",
                    })
                    setIsLogin(true)
                })
                .catch(error => {
                    console.error("Lỗi:", error.response?.data || error.message);
                    // alert("Đăng nhập thất bại!");
                    switch (error.response?.data.message) {
                        case "User already exists":
                            setShowModal(true)
                            setModalProps({
                                type: "warning",
                                title: "Thông báo",
                                message: "Người dùng đã tồn tại",
                            })
                            break;
                        case "User does not exist":
                            setShowModal(true)
                            setModalProps({
                                type: "error",
                                title: "Có lỗi xảy ra",
                                message: "Người dùng không tồn tại",
                            })
                            break;

                        default:
                            break;
                    }
                });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Left Side - Branding */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full opacity-10 -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="bg-white p-3 rounded-xl">
                                <i className="fas fa-car text-blue-600 text-4xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">AutoPro</h1>
                                <p className="text-blue-100 text-sm">Đẳng cấp từng hành trình</p>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold mb-4">
                            {isLogin ? 'Chào mừng trở lại!' : 'Bắt đầu hành trình'}
                        </h2>
                        <p className="text-blue-100 text-lg mb-8">
                            {isLogin
                                ? 'Đăng nhập để trải nghiệm dịch vụ tốt nhất từ AutoPro'
                                : 'Tạo tài khoản để khám phá hàng ngàn mẫu xe tuyệt vời'}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-check-circle text-green-300 text-xl mt-1"></i>
                                <div>
                                    <h3 className="font-semibold">Hơn 1000+ mẫu xe</h3>
                                    <p className="text-blue-200 text-sm">Đa dạng các dòng xe từ phổ thông đến cao cấp</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-check-circle text-green-300 text-xl mt-1"></i>
                                <div>
                                    <h3 className="font-semibold">Giá tốt nhất thị trường</h3>
                                    <p className="text-blue-200 text-sm">Cam kết giá cạnh tranh và nhiều ưu đãi</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <i className="fas fa-check-circle text-green-300 text-xl mt-1"></i>
                                <div>
                                    <h3 className="font-semibold">Hỗ trợ 24/7</h3>
                                    <p className="text-blue-200 text-sm">Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                        </h2>
                        <p className="text-gray-600">
                            {isLogin ? 'Nhập thông tin để tiếp tục' : 'Tạo tài khoản mới'}
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* Full Name - Only for Register */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="abc123"
                                />
                            </div>
                        </div>

                        {/* Phone - Only for Register */}
                        {!isLogin && (
                            <>
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="0901234567"
                                        />
                                    </div>
                                </div>
                            </>

                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password - Only for Register */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Remember Me & Forgot Password - Only for Login */}
                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                                </label>
                                <div className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                                    Quên mật khẩu?
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Hoặc tiếp tục với</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fab fa-google text-red-500 text-xl"></i>
                                <span className="font-semibold text-gray-700">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fab fa-facebook text-blue-600 text-xl"></i>
                                <span className="font-semibold text-gray-700">Facebook</span>
                            </button>
                        </div>

                        {/* Toggle Login/Register */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                                {' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                type={modalProps.type}
                title={modalProps.title}
                message={modalProps.message}
                autoClose={100000}
                onConfirm={modalProps.onConfirmAction}
                onCancel={modalProps.onCancelAction}
            />

        </div>
    );
}