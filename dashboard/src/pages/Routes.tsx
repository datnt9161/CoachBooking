import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, MapPin, ArrowRight, Clock, Navigation } from 'lucide-react';
import api from '../api/axios';

interface Route {
  id: number;
  departure: string;
  destination: string;
  distance: number;
  estimatedDuration: number;
}

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [form, setForm] = useState({ departure: '', destination: '', distance: '', estimatedDuration: '' });

  useEffect(() => { fetchRoutes(); }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/admin/routes');
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch routes:', err);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (route?: Route) => {
    if (route) {
      setEditing(route);
      setForm({
        departure: route.departure,
        destination: route.destination,
        distance: route.distance?.toString() || '',
        estimatedDuration: route.estimatedDuration?.toString() || ''
      });
    } else {
      setEditing(null);
      setForm({ departure: '', destination: '', distance: '', estimatedDuration: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      departure: form.departure,
      destination: form.destination,
      distance: form.distance ? Number(form.distance) : null,
      estimatedDuration: form.estimatedDuration ? Number(form.estimatedDuration) : null
    };
    try {
      if (editing) {
        await api.put(`/admin/routes/${editing.id}`, data);
      } else {
        await api.post('/admin/routes', data);
      }
      setShowModal(false);
      fetchRoutes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa tuyến đường này?')) return;
    try {
      await api.delete(`/admin/routes/${id}`);
      fetchRoutes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý tuyến đường</h1>
          <p className="text-gray-400 mt-1">{routes.length} tuyến đường</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Thêm tuyến
        </button>
      </div>

      {routes.length === 0 ? (
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Chưa có tuyến đường</h3>
          <p className="text-gray-400 mb-4">Bắt đầu bằng cách thêm tuyến đường đầu tiên</p>
          <button onClick={() => openModal()} className="btn-primary px-6 py-2.5">
            <Plus size={18} className="inline mr-2" /> Thêm tuyến
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {routes.map((route, index) => (
            <div 
              key={route.id} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-gray-600 transition-all animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Navigation size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-white">
                      <span>{route.departure}</span>
                      <ArrowRight size={18} className="text-blue-400" />
                      <span>{route.destination}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      {route.distance && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {route.distance} km
                        </span>
                      )}
                      {route.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {route.estimatedDuration} phút
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => openModal(route)} 
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> <span className="sm:hidden lg:inline">Sửa</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(route.id)} 
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> <span className="sm:hidden lg:inline">Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">{editing ? 'Sửa tuyến đường' : 'Thêm tuyến đường'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Điểm đi *</label>
                <input 
                  value={form.departure} 
                  onChange={e => setForm({ ...form, departure: e.target.value })} 
                  className="input-modern" 
                  placeholder="VD: Hà Nội"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Điểm đến *</label>
                <input 
                  value={form.destination} 
                  onChange={e => setForm({ ...form, destination: e.target.value })} 
                  className="input-modern" 
                  placeholder="VD: Hải Phòng"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Khoảng cách (km)</label>
                  <input 
                    type="number" 
                    value={form.distance} 
                    onChange={e => setForm({ ...form, distance: e.target.value })} 
                    className="input-modern" 
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Thời gian (phút)</label>
                  <input 
                    type="number" 
                    value={form.estimatedDuration} 
                    onChange={e => setForm({ ...form, estimatedDuration: e.target.value })} 
                    className="input-modern" 
                    placeholder="150"
                  />
                </div>
              </div>
              <button type="submit" className="w-full btn-primary py-3 mt-2">
                {editing ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
