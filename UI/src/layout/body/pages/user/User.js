import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfilePage() {

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    // Dữ liệu user mẫu
    const [userData, setUserData] = useState({
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        birthDate: '1990-01-15',
        gender: 'male',
        address: '123 Đường ABC, Quận 1',
        city: 'TP. Hồ Chí Minh',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&size=200&background=3B82F6&color=fff',
        memberSince: '2023-01-15',
        totalOrders: 3,
        totalSpent: '5.500.000.000'
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, [])

    useEffect(() => {
        console.log(userData.orders);

    }, [userData]);
    const handleSaveProfile = () => {
        setIsEditing(false);
        alert('Cập nhật thông tin thành công!');
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
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
                                <p className="text-blue-100 text-xs">Đẳng cấp từng hành trình</p>
                            </div>
                        </div>
                        <button onClick={() => navigate("/")} className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                            <i className="fas fa-arrow-left"></i>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 pb-32">
                <div className="max-w-7xl mx-auto px-4 pt-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={userData.avatar}
                                alt={userData.fullName}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                            />
                            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg">
                                <i className="fas fa-camera"></i>
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-white text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-2">{userData.fullName}</h2>
                            <p className="text-blue-100 mb-4">{userData.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="bg-blue-700 px-4 py-2 rounded-lg">
                                    <i className="fas fa-calendar-alt mr-2"></i>
                                    Thành viên từ {new Date(userData.memberSince).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="bg-blue-700 px-4 py-2 rounded-lg">
                                    <i className="fas fa-shopping-cart mr-2"></i>
                                    {userData.totalOrders} đơn hàng
                                </div>
                                <div className="bg-blue-700 px-4 py-2 rounded-lg">
                                    <i className="fas fa-dollar-sign mr-2"></i>
                                    Tổng: {userData.totalSpent} ₫
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 -mt-24">
                <div className="grid lg:grid-cols-4 gap-6">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Menu</h3>
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <i className="fas fa-user"></i>
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <i className="fas fa-shopping-bag"></i>
                                        <span>Đơn hàng của tôi</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('favorites')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'favorites'
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <i className="fas fa-heart"></i>
                                        <span>Xe yêu thích</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'password'
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <i className="fas fa-lock"></i>
                                        <span>Đổi mật khẩu</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={async () => {
                                            localStorage.removeItem("accessToken")
                                            localStorage.removeItem("userID")
                                            navigate("/")
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Đăng xuất</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <i className="fas fa-edit"></i>
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <i className="fas fa-save"></i>
                                                <span>Lưu</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={userData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={userData.birthDate}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                                        <select
                                            name="gender"
                                            value={userData.gender}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        >
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Thành phố</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={userData.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h2>
                                <div className="space-y-4">
                                    {userData.orders.map(order => (
                                        <div key={order.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"

                                        >
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <img
                                                    src={order.carImage}
                                                    alt={order.carName}
                                                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-800">{order.carName}</h3>
                                                            <p className="text-gray-600">Mã đơn: {order.id}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                                                            order.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Giá</p>
                                                            <p className="text-lg font-bold text-blue-600">{order.price} ₫</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Ngày đặt</p>
                                                            <p className="font-semibold text-gray-800">{new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Thanh toán</p>
                                                            <p className={`font-semibold text-${order.paymentMethod == "Đã thanh toán" ? "green" : "gray"}-800`}>{order.paymentMethod}</p>
                                                        </div>
                                                        <div className="flex items-end">
                                                            {order.paymentMethod !== "Đã thanh toán" ?
                                                                (
                                                                    <button
                                                                        onClick={() => navigate(`/payment/${order.id}`)}
                                                                        className="text-blue-600 hover:text-blue-700 font-semibold">
                                                                        Thanh toán ngay <i className="fas fa-arrow-right ml-1"></i>
                                                                    </button>
                                                                ) :
                                                                (
                                                                    <span className="text-gray-600 font-semibold">Chờ nhận hàng</span>
                                                                )}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === 'favorites' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Xe yêu thích ({userData.favourites.length})</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {userData.favourites.map(car => (
                                        <div key={car.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all hover:shadow-lg">
                                            <div className="relative">
                                                <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
                                                <button className="absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                                                    <i className="fas fa-heart text-red-500"></i>
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">{car.name}</h3>
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-xl font-bold text-blue-600">{car.price} ₫</p>
                                                    <div className="flex items-center space-x-1">
                                                        <i className="fas fa-star text-yellow-400"></i>
                                                        <span className="font-semibold">{car.rating}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/detail/${car.id}`)}
                                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
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