import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Bus, Users, Sparkles } from 'lucide-react';
import api from '../api/axios';

interface Coach {
  id: number;
  licensePlate: string;
  type: string;
  totalSeats: number;
  description: string;
}

export default function Coaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [form, setForm] = useState({ licensePlate: '', type: 'STANDARD', totalSeats: '45', description: '' });

  useEffect(() => { fetchCoaches(); }, []);

  const fetchCoaches = async () => {
    try {
      const res = await api.get('/admin/coaches');
      setCoaches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch coaches:', err);
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (coach?: Coach) => {
    if (coach) {
      setEditing(coach);
      setForm({
        licensePlate: coach.licensePlate,
        type: coach.type,
        totalSeats: coach.totalSeats.toString(),
        description: coach.description || ''
      });
    } else {
      setEditing(null);
      setForm({ licensePlate: '', type: 'STANDARD', totalSeats: '45', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, totalSeats: Number(form.totalSeats) };
    try {
      if (editing) {
        await api.put(`/admin/coaches/${editing.id}`, data);
      } else {
        await api.post('/admin/coaches', data);
      }
      setShowModal(false);
      fetchCoaches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa xe này?')) return;
    try {
      await api.delete(`/admin/coaches/${id}`);
      fetchCoaches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý xe khách</h1>
          <p className="text-gray-400 mt-1">{coaches.length} xe</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} /> Thêm xe
        </button>
      </div>

      {coaches.length === 0 ? (
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bus size={32} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Chưa có xe nào</h3>
          <p className="text-gray-400 mb-4">Bắt đầu bằng cách thêm xe đầu tiên</p>
          <button onClick={() => openModal()} className="btn-primary px-6 py-2.5">
            <Plus size={18} className="inline mr-2" /> Thêm xe
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coaches.map((coach, index) => (
            <div 
              key={coach.id} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  coach.type === 'VIP' 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                }`}>
                  <Bus size={22} className="text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  coach.type === 'VIP' 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {coach.type === 'VIP' && <Sparkles size={12} />}
                  {coach.type}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{coach.licensePlate}</h3>
              
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Users size={16} />
                <span>{coach.totalSeats} ghế</span>
              </div>

              {coach.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{coach.description}</p>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                <button 
                  onClick={() => openModal(coach)} 
                  className="flex-1 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Sửa
                </button>
                <button 
                  onClick={() => handleDelete(coach.id)} 
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Xóa
                </button>
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
              <h2 className="text-lg font-bold text-white">{editing ? 'Sửa xe' : 'Thêm xe mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Biển số *</label>
                <input 
                  value={form.licensePlate} 
                  onChange={e => setForm({ ...form, licensePlate: e.target.value })} 
                  className="input-modern" 
                  placeholder="VD: 29A-12345"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại xe *</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })} 
                  className="input-modern"
                >
                  <option value="STANDARD">🚌 Xe thường</option>
                  <option value="VIP">⭐ Xe VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số ghế *</label>
                <input 
                  type="number" 
                  value={form.totalSeats} 
                  onChange={e => setForm({ ...form, totalSeats: e.target.value })} 
                  className="input-modern" 
                  placeholder="45"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
                <input 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  className="input-modern" 
                  placeholder="VD: Xe giường nằm cao cấp"
                />
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
