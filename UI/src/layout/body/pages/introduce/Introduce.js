import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CarDealership() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [cars, setCars] = useState([]);
    const [userData, setUserData] = useState({})
    // const [filteredCars, setFilteredCars] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('cars_data');
        if (!stored) {
            axios.get("https://car-api-f99n.onrender.com/api/data")
                .then(response => {
                    console.log(response.data); // dữ liệu trả về
                    if (response.data?.car) {
                        console.log(response.data?.car);

                        setCars(response.data?.car)
                        localStorage.setItem('cars_data', JSON.stringify(response.data?.car));
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        } else {
            setCars(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        const id = localStorage.getItem('userID');
        if (id) {
            const userData = localStorage.getItem("userData");
            if (userData) return;
            axios.get(`http://localhost:5000/user/get_information?userID=${id}`)
                .then(response => {
                    console.log(response.data.userData); // dữ liệu trả về
                    setUserData(response.data.userData);
                    localStorage.setItem("userData", JSON.stringify(response.data.userData))
                    
                })
                .catch(error => {
                    console.error(error);
                })
        } else {
            // setCars(JSON.parse(stored))
        }
    }, [])
    const filteredCars = cars.filter(car => {
        const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;
        const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'luxury', name: 'Xe sang' },
        { id: 'sedan', name: 'Sedan' },
        { id: 'suv', name: 'SUV' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

            {/* FontAwesome CDN */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white p-2 rounded-lg">
                                <i className="fas fa-car text-blue-600 text-3xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">AutoPro</h1>
                                <p className="text-blue-100 text-sm">Đẳng cấp từng hành trình</p>
                            </div>
                        </div>
                        <div className="hidden md:flex space-x-9">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-phone"></i>
                                <span>1900 xxxx</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-envelope"></i>
                                <span>info@autopro.vn</span>
                            </div>
                            {
                                !localStorage.getItem("accessToken") ? (
                                    <>
                                        <button onClick={() => navigate("/authPage/abc")} className="w-full transition-all flex items-center justify-center space-x-2 group">
                                            <span>Đăng ký</span>
                                            <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                                        </button>
                                        <button onClick={() => navigate("/authPage/login")} className="w-full transition-all flex items-center justify-center space-x-2 group">
                                            <span>Đăng nhập</span>
                                            <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center">
                                        <p>Xin chào, {userData?.fullName}</p>
                                        <div onClick={() => navigate(`/user`)} className="space-x-2 border border-white-800 mr-2 ml-2 p-3 rounded-2xl">
                                            <i className="fas fa-user flex items-center"></i>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold mb-4 animate-fade-in">Khám Phá Xe Mơ Ước</h2>
                        <p className="text-xl text-blue-100 mb-8">Hơn 1000+ mẫu xe chính hãng với giá tốt nhất thị trường</p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm xe theo tên, hãng..."
                                    className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars ? filteredCars.map(car => (
                        <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
                            <div className="relative">
                                <img src={car.image} alt={car.name} className="w-full h-56 object-cover" />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Mới {car.year}
                                </div>
                                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
                                    <i className="fas fa-star text-yellow-400 text-sm"></i>
                                    <span className="text-sm font-semibold">{car.rating}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{car.name}</h3>
                                <p className="text-3xl font-bold text-blue-600 mb-4">{car.price} ₫</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <i className="far fa-calendar mr-2"></i>
                                        <span>{car.year}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <i className="fas fa-tachometer-alt mr-2"></i>
                                        <span>{car.mileage}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <i className="fas fa-gas-pump mr-2"></i>
                                        <span>{car.fuel}</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate(`/detail/${car.id}`)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2 group">
                                    <span>Xem chi tiết</span>
                                    <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    )) : "0"}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">AutoPro</h3>
                            <p className="text-gray-400">Đơn vị phân phối xe ô tô uy tín hàng đầu Việt Nam</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                            <div className="space-y-2 text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-phone"></i>
                                    <span>1900 xxxx</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-envelope"></i>
                                    <span>info@autopro.vn</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Biên Hòa, Đồng Nai</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Giờ làm việc</h3>
                            <p className="text-gray-400">Thứ 2 - Thứ 7: 8:00 - 18:00</p>
                            <p className="text-gray-400">Chủ nhật: 8:00 - 17:00</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2024 AutoPro. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Container & Sizing:

// min-h-screen - Chiều cao tối thiểu bằng 100% viewport
// max-w-7xl - Chiều rộng tối đa 80rem (1280px)
// w-full - Chiều rộng 100%
// h-56 - Chiều cao 14rem (224px)
// mx-auto - Margin trái/phải tự động (căn giữa)

// Padding & Margin:

// px-4 - Padding trái/phải 1rem (16px)
// py-6 - Padding trên/dưới 1.5rem (24px)
// p-2, p-6 - Padding tất cả các hướng
// mt-8, mb-4, -mt-8 - Margin top/bottom (số âm kéo lên)
// mr-2 - Margin right 0.5rem (8px)

// Gap:

// gap-4, gap-8 - Khoảng cách giữa các items trong grid/flex
// space-x-2, space-x-3, space-x-6 - Khoảng cách ngang giữa children
// space-y-2 - Khoảng cách dọc giữa children


// Flexbox & Grid
// Flex:

// flex - Display flex
// items-center - Căn giữa theo trục dọc
// justify-between - Căn đều 2 đầu
// justify-center - Căn giữa theo trục ngang
// flex-wrap - Cho phép xuống dòng

// Grid:

// grid - Display grid
// grid-cols-1 - 1 cột (mobile)
// md:grid-cols-2 - 2 cột trên màn hình medium
// lg:grid-cols-3 - 3 cột trên màn hình large
// md:grid-cols-3 - 3 cột trên medium (footer)


// Colors
// Background:

// bg-white - Nền trắng
// bg-gray-100, bg-gray-900 - Nền xám nhạt/đậm
// bg-blue-600 - Nền xanh dương
// bg-gradient-to-r - Gradient từ trái sang phải
// bg-gradient-to-br - Gradient từ trên-trái xuống dưới-phải
// from-blue-600, to-blue-800 - Màu đầu/cuối của gradient
// via-blue-600 - Màu giữa của gradient

// Text:

// text-white - Chữ trắng
// text-gray-400, text-gray-600, text-gray-800 - Chữ xám các cấp độ
// text-blue-600, text-blue-100 - Chữ xanh dương
// text-yellow-400 - Chữ vàng


// Typography
// Size:

// text-sm - 0.875rem (14px)
// text-xl - 1.25rem (20px)
// text-3xl - 1.875rem (30px)
// text-5xl - 3rem (48px)

// Weight & Style:

// font-bold - Chữ đậm (700)
// font-semibold - Chữ semi-bold (600)

// Alignment:

// text-center - Căn giữa


// Borders & Rounded
// Rounded:

// rounded-lg - Bo góc 0.5rem (8px)
// rounded-full - Bo góc hoàn toàn (hình tròn)
// rounded-2xl - Bo góc 1rem (16px)

// Border:

// border-t - Viền trên
// border-gray-800 - Màu viền xám đậm


// Shadows

// shadow-lg - Bóng lớn
// shadow-xl - Bóng rất lớn
// shadow-2xl - Bóng cực lớn


// Effects & Transitions
// Transform:

// transform - Bật transform
// translate-x-1 - Dịch ngang 0.25rem
// -translate-y-1/2 - Dịch dọc -50% (căn giữa)
// scale-105 - Phóng to 105%

// Transition:

// transition-all - Hiệu ứng chuyển đổi mọi thuộc tính
// transition-transform - Hiệu ứng cho transform

// Hover:

// hover:scale-105 - Phóng to khi hover
// hover:shadow-2xl - Tăng bóng khi hover
// hover:bg-gray-200 - Đổi màu nền khi hover
// hover:from-blue-700 - Đổi gradient khi hover

// Group:

// group - Đánh dấu phần tử cha
// group-hover:translate-x-1 - Áp dụng khi hover vào group


// Positioning
// Position:

// relative - Vị trí tương đối
// absolute - Vị trí tuyệt đối

// Placement:

// top-4, right-4, left-4 - Khoảng cách từ cạnh
// top-1/2 - 50% từ trên xuống