'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, Calendar, Receipt, X } from 'lucide-react';
import { CostEntry } from '@/lib/data';

export default function CostsPage() {
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CostEntry | null>(null);

  const categories = ['Tümü', 'Malzeme', 'Kesici Takım', 'Elektrik', 'Bakım', 'Gelir'];
  const types = ['Tümü', 'expense', 'income'];

  useEffect(() => {
    fetchCostEntries();
  }, []);

  const fetchCostEntries = async () => {
    try {
      const response = await fetch('/api/costs');
      const data = await response.json();
      setCostEntries(data);
    } catch (error) {
      console.error('Error fetching cost entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = costEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || entry.category === selectedCategory;
    const matchesType = selectedType === 'Tümü' || entry.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDeleteEntry = async (id: number) => {
    if (confirm('Bu maliyet kaydını silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/costs/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setCostEntries(costEntries.filter(entry => entry.id !== id));
        }
      } catch (error) {
        console.error('Error deleting cost entry:', error);
      }
    }
  };

  const handleSaveEntry = async (entryData: Omit<CostEntry, 'id'>) => {
    try {
      if (editingEntry) {
        const response = await fetch(`/api/costs/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        if (response.ok) {
          const updatedEntry = await response.json();
          setCostEntries(costEntries.map(e => e.id === editingEntry.id ? updatedEntry : e));
        }
      } else {
        const response = await fetch('/api/costs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        if (response.ok) {
          const newEntry = await response.json();
          setCostEntries([...costEntries, newEntry]);
        }
      }
      setShowAddModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving cost entry:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getTotalIncome = () => {
    return costEntries
      .filter(entry => entry.type === 'income')
      .reduce((total, entry) => total + entry.amount, 0);
  };

  const getTotalExpenses = () => {
    return costEntries
      .filter(entry => entry.type === 'expense')
      .reduce((total, entry) => total + entry.amount, 0);
  };

  const getNetProfit = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: { income: number; expense: number } } = {};
    
    costEntries.forEach(entry => {
      if (!totals[entry.category]) {
        totals[entry.category] = { income: 0, expense: 0 };
      }
      if (entry.type === 'income') {
        totals[entry.category].income += entry.amount;
      } else {
        totals[entry.category].expense += entry.amount;
      }
    });
    
    return totals;
  };

  const categoryTotals = getCategoryTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maliyetler</h1>
          <p className="text-gray-600 mt-2">Maliyet ve harcama takip sistemi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Yeni Kayıt</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(getTotalIncome())}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(getTotalExpenses())}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getNetProfit() >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Kar/Zarar</p>
              <p className={`text-2xl font-semibold ${getNetProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(getNetProfit())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazında Özet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([category, totals]) => (
            <div key={category} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gelir:</span>
                  <span className="text-green-600 font-medium">{formatCurrency(totals.income)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gider:</span>
                  <span className="text-red-600 font-medium">{formatCurrency(totals.expense)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-1">
                  <span className="text-gray-600">Net:</span>
                  <span className={`font-medium ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totals.income - totals.expense)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Maliyet kaydı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'Tümü' ? 'Tüm Türler' : 
                   type === 'expense' ? 'Gider' : 'Gelir'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-600">Maliyet kayıtları yükleniyor...</div>
        </div>
      )}

      {/* Cost Entries Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tedarikçi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.description}</div>
                      {entry.notes && (
                        <div className="text-sm text-gray-500">{entry.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.type === 'income' ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.supplier || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add/Edit Cost Entry Modal */}
      {(showAddModal || editingEntry) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingEntry ? 'Maliyet Kaydı Düzenle' : 'Yeni Maliyet Kaydı'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  defaultValue={editingEntry?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    defaultValue={editingEntry?.category || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Malzeme">Malzeme</option>
                    <option value="Kesici Takım">Kesici Takım</option>
                    <option value="Elektrik">Elektrik</option>
                    <option value="Bakım">Bakım</option>
                    <option value="Gelir">Gelir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tür
                  </label>
                  <select
                    defaultValue={editingEntry?.type || 'expense'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="expense">Gider</option>
                    <option value="income">Gelir</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutar (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={editingEntry?.amount || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tedarikçi (Opsiyonel)
                </label>
                <input
                  type="text"
                  defaultValue={editingEntry?.supplier || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  defaultValue={editingEntry?.date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <textarea
                  defaultValue={editingEntry?.notes || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingEntry ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
