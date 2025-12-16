import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Bus, ArrowRight, Shield, Clock, CreditCard, Star, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { format } from 'date-fns';

interface Route {
  id: number;
  departure: string;
  destination: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [form, setForm] = useState({
    departure: '',
    destination: '',
    departureDate: format(new Date(), 'yyyy-MM-dd'),
    coachType: ''
  });

  useEffect(() => {
    api.get('/routes')
      .then(res => setRoutes(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to fetch routes:', err);
        setRoutes([]);
      });
  }, []);

  const departures = [...new Set(routes.map(r => r.departure))];
  const destinations = [...new Set(routes.map(r => r.destination))];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(form as Record<string, string>);
    navigate(`/trips?${params}`);
  };

  const features = [
    { icon: Shield, title: 'An toàn & Tin cậy', desc: 'Đối tác uy tín, xe chất lượng cao', color: 'from-blue-500 to-blue-600' },
    { icon: Clock, title: 'Đặt vé 24/7', desc: 'Đặt vé mọi lúc, mọi nơi', color: 'from-emerald-500 to-emerald-600' },
    { icon: CreditCard, title: 'Thanh toán dễ dàng', desc: 'Hỗ trợ MoMo, VNPay, chuyển khoản', color: 'from-orange-500 to-orange-600' },
  ];

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Hải Phòng', price: '150.000đ', time: '2h' },
    { from: 'TP.HCM', to: 'Đà Lạt', price: '250.000đ', time: '6h' },
    { from: 'Đà Nẵng', to: 'Huế', price: '120.000đ', time: '2.5h' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="hero-pattern relative min-h-[600px] sm:min-h-[700px] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        
        {/* Animated Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400/15 rounded-full blur-2xl animate-bounce-slow" />
        
        {/* Moving Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-white/30 rounded-full top-1/4 left-1/5 animate-particle-1" />
          <div className="absolute w-1.5 h-1.5 bg-white/20 rounded-full top-1/3 left-2/3 animate-particle-2" />
          <div className="absolute w-2.5 h-2.5 bg-white/25 rounded-full top-2/3 left-1/3 animate-particle-3" />
          <div className="absolute w-1 h-1 bg-white/30 rounded-full top-1/2 right-1/4 animate-particle-4" />
          <div className="absolute w-2 h-2 bg-cyan-300/30 rounded-full bottom-1/3 left-1/2 animate-particle-5" />
        </div>
        
        {/* Animated Wave Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-32 w-full h-24 animate-wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,100 L0,100 Z" fill="white"/>
          </svg>
          <svg className="absolute bottom-40 w-full h-24 animate-wave-slow" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,30 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
              <Star size={16} className="text-yellow-400" />
              <span>Hơn 10,000+ khách hàng tin tưởng</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Đặt vé xe khách
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Nhanh chóng & Tiện lợi
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Tìm và đặt vé xe khách đi khắp Việt Nam chỉ với vài thao tác đơn giản
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <MapPin size={16} className="text-blue-600" /> Điểm đi
                  </label>
                  <select
                    value={form.departure}
                    onChange={e => setForm({ ...form, departure: e.target.value })}
                    className="input-modern"
                    required
                  >
                    <option value="">Chọn điểm đi</option>
                    {departures.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <MapPin size={16} className="text-orange-500" /> Điểm đến
                  </label>
                  <select
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                    className="input-modern"
                    required
                  >
                    <option value="">Chọn điểm đến</option>
                    {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <Calendar size={16} className="text-emerald-500" /> Ngày đi
                  </label>
                  <input
                    type="date"
                    value={form.departureDate}
                    onChange={e => setForm({ ...form, departureDate: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="input-modern"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <Bus size={16} className="text-purple-500" /> Loại xe
                  </label>
                  <select
                    value={form.coachType}
                    onChange={e => setForm({ ...form, coachType: e.target.value })}
                    className="input-modern"
                  >
                    <option value="">Tất cả loại xe</option>
                    <option value="VIP">🌟 Xe VIP</option>
                    <option value="STANDARD">🚌 Xe thường</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 sm:mt-6 w-full btn-primary py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                <Search size={20} /> Tìm chuyến xe
              </button>
            </form>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Tại sao chọn <span className="gradient-text">CoachBooking</span>?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Chúng tôi mang đến trải nghiệm đặt vé xe khách tốt nhất cho bạn
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tuyến phổ biến</h2>
              <p className="text-gray-600">Các tuyến đường được đặt nhiều nhất</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {popularRoutes.map((route, i) => (
              <div 
                key={i}
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer card-hover border border-gray-100"
                onClick={() => {
                  setForm({ ...form, departure: route.from, destination: route.to });
                  navigate(`/trips?departure=${route.from}&destination=${route.to}&departureDate=${form.departureDate}`);
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <span>{route.from}</span>
                      <ArrowRight size={18} className="text-blue-600" />
                      <span>{route.to}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Thời gian: ~{route.time}</div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Giá từ</span>
                  <span className="text-xl font-bold text-orange-600">{route.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Sẵn sàng cho chuyến đi tiếp theo?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Đăng ký ngay để nhận thông báo về các chương trình khuyến mãi hấp dẫn
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
            >
              Đăng ký miễn phí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
