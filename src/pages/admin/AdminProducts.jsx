import React, { useState } from 'react';
import { motion as dMotion, AnimatePresence as dAnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const initialProducts = [
  { id: 'reserve-collection', title: 'Reserve Collection', price: 48.00, size: '500ml', stock: 124, region: 'Tunisia', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ByUjGacuLxWtbDxcz4kGpUSx7s01qJl4bI33eIxuKBrwC76UFi2MgK_xviAlXB2_mM3HKzLcbcD6IXwo6k3Nm5EElOq0YtkV5ed6S1Jiy7V6BEV2C6n1cKVZ3E1EyLmxw0iL4Zp6o9S4oTSGGJZzoHDsKrLTrAlcJSV_zCEOPZ3F-icrieUEaU7Qt5OIOH6afwUkCRR8JfZR69AzXfLflx6_hBvijVE0Qr4tlUYtr8OcNLC5ZMKrMg' },
  { id: 'chemlali-gold', title: 'Chemlali Gold', price: 64.00, size: '750ml', stock: 89, region: 'Sahel', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw8F6qi80OSwtec9Z_SY8xz2Grx2K5ejvwAkNiouUR13bpAFez6UTyb8HCfugcpUAUh--xR0JBzXujEzG3e5xnFehmG1FB_da45Bm8A-Ij7EBmPYyg8iB4JJuh3vSOCdWG28WgIByAOADmC13e5LhBqOyjMR4-9zoKO5lDxFscyXd-Q0xqzNve9Is49DFGxvtBOwjJL9oaFEzoAqXeRZ68ZWDt3sfInXp6-VwYXGL2tfRlsq2VweFfwA' },
  { id: 'heritage-trio', title: 'Heritage Trio Set', price: 120.00, size: '3x250ml', stock: 45, region: 'Multi-Region', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBujlZkatz7C6kyHcSKXMlMnC8w0F28U3XmwRh7Jv_SUd2UpinoitWpt_9Dl7bsGGUo1j7aB_ypeKlmES7IbFelzjv8wflbHLynnHhTwTLuusXTxmEoviZFcI3-fxEl4n_-H-_ojNl4q_mfMGeW-qIyrckJGHdPpim4bwheSZeiYYsnVA8fINwNohnpYLaxXM-9tZauG0bZCTk6DXLw1N3rQDhxlov4DK00x74gFXwTK0Cs0F9Hmy7yUQ' },
  { id: 'carthage-amphora', title: 'Carthage Amphora', price: 185.00, size: '1000ml', stock: 12, region: 'Cap Bon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF-fCq1OG_kxJ4F6N97IKiMLF_gloGNEMHBsz78RyvnAqlDmNZFSEIsK9CE2XsHJy51hDUnzXseeWjOvyhjLmR8BpUncR4dxUQXEM5taqNi6Oyii4mKzASf73prSI57PFe9m-O_UpBDCBcIK4_TNJ3UszzWc8Hgp4aH8JgtMFhO6E1ORaevBbG6EKVMo5F6wXmnjH2dksY_dUtxALvkCmg3Qsyp500rMefkvDf2_ViyBUEr5nzpw5qzw' }
];

const AdminProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    price: '',
    size: '',
    stock: '',
    region: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ByUjGacuLxWtbDxcz4kGpUSx7s01qJl4bI33eIxuKBrwC76UFi2MgK_xviAlXB2_mM3HKzLcbcD6IXwo6k3Nm5EElOq0YtkV5ed6S1Jiy7V6BEV2C6n1cKVZ3E1EyLmxw0iL4Zp6o9S4oTSGGJZzoHDsKrLTrAlcJSV_zCEOPZ3F-icrieUEaU7Qt5OIOH6afwUkCRR8JfZR69AzXfLflx6_hBvijVE0Qr4tlUYtr8OcNLC5ZMKrMg'
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({ title: '', price: '', size: '', stock: '', region: '', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ByUjGacuLxWtbDxcz4kGpUSx7s01qJl4bI33eIxuKBrwC76UFi2MgK_xviAlXB2_mM3HKzLcbcD6IXwo6k3Nm5EElOq0YtkV5ed6S1Jiy7V6BEV2C6n1cKVZ3E1EyLmxw0iL4Zp6o9S4oTSGGJZzoHDsKrLTrAlcJSV_zCEOPZ3F-icrieUEaU7Qt5OIOH6afwUkCRR8JfZR69AzXfLflx6_hBvijVE0Qr4tlUYtr8OcNLC5ZMKrMg' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      title: product.title,
      price: product.price.toString(),
      size: product.size,
      stock: product.stock.toString(),
      region: product.region,
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedPrice = parseFloat(formState.price) || 0;
    const updatedStock = parseInt(formState.stock) || 0;

    if (editingProduct) {
      // Edit
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title: formState.title,
            price: updatedPrice,
            size: formState.size,
            stock: updatedStock,
            region: formState.region,
            image: formState.image
          };
        }
        return p;
      }));
    } else {
      // Add
      const newId = formState.title.toLowerCase().replace(/\s+/g, '-');
      const newProduct = {
        id: newId,
        title: formState.title,
        price: updatedPrice,
        size: formState.size,
        stock: updatedStock,
        region: formState.region,
        image: formState.image
      };
      setProducts(prev => [...prev, newProduct]);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.region.toLowerCase().includes(search.toLowerCase())
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-6 select-none">
                      <div className="w-12 h-16 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 p-2 flex items-center justify-center">
                        <img className="h-full w-auto object-contain" alt={product.title} src={product.image} />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-primary">{product.title}</td>
                    <td className="py-4 px-6 font-bold text-secondary">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6">{product.size}</td>
                    <td className="py-4 px-6">
                      {product.stock <= 15 ? (
                        <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase">
                          <AlertTriangle className="h-4 w-4 shrink-0" /> Low ({product.stock})
                        </span>
                      ) : (
                        <span className="text-on-surface-variant font-semibold">{product.stock} units</span>
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
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/10 text-outline hover:text-red-600 rounded-lg transition-colors focus:outline-none"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal (Framer Motion Drawer) */}
        <dAnimatePresence>
          {isModalOpen && (
            <dMotion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
            >
              <dMotion.div 
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

                  <form onSubmit={handleFormSubmit} id="productForm" className="space-y-6">
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Volume / Size</label>
                      <input 
                        value={formState.size}
                        onChange={(e) => setFormState({ ...formState, size: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                        placeholder="500ml" 
                        required 
                        type="text" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Inventory Stock</label>
                      <input 
                        value={formState.stock}
                        onChange={(e) => setFormState({ ...formState, stock: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                        placeholder="100" 
                        required 
                        type="number" 
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
              </dMotion.div>
            </dMotion.div>
          )}
        </dAnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
