import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bus, Calendar, TrendingUp, Ticket, ArrowUpRight, Sparkles } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ routes: 0, coaches: 0, trips: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [routes, coaches, trips, bookings] = await Promise.all([
          api.get('/admin/routes'),
          api.get('/admin/coaches'),
          api.get('/admin/trips'),
          api.get('/admin/bookings')
        ]);
        setStats({
          routes: Array.isArray(routes.data) ? routes.data.length : 0,
          coaches: Array.isArray(coaches.data) ? coaches.data.length : 0,
          trips: Array.isArray(trips.data) ? trips.data.length : 0,
          bookings: Array.isArray(bookings.data) ? bookings.data.length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ routes: 0, coaches: 0, trips: 0, bookings: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Đơn đặt vé', value: stats.bookings, icon: Ticket, gradient: 'from-orange-500 to-orange-600', link: '/bookings' },
    { label: 'Tuyến đường', value: stats.routes, icon: MapPin, gradient: 'from-blue-500 to-blue-600', link: '/routes' },
    { label: 'Xe khách', value: stats.coaches, icon: Bus, gradient: 'from-emerald-500 to-emerald-600', link: '/coaches' },
    { label: 'Chuyến xe', value: stats.trips, icon: Calendar, gradient: 'from-purple-500 to-purple-600', link: '/trips' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Chào mừng trở lại! Đây là tổng quan hệ thống.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Hệ thống hoạt động</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white w-6 h-6" />
                </div>
                <ArrowUpRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
                  {loading ? <span className="text-gray-600">...</span> : card.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Guide */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700/50">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-400" />
          Hướng dẫn nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-white">Tuyến đường</p>
              <p className="text-sm text-gray-400 mt-0.5">Tạo các tuyến (VD: HN → HP)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-white">Xe khách</p>
              <p className="text-sm text-gray-400 mt-0.5">Thêm xe với biển số, số ghế</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-white">Chuyến xe</p>
              <p className="text-sm text-gray-400 mt-0.5">Tạo chuyến từ tuyến + xe + giá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} />
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link to="/routes" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group">
              <MapPin className="mx-auto mb-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Thêm tuyến</span>
            </Link>
            <Link to="/coaches" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group">
              <Bus className="mx-auto mb-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Thêm xe</span>
            </Link>
            <Link to="/trips" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group">
              <Calendar className="mx-auto mb-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Tạo chuyến</span>
            </Link>
            <Link to="/trips" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group">
              <Ticket className="mx-auto mb-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Xem vé</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
