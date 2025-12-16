import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, User, LogOut, Ticket, Menu, X, Home, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                scrolled || !isHome ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Bus className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                scrolled || !isHome ? 'text-gray-800' : 'text-white'
              }`}>
                <span className="hidden sm:inline">Coach</span>Booking
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/bookings" 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      scrolled || !isHome 
                        ? 'text-gray-600 hover:bg-gray-100' 
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <Ticket size={18} /> 
                    <span>Vé của tôi</span>
                  </Link>
                  <div className={`flex items-center gap-3 ml-2 pl-4 border-l ${
                    scrolled || !isHome ? 'border-gray-200' : 'border-white/20'
                  }`}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      scrolled || !isHome ? 'bg-gray-100' : 'bg-white/10'
                    }`}>
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.fullName?.charAt(0)}
                        </span>
                      </div>
                      <span className={`max-w-[100px] truncate text-sm font-medium ${
                        scrolled || !isHome ? 'text-gray-700' : 'text-white'
                      }`}>
                        {user?.fullName}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        scrolled || !isHome 
                          ? 'text-gray-500 hover:bg-red-50 hover:text-red-600' 
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    to="/login" 
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      scrolled || !isHome 
                        ? 'text-gray-600 hover:bg-gray-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-2 rounded-xl transition-all ${
                scrolled || !isHome ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{user?.fullName?.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{user?.fullName}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <Link to="/" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
                  <Home size={20} /> Trang chủ
                </Link>
                <Link to="/bookings" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
                  <Ticket size={20} /> Vé của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut size={20} /> Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block p-3 text-center text-gray-600 hover:bg-gray-50 rounded-xl transition font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="block p-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 ${isHome ? '' : 'pt-20 sm:pt-24'}`}>
        <div className={isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6'}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Bus className="text-white w-5 h-5" />
              </div>
              <span className="font-semibold text-white">CoachBooking</span>
            </div>
            <p className="text-sm text-center sm:text-right">
              © 2024 Coach Booking. Đặt vé xe khách trực tuyến nhanh chóng & tiện lợi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
