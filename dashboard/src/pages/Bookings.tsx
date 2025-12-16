import { useState, useEffect } from 'react';
import { Ticket, Search, CheckCircle, XCircle, Clock, RefreshCw, X, User, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

interface Booking {
  id: number;
  bookingCode: string;
  departure: string;
  destination: string;
  departureTime: string;
  seatNumbers: string[];
  totalPrice: number;
  status: string;
  passengerName: string;
  passengerPhone: string;
  createdAt: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [quickSearch, setQuickSearch] = useState('');
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    
    try {
      const res = await api.get(`/admin/bookings/search/${quickSearch.trim()}`);
      setSearchResult(res.data);
    } catch (err: any) {
      setSearchError(err.response?.data?.message || 'Không tìm thấy vé');
    } finally {
      setSearching(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Đã xác nhận</span>;
      case 'PAID':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> Chờ xác nhận</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Đã hủy</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> Chờ thanh toán</span>;
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
                       b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
                       b.passengerPhone.includes(search);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="text-orange-400" /> Quản lý đặt vé
          </h1>
          <p className="text-gray-400 mt-1">Xem và quản lý tất cả đơn đặt vé</p>
        </div>
        <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors">
          <RefreshCw size={18} /> Làm mới
        </button>
      </div>

      {/* Quick Search by Booking Code */}
      <form onSubmit={handleQuickSearch} className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl p-4 border border-blue-500/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-blue-400 text-sm font-medium mb-1 block">🔍 Tra cứu nhanh theo mã vé</label>
            <div className="relative">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="text"
                placeholder="Nhập mã vé (VD: CB12345678)"
                value={quickSearch}
                onChange={e => setQuickSearch(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-blue-500/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching || !quickSearch.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 self-end"
          >
            {searching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Tra cứu
          </button>
        </div>
        
        {/* Search Result */}
        {searchError && (
          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {searchError}
          </div>
        )}
        
        {searchResult && (
          <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700 relative">
            <button
              onClick={() => { setSearchResult(null); setQuickSearch(''); }}
              className="absolute top-3 right-3 p-1 hover:bg-gray-700 rounded-lg transition"
            >
              <X size={18} className="text-gray-400" />
            </button>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xl font-bold text-white font-mono">{searchResult.bookingCode}</span>
              {getStatusBadge(searchResult.status)}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={16} className="text-blue-400" />
                  <span className="font-medium">{searchResult.passengerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone size={16} className="text-green-400" />
                  <span>{searchResult.passengerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} className="text-orange-400" />
                  <span>{searchResult.departure} → {searchResult.destination}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={16} className="text-purple-400" />
                  <span>{format(new Date(searchResult.departureTime), 'HH:mm - dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Ticket size={16} className="text-cyan-400" />
                  <span>Ghế: {searchResult.seatNumbers.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CreditCard size={16} className="text-yellow-400" />
                  <span className="font-bold text-orange-400">{formatPrice(searchResult.totalPrice)}</span>
                </div>
              </div>
            </div>
            
            {searchResult.status === 'PAID' && (
              <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                <button
                  onClick={() => { updateStatus(searchResult.id, 'CONFIRMED'); setSearchResult(null); setQuickSearch(''); }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <CheckCircle size={16} /> Xác nhận vé
                </button>
                <button
                  onClick={() => { updateStatus(searchResult.id, 'CANCELLED'); setSearchResult(null); setQuickSearch(''); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <XCircle size={16} /> Hủy vé
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Lọc theo mã vé, tên, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Chờ thanh toán</option>
          <option value="PAID">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Tổng đơn</p>
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Chờ thanh toán</p>
          <p className="text-2xl font-bold text-yellow-400">{bookings.filter(b => b.status === 'PENDING').length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-blue-400">{bookings.filter(b => b.status === 'PAID').length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green-400">{bookings.filter(b => b.status === 'CONFIRMED').length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Đã hủy</p>
          <p className="text-2xl font-bold text-red-400">{bookings.filter(b => b.status === 'CANCELLED').length}</p>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Ticket size={48} className="mx-auto mb-4 opacity-50" />
          <p>Chưa có đơn đặt vé nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-bold text-white">{booking.bookingCode}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p className="text-blue-400 font-medium">
                    {booking.departure} → {booking.destination}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>🕐 {format(new Date(booking.departureTime), 'HH:mm dd/MM/yyyy')}</span>
                    <span>💺 {booking.seatNumbers.join(', ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>👤 {booking.passengerName}</span>
                    <span>📞 {booking.passengerPhone}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-400">{formatPrice(booking.totalPrice)}</p>
                    <p className="text-xs text-gray-500">Đặt lúc: {format(new Date(booking.createdAt), 'HH:mm dd/MM')}</p>
                  </div>
                  
                  {booking.status === 'PAID' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Xác nhận
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'CANCELLED')}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <XCircle size={14} /> Hủy
                      </button>
                    </div>
                  )}
                  {booking.status === 'PENDING' && (
                    <span className="text-yellow-400 text-sm">Chưa thanh toán</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
