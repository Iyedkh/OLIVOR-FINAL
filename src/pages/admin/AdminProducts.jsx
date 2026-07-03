import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Upload, Trash } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const AdminProducts = () => {
  const { products, createProduct, updateProduct, deleteProduct, token, categories } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [formState, setFormState] = useState({
    title: '',
    price: '',
    description: '',
    volume: '',
    countInStock: '',
    region: '',
    category: '',
    images: []
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({
      title: '',
      price: '',
      description: '',
      volume: '500ml',
      countInStock: '10',
      region: 'Tunisia',
      category: categories && categories.length > 0 ? categories[0]._id : '',
      images: []
    });
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      title: product.title || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      volume: product.volume || '',
      countInStock: product.countInStock ? product.countInStock.toString() : '0',
      region: product.region || '',
      category: product.category?._id || product.category || '',
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])
    });
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert(result.message || 'Failed to delete product');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Append all uploaded images.
      setFormState((prev) => {
        const newImages = [...(prev.images || []), ...data.urls];
        return {
          ...prev,
          images: newImages,
        };
      });
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormState((prev) => {
      const newImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleSetMainImage = (imageUrl) => {
    setFormState((prev) => {
      const filtered = (prev.images || []).filter(url => url !== imageUrl);
      return {
        ...prev,
        images: [imageUrl, ...filtered],
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title: formState.title,
      price: parseFloat(formState.price) || 0,
      description: formState.description || 'Premium Tunisian Olive Oil',
      volume: formState.volume,
      countInStock: parseInt(formState.countInStock) || 0,
      region: formState.region,
      category: formState.category,
      images: formState.images && formState.images.length > 0 ? formState.images : ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5']
    };

    if (editingProduct) {
      const result = await updateProduct(editingProduct._id || editingProduct.id, productData);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to update product');
      }
    } else {
      const result = await createProduct(productData);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to create product');
      }
    }
  };

  const filteredProducts = (products || []).filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    (p.region && p.region.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Product Catalog
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Add, edit, or remove catalog item definitions.
            </p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg transition-transform hover:scale-105 active:scale-95 text-xs uppercase font-bold tracking-widest shadow-lg shadow-primary/10 focus:outline-none"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center bg-surface p-2 rounded-2xl border border-outline-variant/30 shadow-sm max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant h-5 w-5 pointer-events-none" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-on-surface font-body-md placeholder:text-outline-variant text-sm focus:ring-0" 
              placeholder="Search products by title or region..." 
              type="text" 
            />
          </div>
        </div>

        {/* Product List Table */}
        <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Size</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Region</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                {filteredProducts.map((product) => {
                  const productId = product._id || product.id;
                  return (
                    <tr key={productId} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6 select-none">
                        <div className="w-12 h-16 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 p-2 flex items-center justify-center">
                          <img className="max-h-full max-w-full object-contain" alt={product.title} src={product.images && product.images.length > 0 ? product.images[0] : product.image} />
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-primary">{product.title}</td>
                      <td className="py-4 px-6 font-bold text-secondary">${(product.price || 0).toFixed(2)}</td>
                      <td className="py-4 px-6">{product.volume}</td>
                      <td className="py-4 px-6">
                        {(product.countInStock || 0) <= 5 ? (
                          <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase">
                            <AlertTriangle className="h-4 w-4 shrink-0" /> Low ({product.countInStock || 0})
                          </span>
                        ) : (
                          <span className="text-on-surface-variant font-semibold">{product.countInStock || 0} units</span>
                        )}
                      </td>
                      <td className="py-4 px-6">{product.region}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-3 justify-end">
                          <button 
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 hover:bg-surface-container text-outline hover:text-primary rounded-lg transition-colors focus:outline-none"
                            aria-label="Edit"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(productId)}
                            className="p-2 hover:bg-red-500/10 text-outline hover:text-red-600 rounded-lg transition-colors focus:outline-none"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal (Framer Motion Drawer) */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-full max-w-md bg-surface h-screen border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-2xl overflow-y-auto text-left text-on-surface"
              >
                <div>
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/20 select-none">
                    <h3 className="font-headline-md text-headline-md text-primary text-xl font-bold font-serif">
                      {editingProduct ? 'Edit Catalog Item' : 'New Catalog Item'}
                    </h3>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 text-outline-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} id="productForm" className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Product Title</label>
                      <input 
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                        placeholder="Chemlali Gold" 
                        required 
                        type="text" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Description</label>
                      <textarea 
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm min-h-[80px]" 
                        placeholder="A robust, intense olive oil..." 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Price (USD)</label>
                        <input 
                          value={formState.price}
                          onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                          placeholder="48.00" 
                          required 
                          type="number" 
                          step="0.01"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Inventory Stock</label>
                        <input 
                          value={formState.countInStock}
                          onChange={(e) => setFormState({ ...formState, countInStock: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                          placeholder="100" 
                          required 
                          type="number" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Volume / Size</label>
                        <input 
                          value={formState.volume}
                          onChange={(e) => setFormState({ ...formState, volume: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                          placeholder="500ml" 
                          required 
                          type="text" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Grove Region</label>
                        <input 
                          value={formState.region}
                          onChange={(e) => setFormState({ ...formState, region: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                          placeholder="Tunisian Sahel" 
                          required 
                          type="text" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Category</label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Image Upload Area */}
                    <div className="flex flex-col gap-3 pt-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline flex justify-between">
                        <span>Product Images</span>
                        {uploading && <span className="text-secondary animate-pulse">Uploading...</span>}
                      </label>
                      
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all">
                          <div className="flex flex-col items-center justify-center pt-2">
                            <Upload className="h-6 w-6 text-outline-variant mb-1" />
                            <p className="text-xs text-outline-variant font-light">Click to upload multiple images</p>
                          </div>
                          <input 
                            type="file" 
                            multiple 
                            onChange={handleImageUpload} 
                            disabled={uploading}
                            className="hidden" 
                            accept="image/*"
                          />
                        </label>
                      </div>

                      {uploadError && (
                        <p className="text-red-500 text-xs font-semibold">{uploadError}</p>
                      )}

                      {/* Uploaded Images List */}
                      {formState.images && formState.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          {formState.images.map((url, idx) => {
                            const isMain = idx === 0;
                            return (
                              <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border p-1 bg-white flex items-center justify-center group ${isMain ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30'}`}>
                                <img src={url} alt={`upload-${idx}`} className="max-h-full max-w-full object-contain" />
                                
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all">
                                  {!isMain && (
                                    <button 
                                      type="button"
                                      onClick={() => handleSetMainImage(url)}
                                      className="bg-white/90 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold hover:bg-white"
                                    >
                                      Main
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="bg-red-600/90 text-white p-1 rounded hover:bg-red-600"
                                    aria-label="Remove image"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {isMain && (
                                  <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1 rounded uppercase tracking-wide font-bold scale-90 origin-top-left">
                                    Main
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                <div className="border-t border-outline-variant/20 pt-6 flex gap-4 mt-8">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-outline-variant hover:border-on-surface text-outline hover:text-on-surface rounded-lg transition-colors font-semibold uppercase text-xs tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    form="productForm"
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider shadow"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
