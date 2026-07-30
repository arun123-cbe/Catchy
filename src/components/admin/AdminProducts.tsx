import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Upload, FileText, Check, Sparkles, Flame, Leaf, Tag, CheckCircle2, Image as ImageIcon, Download } from 'lucide-react';
import Papa from 'papaparse';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

const SAMPLE_CSV_CONTENT = `name,tagline,category,price,originalPrice,stock,reorderPoint,sku,description,benefits,ingredients,specialities,isBestSeller,isNewArrival,isOrganic,isSuperSaver,concernsHandled,image
"Radiant Rosehip Face Oil","100% Cold-Pressed Organic Botanical Oil","Beauty & Skincare",899,1199,45,10,"CS-SKIN-101","Nourishing organic facial oil enriched with natural antioxidants and essential fatty acids for a glowing complexion.","Hydrates deeply;Restores natural glow;Reduces fine lines","Rosehip Seed Oil;Vitamin E;Jojoba Oil;Rose Essential Oil","Organic;Dermatologist Tested;Cruelty-Free",true,false,true,false,"Dullness;Dry Skin;Fine Lines","https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
"Ashwagandha Stress Balance Elixir","Clinical Grade Adaptogenic Herb Extract","Health & Supplements",1299,1599,60,15,"CS-SUPP-202","Ayurvedic adaptogen formula designed to lower cortisol levels and promote calm focus and peaceful sleep.","Reduces cortisol & stress;Supports mental clarity;Promotes restful sleep","Organic KSM-66 Ashwagandha;Holy Basil;Piperine Extract","GMP Certified;100% Vegan;Gluten-Free",true,true,true,true,"Stress;Fatigue;Poor Sleep","https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
"Botanical Scalp Renewal Serum","Nourishing Rosemary & Tea Tree Tonic","Hair & Body",749,999,30,8,"CS-HAIR-303","Revitalizing scalp therapy that strengthens roots and prevents hair fall with active botanical extracts.","Strengthens roots;Reduces scalp itch;Promotes hair growth","Rosemary Leaf Oil;Tea Tree Oil;Biotin;Peppermint Extract","Paraben-Free;Sulfate-Free;Organic",false,true,true,false,"Hair Loss;Scalp Dryness","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"`;

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, bulkAddProducts, updateProduct, deleteProduct, formatPrice } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | 'All'>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // CSV / Excel Bulk Upload State
  const [bulkImportMode, setBulkImportMode] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [csvPreview, setCsvPreview] = useState<Omit<Product, 'id'>[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvError, setCsvError] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    tagline: '',
    category: categories[0] || 'Beauty & Skincare',
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 15,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: '',
    benefits: ['Deep hydration', 'Radiant skin complexion'],
    ingredients: ['Vitamin C', 'Hyaluronic Acid'],
    specialities: ['Dermatologist Tested', '100% Organic', 'Paraben Free'],
    isBestSeller: false,
    isNewArrival: true,
    isOrganic: true,
    isSuperSaver: false,
    stock: 50,
    reorderPoint: 15,
    sku: 'AG-PROD-001',
    concernsHandled: ['Dullness', 'Dry Skin']
  });

  const [specialityInput, setSpecialityInput] = useState('Dermatologist Tested, 100% Organic, Paraben Free');
  const [benefitsInput, setBenefitsInput] = useState('Deep hydration, Radiant skin complexion');
  const [concernsInput, setConcernsInput] = useState('Dullness, Dry Skin');

  const filtered = products.filter(p => {
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Handle local image file upload (converts to base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const newSku = `AG-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      name: '',
      tagline: '',
      category: categories[0] || 'Beauty & Skincare',
      price: 899,
      originalPrice: 1199,
      rating: 4.9,
      reviewCount: 1,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      description: 'Pure bio-active formula crafted to nourish and rejuvenate.',
      benefits: ['Promotes skin vitality', 'Restores natural barrier'],
      ingredients: ['Niacinamide', 'Botanical Extracts'],
      specialities: ['Sulfate Free', 'Cruelty Free', 'Dermatologist Tested'],
      isBestSeller: false,
      isNewArrival: true,
      isOrganic: true,
      isSuperSaver: false,
      stock: 40,
      reorderPoint: 10,
      sku: newSku,
      concernsHandled: ['Skin Balance', 'Wellness']
    });
    setSpecialityInput('Sulfate Free, Cruelty Free, Dermatologist Tested');
    setBenefitsInput('Promotes skin vitality, Restores natural barrier');
    setConcernsInput('Skin Balance, Wellness');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setSpecialityInput((p.specialities || []).join(', '));
    setBenefitsInput((p.benefits || []).join(', '));
    setConcernsInput((p.concernsHandled || []).join(', '));
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSpecialities = specialityInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedBenefits = benefitsInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedConcerns = concernsInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...formData,
      specialities: parsedSpecialities,
      benefits: parsedBenefits,
      concernsHandled: parsedConcerns
    };

    if (editingProduct) {
      updateProduct({ ...payload, id: editingProduct.id });
    } else {
      addProduct(payload);
    }
    setIsAddModalOpen(false);
  };

  // Helper to map parsed rows to Product objects
  const processParsedData = (rawData: any[]) => {
    try {
      const parsedProducts: Omit<Product, 'id'>[] = rawData.map((row: any, idx: number) => {
        if (!row.name || !row.price) {
          throw new Error(`Row ${idx + 1} is missing required fields (name, price)`);
        }

        return {
          name: row.name || 'Bulk Product',
          tagline: row.tagline || 'Premium wellness formula',
          category: row.category || 'Beauty & Skincare',
          price: parseFloat(row.price) || 499,
          originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : undefined,
          rating: parseFloat(row.rating) || 4.8,
          reviewCount: parseInt(row.reviewCount) || 10,
          image: row.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
          description: row.description || 'Natural organic formula.',
          benefits: row.benefits ? row.benefits.split(';').map((b: string) => b.trim()) : ['Nourishes skin'],
          ingredients: row.ingredients ? row.ingredients.split(';').map((i: string) => i.trim()) : ['Botanical oil'],
          specialities: row.specialities ? row.specialities.split(';').map((s: string) => s.trim()) : ['Organic', 'Dermatologist Tested'],
          isBestSeller: row.isBestSeller === 'true' || row.isBestSeller === '1' || row.isBestSeller === 'TRUE',
          isNewArrival: row.isNewArrival === 'true' || row.isNewArrival === '1' || row.isNewArrival === 'TRUE',
          isOrganic: row.isOrganic === 'true' || row.isOrganic === '1' || row.isOrganic === 'TRUE',
          isSuperSaver: row.isSuperSaver === 'true' || row.isSuperSaver === '1' || row.isSuperSaver === 'TRUE',
          stock: parseInt(row.stock) || 50,
          reorderPoint: parseInt(row.reorderPoint) || 10,
          sku: row.sku || `BULK-${Date.now()}-${idx}`,
          concernsHandled: row.concernsHandled ? row.concernsHandled.split(';').map((c: string) => c.trim()) : ['Glow', 'Vitality']
        };
      });

      setCsvPreview(parsedProducts);
      setCsvError('');
    } catch (err: any) {
      setCsvError(err.message || 'Error parsing product rows');
    }
  };

  // CSV Bulk File Parsing
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data);
      },
      error: (err) => {
        setCsvError(`CSV Read Error: ${err.message}`);
      }
    });
  };

  // Handle Pasted CSV / Excel Table Data
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setCsvError('Please paste CSV or Excel table data into the box first.');
      return;
    }

    setCsvError('');
    Papa.parse(pastedText.trim(), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setCsvError('No valid tabular rows found in pasted text.');
          return;
        }
        processParsedData(results.data);
      },
      error: (err) => {
        setCsvError(`Parse Error: ${err.message}`);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CatchyStore_Bulk_Products_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInsertSamplePastedData = () => {
    setPastedText(SAMPLE_CSV_CONTENT);
    setCsvError('');
  };

  const handleConfirmBulkUpload = () => {
    if (csvPreview.length > 0) {
      bulkAddProducts(csvPreview);
      setIsBulkModalOpen(false);
      setCsvPreview([]);
      setCsvFileName('');
      alert(`Successfully imported ${csvPreview.length} products!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Bulk Upload Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Product Catalog Management</h2>
          <p className="text-xs text-stone-500">Add products, upload pictures, set specialities & tags, or bulk import via CSV/Excel</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-stone-200"
            title="Download CSV / Excel Sample Template File"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download CSV Sheet Template</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Upload className="w-4 h-4 text-emerald-300" />
            Bulk CSV / Excel Upload
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Single Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search title, SKU or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['All', ...categories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-[10px] text-stone-500 font-bold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU & Category</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Specialities & Tags</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                  
                  <td className="p-4 flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                    <div>
                      <span className="font-bold text-stone-900 font-serif block">{prod.name}</span>
                      <span className="text-[10px] text-stone-400 line-clamp-1">{prod.tagline}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-stone-500 font-bold block">{prod.sku}</span>
                    <span className="text-[10px] text-stone-400">{prod.category}</span>
                  </td>

                  <td className="p-4 font-bold text-stone-900">
                    {formatPrice(prod.price)}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {prod.isBestSeller && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-600" /> Best Seller
                        </span>
                      )}
                      {prod.isSuperSaver && (
                        <span className="bg-rose-100 text-rose-900 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-rose-600" /> Super Saver
                        </span>
                      )}
                      {(prod.specialities || []).slice(0, 2).map((s, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-semibold px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-stone-800">
                    {prod.stock} units
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                        }}
                        className="p-2 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE PRODUCT ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 font-serif mb-4">
              {editingProduct ? 'Edit Formula Details' : 'Create New Product Formula'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold"
                  />
                </div>
              </div>

              {/* Upload Product Picture Section */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                  <span>Product Image Upload / URL</span>
                  <span className="text-[10px] text-stone-400 font-normal">Base64 file or Direct Link</span>
                </label>
                
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800"
                    placeholder="https://images.unsplash.com/..."
                  />
                  
                  <label className="px-3 py-2 rounded-xl bg-stone-900 text-white font-bold cursor-pointer hover:bg-stone-800 flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Pic</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                {formData.image && (
                  <div className="flex items-center gap-2 pt-1">
                    <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-stone-300" />
                    <span className="text-[11px] text-stone-500">Image loaded & ready</span>
                  </div>
                )}
              </div>

              {/* Specialities & Features Input */}
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                  <span>Speciality & Key Formula Features</span>
                  <span className="text-[10px] text-stone-400">Comma separated</span>
                </label>
                <input
                  type="text"
                  placeholder="Dermatologist Tested, 100% Organic, Paraben Free, SPF 50+"
                  value={specialityInput}
                  onChange={(e) => setSpecialityInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800"
                />
              </div>

              {/* Benefits Input */}
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Key Benefits (Comma Separated)</label>
                <input
                  type="text"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800"
                />
              </div>

              {/* Badge Toggles */}
              <div className="bg-stone-100 p-3 rounded-2xl border border-stone-200">
                <span className="block font-bold text-stone-700 uppercase mb-2">Collection Badge Tags</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer text-[11px] font-bold transition-all ${
                    formData.isBestSeller ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-white border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller || false}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="hidden"
                    />
                    <Flame className="w-3.5 h-3.5 text-amber-600" /> Best Seller
                  </label>

                  <label className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer text-[11px] font-bold transition-all ${
                    formData.isNewArrival ? 'bg-purple-100 border-purple-400 text-purple-900' : 'bg-white border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival || false}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="hidden"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> New Arrival
                  </label>

                  <label className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer text-[11px] font-bold transition-all ${
                    formData.isOrganic ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isOrganic || false}
                      onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                      className="hidden"
                    />
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> 100% Organic
                  </label>

                  <label className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer text-[11px] font-bold transition-all ${
                    formData.isSuperSaver ? 'bg-rose-100 border-rose-400 text-rose-900' : 'bg-white border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isSuperSaver || false}
                      onChange={(e) => setFormData({ ...formData, isSuperSaver: e.target.checked })}
                      className="hidden"
                    />
                    <Tag className="w-3.5 h-3.5 text-rose-600" /> Super Saver
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-md"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSV / EXCEL BULK UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsBulkModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-bold text-stone-900 font-serif">Bulk Product Upload via CSV / Excel</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Import multiple product SKUs at once by uploading a CSV file or pasting table data from Microsoft Excel / Google Sheets.
            </p>

            {/* Option Tabs */}
            <div className="flex border-b border-stone-200 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setBulkImportMode('file');
                  setCsvError('');
                }}
                className={`py-2.5 px-4 border-b-2 transition-all ${
                  bulkImportMode === 'file'
                    ? 'border-stone-900 text-stone-900 font-extrabold'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Option A: Upload CSV File
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkImportMode('paste');
                  setCsvError('');
                }}
                className={`py-2.5 px-4 border-b-2 transition-all ${
                  bulkImportMode === 'paste'
                    ? 'border-stone-900 text-stone-900 font-extrabold'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Option B: Copy & Paste CSV / Excel Table Data
              </button>
            </div>

            {/* Template Help & Download Box */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 rounded-2xl shadow-sm mb-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-extrabold text-amber-300 text-xs uppercase tracking-wider block">CSV / Excel Template Sheet</span>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Download the official template pre-formatted with required headers and example product rows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Sample Template (.csv)
                </button>
              </div>

              <div className="border-t border-stone-700/80 pt-2.5">
                <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">Required Column Headers:</span>
                <code className="block bg-black/40 text-emerald-300 p-2 rounded-xl text-[10px] font-mono overflow-x-auto border border-stone-700/50">
                  name,tagline,category,price,originalPrice,stock,reorderPoint,sku,description,benefits,ingredients,specialities,isBestSeller,isNewArrival,isOrganic,isSuperSaver,concernsHandled,image
                </code>
              </div>
            </div>

            {/* OPTION A: File Upload Area */}
            {bulkImportMode === 'file' && (
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center bg-stone-50/50 hover:bg-stone-100/50 transition-colors mb-4">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-stone-800">Select .CSV file from your computer</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileUpload}
                  className="mt-3 block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />
                {csvFileName && <p className="text-xs text-emerald-700 font-bold mt-2">File Loaded: {csvFileName}</p>}
                {csvError && <p className="text-xs text-rose-600 font-bold mt-2">{csvError}</p>}
              </div>
            )}

            {/* OPTION B: Copy & Paste CSV / Excel Table Data */}
            {bulkImportMode === 'paste' && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800 uppercase">
                    Paste Table Rows (Excel / CSV / Google Sheets)
                  </label>
                  <button
                    type="button"
                    onClick={handleInsertSamplePastedData}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Load Sample Template Data Into Box
                  </button>
                </div>
                <div>
                  <textarea
                    rows={6}
                    placeholder={`name,tagline,category,price,stock,sku\nRadiant Hair Serum,Bio-active hair oil,Hair & Body,899,40,CS-HAIR-101\nGlowing Skin Elixir,Organic face oil,Beauty & Skincare,1299,25,CS-SKIN-202`}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleParsePastedText}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    Parse & Preview Pasted Data
                  </button>

                  {pastedText && (
                    <button
                      type="button"
                      onClick={() => {
                        setPastedText('');
                        setCsvPreview([]);
                        setCsvError('');
                      }}
                      className="text-stone-400 hover:text-stone-600 text-xs font-medium"
                    >
                      Clear Box
                    </button>
                  )}
                </div>

                {csvError && <p className="text-xs text-rose-600 font-bold">{csvError}</p>}
              </div>
            )}

            {/* CSV Preview */}
            {csvPreview.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                  <span>Preview ({csvPreview.length} items parsed):</span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100 text-xs">
                  {csvPreview.map((item, i) => (
                    <div key={i} className="p-2.5 flex justify-between items-center bg-white">
                      <div>
                        <span className="font-bold text-stone-900">{item.name}</span>
                        <span className="text-[10px] text-stone-400 block">{item.category} • SKU: {item.sku}</span>
                      </div>
                      <span className="font-bold text-emerald-800">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConfirmBulkUpload}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  Import All {csvPreview.length} Products Now
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
