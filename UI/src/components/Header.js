import { Link } from "react-router-dom";
export default function Header() {
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