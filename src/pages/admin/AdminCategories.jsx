import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Tag, Info } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';

const AdminCategories = () => {
  const { categories, loadingCategories, createCategory, updateCategory, deleteCategory } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    description: ''
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormState({
      name: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormState({
      name: category.name || '',
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      const result = await deleteCategory(id);
      if (!result.success) {
        alert(result.message || 'Failed to delete category');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      alert('Category name is required');
      return;
    }

    const categoryData = {
      name: formState.name.trim(),
      description: formState.description.trim()
    };

    if (editingCategory) {
      const result = await updateCategory(editingCategory._id, categoryData);
      if (result.success) {
        setIsModalOpen(false);
      }
    } else {
      const result = await createCategory(categoryData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  const filteredCategories = (categories || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Header Title */}
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Category Settings
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Configure dynamic collection categories for your luxury products catalog.
            </p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg transition-transform hover:scale-105 active:scale-95 text-xs uppercase font-bold tracking-widest shadow-lg shadow-primary/10 focus:outline-none"
          >
            <Plus className="h-4 w-4" /> Add Category
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
              placeholder="Search categories by name..." 
              type="text" 
            />
          </div>
        </div>

        {/* Category List Table */}
        <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-4 px-6 w-16">Icon</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Created On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                {loadingCategories ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-on-surface-variant font-light">
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-on-surface-variant font-light">
                      No categories found in the cellars.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => {
                    const catId = category._id;
                    const createdDate = category.createdAt 
                      ? new Date(category.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'N/A';
                    return (
                      <tr key={catId} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 select-none">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                            <Tag className="h-4.5 w-4.5" />
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-primary">{category.name}</td>
                        <td className="py-4 px-6 text-on-surface-variant max-w-sm truncate">{category.description || '—'}</td>
                        <td className="py-4 px-6 font-semibold text-outline">{createdDate}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-3 justify-end">
                            <button 
                              onClick={() => handleOpenEditModal(category)}
                              className="p-2 hover:bg-surface-container text-outline hover:text-primary rounded-lg transition-colors focus:outline-none"
                              aria-label="Edit"
                            >
                              <Edit2 className="h-4.5 w-4.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(catId, category.name)}
                              className="p-2 hover:bg-red-500/10 text-outline hover:text-red-600 rounded-lg transition-colors focus:outline-none"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-lg h-full bg-surface border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-2xl relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-3 py-1.5 rounded-full border border-secondary/20 select-none">
                        Category Editor
                      </span>
                      <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl mt-4 font-bold">
                        {editingCategory ? 'Edit Collection Category' : 'Create New Category'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors focus:outline-none border border-outline-variant/10"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form id="categoryForm" onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Category Name</label>
                      <input 
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                        placeholder="e.g. Reserve Estate, Special Infusion" 
                        required 
                        type="text" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Description</label>
                      <textarea 
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm min-h-[120px] resize-none" 
                        placeholder="Provide details about products in this category..." 
                      />
                    </div>

                    <div className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                        Setting clear names and descriptions helps shoppers navigate collections and enhances filtering experience.
                      </p>
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
                    form="categoryForm"
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider shadow"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
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

export default AdminCategories;
