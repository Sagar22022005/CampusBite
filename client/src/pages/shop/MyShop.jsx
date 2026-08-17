import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import StarRating from '../../components/StarRating';
import { Store, Save, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

const MyShop = () => {
  const [shop, setShop] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('IIT Indore Campus');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyShop();
  }, []);

  const fetchMyShop = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shops/my/shop');
      if (res.data.shop) {
        setShop(res.data.shop);
        setName(res.data.shop.name);
        setCategory(res.data.shop.category);
        setDescription(res.data.shop.description || '');
        setLocation(res.data.shop.location || 'IIT Indore Campus');
        setImageUrl(res.data.shop.imageType === 'url' ? res.data.shop.image : '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('location', location);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const res = await api.post('/shops/my/shop', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShop(res.data.shop);
      setSuccess('Shop profile saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <Store className="w-7 h-7 text-orange-500" />
          My Campus Shop Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure your canteen/shop information, banner image, and campus location
        </p>
      </div>

      {shop && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-16 h-16 object-cover rounded-2xl border border-slate-100"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">{shop.name}</h2>
              <StarRating rating={shop.rating} numRatings={shop.numRatings} />
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
              shop.isOpen
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shop / Canteen Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. APJ Canteen / VSB Food Court"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
              >
                <option value="Food">🍔 Food (Meals, Canteen, Snacks)</option>
                <option value="Groceries">🛒 Groceries (Daily Essentials, Dairy)</option>
                <option value="Fruits">🍎 Fruits (Fresh Fruits & Juices)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Campus Location / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Near APJ Hostel Block A / VSB Central Ground"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Specialities
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hot authentic chicken biryani, paneer meals, midnight maggi and cold coffees."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          {/* Image Uploader Component */}
          <div className="pt-2">
            <ImageUploader
              currentImage={shop?.image}
              urlValue={imageUrl}
              onUrlChange={(val) => {
                setImageUrl(val);
                setImageFile(null);
              }}
              onFileSelect={(file) => {
                setImageFile(file);
                setImageUrl('');
              }}
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Profile...' : 'Save Shop Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyShop;
