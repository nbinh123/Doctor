import React, { useMemo, useState } from "react";
import { CalendarDays, Search, Star, Clock3, ShieldCheck, Stethoscope, MapPin, CreditCard, UserRound, History, LogIn, Menu, X, ArrowRight, CheckCircle2, PhoneCall, Video, Building2, BadgeCheck } from "lucide-react";

const specialties = [
  { name: "Tim mạch", icon: "❤️", count: 24 },
  { name: "Da liễu", icon: "✨", count: 18 },
  { name: "Nhi khoa", icon: "🧒", count: 30 },
  { name: "Tai Mũi Họng", icon: "👂", count: 16 },
  { name: "Nội tổng quát", icon: "🩺", count: 42 },
  { name: "Sản phụ khoa", icon: "🤰", count: 21 },
];

const doctors = [
  {
    id: 1,
    name: "BS. Nguyễn Minh Anh",
    specialty: "Tim mạch",
    experience: "12 năm kinh nghiệm",
    degree: "ThS. Y khoa, Chuyên khoa I Tim mạch",
    rating: 4.9,
    reviews: 128,
    fee: 450000,
    hospital: "Bệnh viện An Tâm",
    location: "Quận 1, TP.HCM",
    bio: "Chuyên khám và theo dõi bệnh tim mạch, tăng huyết áp, rối loạn mỡ máu.",
    schedule: ["Thứ 2: 08:00 - 12:00", "Thứ 4: 13:00 - 17:00", "Thứ 6: 08:00 - 12:00"],
    tags: ["Khám online", "Khám offline"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "BS. Trần Thu Hà",
    specialty: "Da liễu",
    experience: "9 năm kinh nghiệm",
    degree: "Bác sĩ Chuyên khoa I Da liễu",
    rating: 4.8,
    reviews: 96,
    fee: 380000,
    hospital: "Phòng khám Sáng Da",
    location: "Bình Thạnh, TP.HCM",
    bio: "Điều trị mụn, viêm da cơ địa, dị ứng da và chăm sóc da chuyên sâu.",
    schedule: ["Thứ 3: 09:00 - 12:00", "Thứ 5: 13:00 - 17:00", "Thứ 7: 08:00 - 12:00"],
    tags: ["Khám online", "Khám offline"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "BS. Lê Quốc Huy",
    specialty: "Nhi khoa",
    experience: "15 năm kinh nghiệm",
    degree: "ThS. Nhi khoa",
    rating: 5.0,
    reviews: 201,
    fee: 500000,
    hospital: "Nhi Đồng An Bình",
    location: "TP. Thủ Đức",
    bio: "Khám, tư vấn dinh dưỡng và theo dõi phát triển cho trẻ em.",
    schedule: ["Thứ 2: 13:00 - 17:00", "Thứ 4: 08:00 - 12:00", "Chủ nhật: 08:00 - 12:00"],
    tags: ["Khám online", "Khám offline"],
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80",
  },
];

const timeSlots = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"];
const paymentMethods = ["Ví điện tử", "Thẻ ngân hàng", "Chuyển khoản", "Thanh toán tại quầy"];
const bookingModes = [
  { key: "online", label: "Online", icon: <Video size={16} /> },
  { key: "offline", label: "Offline", icon: <Building2 size={16} /> },
];

function formatMoney(v) {
  return new Intl.NumberFormat("vi-VN").format(v) + "đ";
}

function fakeApi(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingMode, setBookingMode] = useState("online");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [patientInfo, setPatientInfo] = useState({ name: "", phone: "", note: "" });
  const [user, setUser] = useState({ name: "Nguyễn Bảo", email: "baonv@email.com", phone: "0901234567" });
  const [loginMode, setLoginMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [appointments, setAppointments] = useState([
    {
      id: "BK-20260420-01",
      doctorId: 1,
      doctorName: "BS. Nguyễn Minh Anh",
      date: "2026-04-24",
      time: "09:00",
      mode: "online",
      status: "Đã xác nhận",
    },
  ]);
  const [history, setHistory] = useState([
    {
      date: "2026-03-12",
      doctorName: "BS. Trần Thu Hà",
      reason: "Khám da liễu",
      note: "Được kê đơn và hẹn tái khám sau 2 tuần.",
    },
  ]);
  const [reviews, setReviews] = useState({});
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, content: "" });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
  }, [query]);

  async function goToBooking(doctor) {
    setSelectedDoctor(doctor);
    setPage("booking");
  }

  async function handleConfirmBooking() {
    setLoading(true);
    await fakeApi();
    const bookingId = `BK-${Date.now().toString().slice(-8)}`;
    setAppointments((prev) => [
      {
        id: bookingId,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        mode: bookingMode,
        status: "Chờ xác nhận",
      },
      ...prev,
    ]);
    setHistory((prev) => [
      {
        date: selectedDate,
        doctorName: selectedDoctor.name,
        reason: `Đặt lịch ${bookingMode === "online" ? "trực tuyến" : "trực tiếp"}`,
        note: `Thanh toán: ${paymentMethod}. Mã lịch hẹn: ${bookingId}.`,
      },
      ...prev,
    ]);
    setLoading(false);
    setPage("submit");
  }

  function Header() {
    return (
      <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 text-left">
            <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">DoctorCare</div>
              <div className="text-xs text-slate-500">Đặt lịch khám an toàn, nhanh chóng</div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              ["home", "Trang chủ"],
              ["login", "Đăng nhập"],
              ["user", "Tài khoản"],
              ["history", "Lịch sử"],
              ["review", "Đánh giá"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${page === key ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-sky-50"}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <button className="rounded-2xl border border-sky-100 p-2 text-sky-700 md:hidden" onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-sky-100 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {[
                ["home", "Trang chủ"],
                ["login", "Đăng nhập"],
                ["user", "Tài khoản"],
                ["history", "Lịch sử"],
                ["review", "Đánh giá"],
              ].map(([key, label]) => (
                <button key={key} onClick={() => { setPage(key); setMobileMenuOpen(false); }} className="rounded-xl bg-sky-50 px-4 py-2 text-left text-sm font-medium text-slate-700">
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    );
  }

  function Footer() {
    return (
      <footer className="border-t border-sky-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
          <div>
            <div className="mb-3 text-lg font-bold text-slate-800">DoctorCare</div>
            <p className="text-sm leading-6 text-slate-600">Nền tảng đặt lịch hẹn bác sĩ với giao diện nhẹ nhàng, tin cậy, hỗ trợ đặt lịch, thanh toán và theo dõi hồ sơ khám bệnh.</p>
          </div>
          <div>
            <div className="mb-3 font-semibold text-slate-800">Liên kết</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Trang chủ</div>
              <div>Đặt lịch</div>
              <div>Tài khoản người dùng</div>
              <div>Lịch sử khám</div>
            </div>
          </div>
          <div>
            <div className="mb-3 font-semibold text-slate-800">Cam kết</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Thông tin minh bạch</div>
              <div>Thanh toán an toàn</div>
              <div>Bảo mật dữ liệu cá nhân</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  function Card({ children, className = "" }) {
    return <div className={`rounded-3xl border border-sky-100 bg-white shadow-sm ${className}`}>{children}</div>;
  }

  function PageHome() {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <section className="grid gap-6 rounded-[2rem] bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <ShieldCheck size={16} /> Hệ thống đặt lịch bác sĩ đáng tin cậy
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Đặt lịch khám nhanh, rõ ràng và an tâm hơn mỗi ngày.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Tìm bác sĩ theo tên hoặc chuyên khoa, xem thông tin chi tiết, chọn khung giờ phù hợp, thanh toán và xác nhận lịch hẹn chỉ trong vài bước.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setPage("booking")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700">
                Đặt lịch ngay <ArrowRight size={18} />
              </button>
              <button onClick={() => setPage("login")} className="inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-6 py-3 font-semibold text-sky-700 transition hover:bg-sky-50">
                Đăng nhập / Đăng ký
              </button>
            </div>
          </div>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700"><Search size={20} /></div>
              <div>
                <div className="font-semibold text-slate-800">Tìm bác sĩ / chuyên khoa</div>
                <div className="text-sm text-slate-500">Giả lập tìm kiếm realtime</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 rounded-2xl border border-sky-100 bg-sky-50 p-2">
              <Search className="mt-2 ml-2 text-sky-500" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập tên bác sĩ hoặc chuyên khoa..."
                className="w-full bg-transparent px-2 py-2 text-sm outline-none"
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-sky-50 p-4"><div className="font-semibold text-slate-800">+120</div><div className="text-slate-500">Bác sĩ được kiểm duyệt</div></div>
              <div className="rounded-2xl bg-sky-50 p-4"><div className="font-semibold text-slate-800">24/7</div><div className="text-slate-500">Hỗ trợ đặt lịch</div></div>
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Chuyên khoa phổ biến</h2>
            <span className="text-sm text-slate-500">Chọn nhanh để lọc bác sĩ</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((s) => (
              <Card key={s.name} className="p-5 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl">{s.icon}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-800">{s.name}</div>
                  </div>
                  <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">{s.count} bác sĩ</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Bác sĩ nổi bật</h2>
            <button onClick={() => setPage("detail")} className="text-sm font-semibold text-sky-700">Xem chi tiết</button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <img src={doctor.avatar} alt={doctor.name} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-slate-800">{doctor.name}</div>
                      <div className="text-sm text-slate-500">{doctor.specialty}</div>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                      <Star size={14} /> {doctor.rating}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Clock3 size={16} className="text-sky-500" /> {doctor.experience}</div>
                    <div className="flex items-center gap-2"><BadgeCheck size={16} className="text-sky-500" /> {doctor.degree}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-sky-500" /> {doctor.location}</div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-lg font-bold text-sky-700">{formatMoney(doctor.fee)}</div>
                    <button onClick={() => goToBooking(doctor)} className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Đặt lịch ngay</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function PageLogin() {
    return (
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-2 md:px-6">
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700"><LogIn size={20} /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{loginMode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h2>
              <p className="text-sm text-slate-500">Truy cập để quản lý lịch hẹn của bạn</p>
            </div>
          </div>

          <div className="mb-5 flex rounded-2xl bg-sky-50 p-1">
            <button onClick={() => setLoginMode("login")} className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${loginMode === "login" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>Đăng nhập</button>
            <button onClick={() => setLoginMode("signup")} className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${loginMode === "signup" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>Đăng ký</button>
          </div>

          <div className="space-y-4">
            {loginMode === "signup" && (
              <input value={authForm.name} onChange={(e) => setAuthForm((p) => ({ ...p, name: e.target.value }))} placeholder="Họ và tên" className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" />
            )}
            <input value={authForm.email} onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" />
            <input type="password" value={authForm.password} onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mật khẩu" className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" />
            <button
              onClick={() => {
                setUser({ name: authForm.name || user.name, email: authForm.email || user.email, phone: user.phone });
                setPage("home");
              }}
              className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700"
            >
              {loginMode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-800">Lợi ích khi có tài khoản</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 text-sky-600" size={18} /> Xem nhanh các lịch đã đặt và trạng thái xác nhận.</div>
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 text-sky-600" size={18} /> Cập nhật thông tin cá nhân dễ dàng.</div>
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 text-sky-600" size={18} /> Theo dõi lịch sử khám và các ghi chú quan trọng.</div>
          </div>
        </Card>
      </main>
    );
  }

  function PageDetail() {
    const doctor = selectedDoctor;
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Card className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
            <img src={doctor.avatar} alt={doctor.name} className="h-full min-h-[340px] w-full object-cover" />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{doctor.name}</h2>
                  <p className="mt-1 text-slate-500">{doctor.specialty} • {doctor.hospital}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
                  <Star className="inline" size={14} /> {doctor.rating} ({doctor.reviews} đánh giá)
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-sky-50 p-4"><div className="text-sm text-slate-500">Kinh nghiệm</div><div className="mt-1 font-semibold text-slate-800">{doctor.experience}</div></div>
                <div className="rounded-2xl bg-sky-50 p-4"><div className="text-sm text-slate-500">Bằng cấp</div><div className="mt-1 font-semibold text-slate-800">{doctor.degree}</div></div>
                <div className="rounded-2xl bg-sky-50 p-4"><div className="text-sm text-slate-500">Chi phí khám</div><div className="mt-1 font-semibold text-slate-800">{formatMoney(doctor.fee)}</div></div>
              </div>

              <p className="mt-6 leading-7 text-slate-600">{doctor.bio}</p>

              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-800">Lịch làm việc</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {doctor.schedule.map((s) => (
                    <div key={s} className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-600">{s}</div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {doctor.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">{tag}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setPage("booking")} className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700">Đặt lịch</button>
                <button onClick={() => setPage("review")} className="rounded-2xl border border-sky-200 px-6 py-3 font-semibold text-sky-700 hover:bg-sky-50">Xem / gửi đánh giá</button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    );
  }

  function PageBooking() {
    const dates = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d.toISOString().slice(0, 10);
    });

    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800">Đặt lịch khám</h2>
            <p className="mt-1 text-sm text-slate-500">Chọn ngày, giờ, hình thức khám và thông tin bệnh nhân.</p>

            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-3 font-semibold text-slate-800">Chọn ngày</div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {dates.map((d) => (
                    <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${selectedDate === d ? "border-sky-500 bg-sky-50 text-sky-700" : "border-sky-100 bg-white text-slate-600"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 font-semibold text-slate-800">Chọn khung giờ</div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {timeSlots.map((t) => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${selectedTime === t ? "border-sky-500 bg-sky-50 text-sky-700" : "border-sky-100 bg-white text-slate-600"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 font-semibold text-slate-800">Hình thức khám</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {bookingModes.map((m) => (
                    <button key={m.key} onClick={() => setBookingMode(m.key)} className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left ${bookingMode === m.key ? "border-sky-500 bg-sky-50 text-sky-700" : "border-sky-100 bg-white text-slate-600"}`}>
                      <span className="rounded-2xl bg-white p-2 shadow-sm">{m.icon}</span>
                      <div>
                        <div className="font-semibold">{m.label}</div>
                        <div className="text-xs text-slate-500">{m.key === "online" ? "Khám từ xa" : "Khám tại phòng khám"}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input value={patientInfo.name} onChange={(e) => setPatientInfo((p) => ({ ...p, name: e.target.value }))} className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" placeholder="Tên bệnh nhân" />
                <input value={patientInfo.phone} onChange={(e) => setPatientInfo((p) => ({ ...p, phone: e.target.value }))} className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" placeholder="Số điện thoại" />
              </div>
              <textarea value={patientInfo.note} onChange={(e) => setPatientInfo((p) => ({ ...p, note: e.target.value }))} className="min-h-28 w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-sky-400" placeholder="Ghi chú triệu chứng / yêu cầu" />

              <button
                disabled={!selectedDate || !selectedTime || loading}
                onClick={async () => {
                  await fakeApi(250);
                  setPage("payment");
                }}
                className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Tóm tắt lịch hẹn</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between"><span>Bác sĩ</span><span className="font-semibold text-slate-800">{selectedDoctor.name}</span></div>
                <div className="flex items-center justify-between"><span>Chuyên khoa</span><span className="font-semibold text-slate-800">{selectedDoctor.specialty}</span></div>
                <div className="flex items-center justify-between"><span>Ngày</span><span className="font-semibold text-slate-800">{selectedDate || "Chưa chọn"}</span></div>
                <div className="flex items-center justify-between"><span>Giờ</span><span className="font-semibold text-slate-800">{selectedTime || "Chưa chọn"}</span></div>
                <div className="flex items-center justify-between"><span>Hình thức</span><span className="font-semibold text-slate-800">{bookingMode === "online" ? "Online" : "Offline"}</span></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 text-sky-700"><CreditCard size={18} /><span className="font-semibold">Chi phí khám: {formatMoney(selectedDoctor.fee)}</span></div>
              <p className="mt-3 text-sm leading-6 text-slate-500">Phần thanh toán sẽ được xác nhận ở bước tiếp theo với các phương thức giả lập.</p>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  function PagePayment() {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800">Thanh toán</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-sky-50 p-5">
              <div className="text-sm text-slate-500">Chi phí khám</div>
              <div className="mt-2 text-3xl font-bold text-slate-800">{formatMoney(selectedDoctor.fee)}</div>
              <div className="mt-3 text-sm text-slate-600">Bác sĩ: {selectedDoctor.name}</div>
              <div className="text-sm text-slate-600">Ngày: {selectedDate || "Chưa chọn"} • {selectedTime || "Chưa chọn"}</div>
              <div className="text-sm text-slate-600">Hình thức: {bookingMode === "online" ? "Online" : "Offline"}</div>
            </div>

            <div>
              <div className="mb-3 font-semibold text-slate-800">Chọn phương thức thanh toán</div>
              <div className="space-y-3">
                {paymentMethods.map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)} className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium ${paymentMethod === m ? "border-sky-500 bg-sky-50 text-sky-700" : "border-sky-100 bg-white text-slate-600"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setPage("booking")} className="rounded-2xl border border-sky-200 px-6 py-3 font-semibold text-sky-700">Quay lại</button>
            <button onClick={handleConfirmBooking} disabled={loading} className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white disabled:bg-sky-300">{loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}</button>
          </div>
        </Card>
      </main>
    );
  }

  function PageSubmit() {
    const latest = appointments[0];
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Đặt lịch thành công</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Thông tin bên dưới là giả lập, dùng để mô phỏng màn hình xác nhận hoàn chỉnh.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-sky-50 p-5">
              <div className="text-sm text-slate-500">Mã lịch hẹn</div>
              <div className="mt-2 text-2xl font-bold text-slate-800">{latest?.id}</div>
            </div>
            <div className="rounded-3xl bg-sky-50 p-5">
              <div className="text-sm text-slate-500">Lưu ý tiếp theo</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">Vui lòng đến trước 10 phút, mang theo giấy tờ cá nhân và chuẩn bị sẵn thông tin triệu chứng.</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-sky-100 p-5">
            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <div><span className="font-semibold text-slate-800">Bác sĩ:</span> {selectedDoctor.name}</div>
              <div><span className="font-semibold text-slate-800">Chuyên khoa:</span> {selectedDoctor.specialty}</div>
              <div><span className="font-semibold text-slate-800">Ngày:</span> {selectedDate}</div>
              <div><span className="font-semibold text-slate-800">Giờ:</span> {selectedTime}</div>
              <div><span className="font-semibold text-slate-800">Hình thức:</span> {bookingMode === "online" ? "Online" : "Offline"}</div>
              <div><span className="font-semibold text-slate-800">Thanh toán:</span> {paymentMethod}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setPage("user")} className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white">Vào tài khoản</button>
            <button onClick={() => setPage("home")} className="rounded-2xl border border-sky-200 px-6 py-3 font-semibold text-sky-700">Về trang chủ</button>
          </div>
        </Card>
      </main>
    );
  }

  function PageUser() {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700"><UserRound size={20} /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Tài khoản người dùng</h2>
                <p className="text-sm text-slate-500">Quản lý hồ sơ và lịch hẹn</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <input value={user.name} onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
              <input value={user.email} onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
              <input value={user.phone} onChange={(e) => setUser((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
              <button className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white">Cập nhật thông tin cá nhân</button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800">Lịch đã đặt</h3>
            <div className="mt-5 space-y-4">
              {appointments.map((a) => (
                <div key={a.id} className="rounded-3xl border border-sky-100 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800">{a.doctorName}</div>
                      <div className="text-sm text-slate-500">{a.date} • {a.time} • {a.mode === "online" ? "Online" : "Offline"}</div>
                    </div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">{a.status}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700">Đổi lịch</button>
                    <button className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600">Hủy lịch</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
  }

  function PageHistory() {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700"><History size={20} /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Lịch sử khám</h2>
              <p className="text-sm text-slate-500">Theo dõi cuộc hẹn và ghi chú bệnh án</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {history.map((h, idx) => (
              <div key={idx} className="rounded-3xl border border-sky-100 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">{h.doctorName}</div>
                    <div className="text-sm text-slate-500">{h.date} • {h.reason}</div>
                  </div>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Đã lưu</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{h.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    );
  }

  function PageReview() {
    const doctor = selectedDoctor;
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800">Đánh giá bác sĩ</h2>
            <p className="mt-1 text-sm text-slate-500">Gửi nhận xét sau khi khám xong</p>
            <div className="mt-5 rounded-3xl bg-sky-50 p-5">
              <div className="font-semibold text-slate-800">{doctor.name}</div>
              <div className="text-sm text-slate-500">{doctor.specialty}</div>
            </div>
            <div className="mt-5 space-y-4">
              <select value={reviewDraft.rating} onChange={(e) => setReviewDraft((p) => ({ ...p, rating: Number(e.target.value) }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} sao</option>)}
              </select>
              <textarea value={reviewDraft.content} onChange={(e) => setReviewDraft((p) => ({ ...p, content: e.target.value }))} className="min-h-36 w-full rounded-2xl border border-sky-100 px-4 py-3" placeholder="Viết đánh giá của bạn..." />
              <button
                onClick={() => {
                  setReviews((prev) => ({
                    ...prev,
                    [doctor.id]: [{ rating: reviewDraft.rating, content: reviewDraft.content, by: user.name }, ...(prev[doctor.id] || [])],
                  }));
                  setReviewDraft({ rating: 5, content: "" });
                }}
                className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white"
              >
                Gửi đánh giá
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800">Phản hồi gần đây</h3>
            <div className="mt-5 space-y-4">
              {(reviews[doctor.id] || [
                { rating: 5, content: "Bác sĩ tư vấn rất kỹ và dễ hiểu.", by: "Mai Lan" },
                { rating: 4, content: "Quy trình đặt lịch nhanh, không phải chờ lâu.", by: "Văn Hùng" },
              ]).map((r, idx) => (
                <div key={idx} className="rounded-3xl border border-sky-100 p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{r.by}</div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600"><Star size={14} /> {r.rating}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{r.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const pages = {
    home: <PageHome />,
    login: <PageLogin />,
    detail: <PageDetail />,
    booking: <PageBooking />,
    payment: <PagePayment />,
    submit: <PageSubmit />,
    user: <PageUser />,
    history: <PageHistory />,
    review: <PageReview />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      {pages[page]}
      <Footer />
    </div>
  );
}

export default App;
