'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Package, Truck, DollarSign, Calendar, Edit, Trash2, X } from 'lucide-react';
import { InventoryEntry } from '@/lib/data';

export default function InventoryPage() {
  const [inventoryEntries, setInventoryEntries] = useState<InventoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<InventoryEntry | null>(null);

  const categories = ['Tümü', 'Ahşap', 'Kesici Takım', 'Aksesuar'];

  useEffect(() => {
    fetchInventoryEntries();
  }, []);

  const fetchInventoryEntries = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventoryEntries(data);
    } catch (error) {
      console.error('Error fetching inventory entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = inventoryEntries.filter(entry => {
    const matchesSearch = entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.supplierLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.supplierContact.includes(searchTerm) ||
                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteEntry = async (id: number) => {
    if (confirm('Bu stok girişini silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/inventory/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setInventoryEntries(inventoryEntries.filter(entry => entry.id !== id));
        }
      } catch (error) {
        console.error('Error deleting inventory entry:', error);
      }
    }
  };

  const handleSaveEntry = async (entryData: Omit<InventoryEntry, 'id'>) => {
    try {
      if (editingEntry) {
        const response = await fetch(`/api/inventory/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        if (response.ok) {
          const updatedEntry = await response.json();
          setInventoryEntries(inventoryEntries.map(e => e.id === editingEntry.id ? updatedEntry : e));
        }
      } else {
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        if (response.ok) {
          const newEntry = await response.json();
          setInventoryEntries([...inventoryEntries, newEntry]);
        }
      }
      setShowAddModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving inventory entry:', error);
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

  const calculateTotalCost = (quantity: number, unitPrice: number, shippingCost: number) => {
    return (quantity * unitPrice) + shippingCost;
  };

  const getTotalInventoryValue = () => {
    return inventoryEntries.reduce((total, entry) => total + entry.totalCost + entry.shippingCost, 0);
  };

  const getTotalEntries = () => {
    return inventoryEntries.length;
  };

  const getTotalQuantity = () => {
    return inventoryEntries.reduce((total, entry) => total + entry.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stok Girişi</h1>
          <p className="text-gray-600 mt-2">Yeni ürün girişi ve stok takibi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Yeni Stok Girişi</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Giriş</p>
              <p className="text-2xl font-semibold text-gray-900">{getTotalEntries()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Miktar</p>
              <p className="text-2xl font-semibold text-gray-900">{getTotalQuantity()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getTotalInventoryValue())}</p>
            </div>
          </div>
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
                placeholder="Ürün, tedarikçi, konum veya not ara..."
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
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-600">Stok girişleri yükleniyor...</div>
        </div>
      )}

      {/* Inventory Entries Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tedarikçi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birim Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nakliye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Maliyet
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.productName}</div>
                      <div className="text-sm text-gray-500">{entry.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.supplier}</div>
                      <div className="text-sm text-gray-500">{entry.supplierLocation}</div>
                      <div className="text-sm text-gray-500">{entry.supplierContact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.quantity} adet
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(entry.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(entry.shippingCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(entry.totalCost + entry.shippingCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.entryDate)}
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

      {/* Add/Edit Inventory Entry Modal */}
      {(showAddModal || editingEntry) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingEntry ? 'Stok Girişi Düzenle' : 'Yeni Stok Girişi'}
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEntry?.productName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    defaultValue={editingEntry?.category || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Ahşap">Ahşap</option>
                    <option value="Kesici Takım">Kesici Takım</option>
                    <option value="Aksesuar">Aksesuar</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tedarikçi Adı
                </label>
                <input
                  type="text"
                  defaultValue={editingEntry?.supplier || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tedarikçi Konumu
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEntry?.supplierLocation || ''}
                    placeholder="Örn: İstanbul, Merter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEntry?.supplierContact || ''}
                    placeholder="Örn: 0532 123 45 67"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    defaultValue={editingEntry?.quantity || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birim Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingEntry?.unitPrice || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nakliye Ücreti (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingEntry?.shippingCost || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giriş Tarihi
                </label>
                <input
                  type="date"
                  defaultValue={editingEntry?.entryDate || ''}
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
                  placeholder="Ürün hakkında notlar, kalite bilgileri vb."
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
