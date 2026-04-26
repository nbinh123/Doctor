import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import carUtils from '../../../../ulti/CarUlti';
import axios from 'axios';
import { Modal } from '../../../modal/Modal';

export default function CarDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isOnCart, setIsOnCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('black');
    const [activeTab, setActiveTab] = useState('specs');
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({
        type: "success",
        title: "Thành công",
        message: "Thông báo thành công",
        onConfirmAction: () => navigate("/"),
        onCancelAction: () => navigate("/"),
    })
    const [car, setCar] = useState({
        name: 'Mercedes-Benz C300 AMG',
        price: '2.099.000.000',
        year: 2024,
        rating: 4.9,
        reviews: 127,
        stock: 'Còn hàng',
        images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
            'https://images.unsplash.com/photo-1617531653520-bd4f396d89c9?w=800&q=80',
            'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80'
        ],
        colors: [
            { name: 'Đen', value: 'black', hex: '#000000' },
            { name: 'Trắng', value: 'white', hex: '#FFFFFF' },
            { name: 'Xám', value: 'gray', hex: '#6B7280' },
            { name: 'Xanh', value: 'blue', hex: '#3B82F6' }
        ],
        specs: {
            engine: '2.0L Turbo',
            power: '258 HP',
            torque: '370 Nm',
            transmission: 'Tự động 9 cấp',
            fuelType: 'Xăng',
            fuelConsumption: '7.2L/100km',
            seats: '5 chỗ',
            drive: 'Dẫn động cầu sau'
        },
        features: [
            'Hệ thống điều hòa tự động 2 vùng',
            'Ghế da cao cấp chỉnh điện',
            'Hệ thống âm thanh Burmester',
            'Màn hình cảm ứng 11.9 inch',
            'Camera 360 độ',
            'Hệ thống an toàn chủ động',
            'Cruise Control thích ứng',
            'Cốp điện thông minh',
            'Đèn LED Matrix thông minh',
            'Phanh tay điện tử'
        ],
        description: 'Mercedes-Benz C300 AMG là sự kết hợp hoàn hảo giữa sang trọng và thể thao. Với thiết kế AMG Line đầy mạnh mẽ, nội thất cao cấp và công nghệ hiện đại, C300 AMG mang đến trải nghiệm lái xe đẳng cấp cho những ai yêu thích sự hoàn hảo.'
    });

    useEffect(() => {
        function deploy(data) {
            const carData = carUtils.getCarById(data, Number(id));
            setCar(carData);
        }
        const stored = localStorage.getItem('cars_data');
        if (!stored) {
            axios.get("https://car-api-f99n.onrender.com/api/data")
                .then(response => {
                    if (response.data?.car) {
                        const cars = (response.data?.car)
                        localStorage.setItem('cars_data', JSON.stringify(cars));
                        deploy(cars)
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        } else {
            deploy(JSON.parse(stored))
        }
    }, [])
    useEffect(() => {
        setIsFavourite(isFavouriteCar(id));
    }, []);
    useEffect(() => {
        setIsOnCart(isInCart(id));
    }, []);
    const pushToCart = () => {
        try {
            // 1️⃣ Lấy danh sách orders hiện tại từ localStorage
            const storedUser = localStorage.getItem("userData"); // giả sử userData chứa thông tin user
            let user = storedUser ? JSON.parse(storedUser) : {};

            if (!user.orders) user.orders = []; // nếu chưa có đơn hàng thì khởi tạo

            const existIndex = user.orders.findIndex(ord => ord.id === Number(id));

            if (existIndex !== -1) {
                
                user.orders.splice(existIndex, 1);
                localStorage.setItem("userData", JSON.stringify(user));

                setIsOnCart(false);
                setModalProps({
                    type: "info",
                    title: "Thông báo",
                    message: "Đã xóa khỏi giỏ hàng!",
                    onConfirmAction: () => setShowModal(false),
                    onCancelAction: () => setShowModal(false),
                });
                setShowModal(true);
                return;
            }
            // 2️⃣ Tạo object đơn hàng mới
            const newOrder = {
                id: Number(id),
                carName: car.name,
                carImage: car.images?.[0] || '',
                price: car.price,
                status: 'Đang xử lý',
                statusColor: 'blue',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'Chưa thanh toán'
            };

            // 3️⃣ Thêm order mới vào mảng
            user.orders.push(newOrder);

            // 4️⃣ Lưu lại vào localStorage
            localStorage.setItem("userData", JSON.stringify(user));

            // 5️⃣ Hiện modal thành công
            setModalProps({
                type: "success",
                title: "Thành công",
                message: "Xe đã được thêm vào giỏ hàng của bạn!",
                onConfirmAction: () => setShowModal(false),
                onCancelAction: () => setShowModal(false)
            });
            setShowModal(true);
            setIsOnCart(true);

        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            setModalProps({
                type: "error",
                title: "Lỗi",
                message: "Không thể thêm vào giỏ hàng, vui lòng thử lại!",
                onConfirmAction: () => setShowModal(false),
                onCancelAction: () => setShowModal(false),
            });
            setShowModal(true);
        }
    }
    const getCart = () => {
        const storedUser = localStorage.getItem("userData");
        const user = storedUser ? JSON.parse(storedUser) : {};
        return user.orders || [];
    };
    // Kiểm tra xem xe có trong giỏ chưa
    const isInCart = (id) => {
        const cart = getCart();
        return cart.some(item => item.id === Number(id));
    };

    const getFavourites = () => {
        const storedUser = localStorage.getItem("userData");
        const user = storedUser ? JSON.parse(storedUser) : {};
        return user.favourites || [];
    };

    const isFavouriteCar = (id) => {
        const favourites = getFavourites();
        return favourites.some(item => item.id === Number(id));
    };

    const addToFavourite = () => {
        try {
            const storedUser = localStorage.getItem("userData");
            let user = storedUser ? JSON.parse(storedUser) : {};

            if (!user.favourites) user.favourites = [];

            // Kiểm tra nếu xe đã trong danh sách
            const existIndex = user.favourites.findIndex(fav => fav.id === Number(id));

            if (existIndex !== -1) {
                // ❌ Nếu đã tồn tại → xóa khỏi danh sách
                user.favourites.splice(existIndex, 1);
                localStorage.setItem("userData", JSON.stringify(user));

                setIsFavourite(false);
                setModalProps({
                    type: "info",
                    title: "Thông báo",
                    message: "Đã xóa khỏi danh sách yêu thích!",
                    onConfirmAction: () => setShowModal(false),
                    onCancelAction: () => setShowModal(false),
                });
                setShowModal(true);
                return;
            }

            // ✅ Nếu chưa có → thêm mới
            const newFavourite = {
                id: Number(id),
                name: car.name,
                image: car.images?.[0] || '',
                price: car.price,
                rating: car.rating || 0
            };

            user.favourites.push(newFavourite);
            localStorage.setItem("userData", JSON.stringify(user));

            setIsFavourite(true);
            setModalProps({
                type: "success",
                title: "Thành công",
                message: "Xe đã được thêm vào danh sách yêu thích!",
                onConfirmAction: () => setShowModal(false),
                onCancelAction: () => setShowModal(false),
            });
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi khi thêm vào yêu thích:", error);
        }
    };

    if (!car) {
        return <div>Không tìm thấy xe!</div>;
    }

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
                        <button className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                            <i className="fas fa-arrow-left"></i>
                            <span onClick={() => navigate("/")}>Quay lại</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <span>Trang chủ</span>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span>Xe sang</span>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span className="text-blue-600 font-semibold">{car.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">

                    {/* Left - Images */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={car.images[selectedImage]}
                                    alt={car.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {car.stock}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-3">
                            {car.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                        ? 'border-blue-600 shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-800 mb-3">{car.name}</h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-1">
                                    <i className="fas fa-star text-yellow-400"></i>
                                    <span className="font-semibold">{car.rating}</span>
                                    <span className="text-gray-500">({car.reviews} đánh giá)</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <i className="far fa-calendar"></i>
                                    <span>{car.year}</span>
                                </div>
                            </div>
                            <p className="text-5xl font-bold text-blue-600 mb-2">{car.price} ₫</p>
                            <p className="text-gray-500 text-sm">Giá đã bao gồm VAT</p>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Chọn màu xe</h3>
                            <div className="flex items-center space-x-3">
                                {car.colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color.value
                                            ? 'border-blue-600 scale-110 shadow-lg'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }
                                            flex items-center
                                            `}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {selectedColor === color.value && (
                                            <i className="fas fa-check absolute inset-0 flex items-center justify-center text-white text-sm"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Đã chọn: <span className="font-semibold">
                                    {car.colors.find(c => c.value === selectedColor)?.name}
                                </span>
                            </p>
                        </div>

                        {/* Quick Specs */}
                        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <i className="fas fa-cog text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Động cơ</p>
                                    <p className="font-semibold text-gray-800">{car.specs.engine}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <i className="fas fa-tachometer-alt text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Công suất</p>
                                    <p className="font-semibold text-gray-800">{car.specs.power}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <i className="fas fa-gas-pump text-purple-600 text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Nhiên liệu</p>
                                    <p className="font-semibold text-gray-800">{car.specs.fuelType}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <i className="fas fa-users text-orange-600 text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Số chỗ</p>
                                    <p className="font-semibold text-gray-800">{car.specs.seats}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button onClick={() => {
                                setShowModal(true)
                                setModalProps({
                                    type: "info",
                                    title: "Thông báo",
                                    message: "Bạn có chắc muốn thêm vào giỏ hàng",
                                    onConfirmAction: () => pushToCart(),
                                    onCancelAction: () => setShowModal(false),
                                    confirmText: "Có",
                                    cancelText: "Không"
                                })
                            }} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                                <i className="fas fa-shop"></i>
                                <span>{isOnCart ? "Xóa khỏi giỏ hàng" : "Thêm vào giỏ hàng"}</span>
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2">
                                    <i className="fas fa-calendar-check"></i>
                                    <span>Đặt lịch xem xe</span>
                                </button>
                                {
                                    isFavourite ? (
                                        <button onClick={() => addToFavourite()} className="w-full bg-gradient-to-r from-red-600 to-red-700 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                                            <i className="fas fa-heart text-white"></i>
                                            <span className='text-white'>Yêu thích</span>
                                        </button>
                                    ) : (
                                        <button onClick={() => addToFavourite()} className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                                            <i className="fas fa-heart"></i>
                                            <span>Thêm yêu thích</span>
                                        </button>
                                    )
                                }
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-6 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-600 p-2 rounded-lg">
                                        <i className="fas fa-headset text-white"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Hỗ trợ 24/7</p>
                                        <p className="font-bold text-blue-600">1900 xxxx</p>
                                    </div>
                                </div>
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`flex-1 py-4 px-6 font-semibold transition-all ${activeTab === 'specs'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-list-ul mr-2"></i>
                                Thông số kỹ thuật
                            </button>
                            <button
                                onClick={() => setActiveTab('features')}
                                className={`flex-1 py-4 px-6 font-semibold transition-all ${activeTab === 'features'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-star mr-2"></i>
                                Tính năng
                            </button>
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`flex-1 py-4 px-6 font-semibold transition-all ${activeTab === 'description'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-info-circle mr-2"></i>
                                Mô tả
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'specs' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Động cơ & Vận hành</h3>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Loại động cơ</span>
                                        <span className="font-semibold text-gray-800">{car.specs.engine}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Công suất</span>
                                        <span className="font-semibold text-gray-800">{car.specs.power}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Mô-men xoắn</span>
                                        <span className="font-semibold text-gray-800">{car.specs.torque}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Hộp số</span>
                                        <span className="font-semibold text-gray-800">{car.specs.transmission}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Thông số chung</h3>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Nhiên liệu</span>
                                        <span className="font-semibold text-gray-800">{car.specs.fuelType}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Mức tiêu hao</span>
                                        <span className="font-semibold text-gray-800">{car.specs.fuelConsumption}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Số chỗ ngồi</span>
                                        <span className="font-semibold text-gray-800">{car.specs.seats}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Dẫn động</span>
                                        <span className="font-semibold text-gray-800">{car.specs.drive}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Tính năng nổi bật</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {car.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <i className="fas fa-check-circle text-green-500 text-lg mt-1"></i>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Giới thiệu sản phẩm</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{car.description}</p>
                                <div className="mt-8 grid md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                                        <i className="fas fa-shield-alt text-blue-600 text-3xl mb-3"></i>
                                        <h4 className="font-bold text-gray-800 mb-2">Bảo hành chính hãng</h4>
                                        <p className="text-gray-600 text-sm">3 năm hoặc 100.000 km</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                        <i className="fas fa-tools text-green-600 text-3xl mb-3"></i>
                                        <h4 className="font-bold text-gray-800 mb-2">Bảo dưỡng miễn phí</h4>
                                        <p className="text-gray-600 text-sm">4 lần bảo dưỡng đầu tiên</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                                        <i className="fas fa-car-side text-purple-600 text-3xl mb-3"></i>
                                        <h4 className="font-bold text-gray-800 mb-2">Hỗ trợ lái thử</h4>
                                        <p className="text-gray-600 text-sm">Miễn phí tại showroom</p>
                                    </div>
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

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                type={modalProps.type}
                title={modalProps.title}
                message={modalProps.message}
                autoClose={100000}
                onConfirm={modalProps.onConfirmAction}
                onCancel={modalProps.onCancelAction}
                cancelText={modalProps.cancelText}
                confirmText={modalProps.confirmText}
            />
        </div>
    );
}