/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Check, 
  Clock, 
  Trash2, 
  Filter, 
  PlusCircle, 
  Package, 
  CheckSquare, 
  Square,
  Sparkles,
  Info
} from 'lucide-react';
import { ShoppingItem, ProductCategory } from '../types';
import { MOCK_PRESET_ANALYSES } from '../data';

interface ShoppingViewProps {
  items: ShoppingItem[];
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isBought'>) => void;
  onToggleBought: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export default function ShoppingView({ items, onAddItem, onToggleBought, onDeleteItem }: ShoppingViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningMessage, setScanningMessage] = useState<string>('');
  const [itemNameInput, setItemNameInput] = useState('');
  const [itemCategoryInput, setItemCategoryInput] = useState<ProductCategory>('Souvenir');
  const [itemDescInput, setItemDescInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Separate active and purchased items
  const activeItems = items.filter(item => !item.isBought);
  const purchasedItems = items.filter(item => item.isBought);

  // Search/Filters applied to all
  const filterByClass = (list: ShoppingItem[]) => {
    if (selectedFilter === 'all') return list;
    return list.filter(item => item.category === selectedFilter);
  };

  const displayedActive = filterByClass(activeItems);
  const displayedPurchased = filterByClass(purchasedItems);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Click / Manual Select File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  // Core file upload parsing, triggers simulated scan loading animation and creates item
  const handleUploadedFile = (file: File) => {
    // Convert to mock image URL for UI rendering
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImage(reader.result as string);
      triggerAIScan(file.name, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Trigger high-fidelity AI Analysis simulator
  const triggerAIScan = (fileName: string, imgDataUrl?: string) => {
    setIsScanning(true);
    
    // Pick a mock Japan item from database based on file keywords, or choose a random analysis entry
    let matchedItem = MOCK_PRESET_ANALYSES[Math.floor(Math.random() * MOCK_PRESET_ANALYSES.length)];
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes('eve') || lowerName.includes('medicine') || lowerName.includes('藥')) {
      matchedItem = MOCK_PRESET_ANALYSES[0]; // EVE
    } else if (lowerName.includes('suisai') || lowerName.includes('wash') || lowerName.includes('妝')) {
      matchedItem = MOCK_PRESET_ANALYSES[1]; // Suisai
    } else if (lowerName.includes('kitkat') || lowerName.includes('matcha') || lowerName.includes('抹茶') || lowerName.includes('餅')) {
      matchedItem = MOCK_PRESET_ANALYSES[2]; // Kitkat
    } else if (lowerName.includes('montbell') || lowerName.includes('shirt') || lowerName.includes('衣')) {
      matchedItem = MOCK_PRESET_ANALYSES[3]; // Montbell
    } else if (lowerName.includes('gyutan') || lowerName.includes('tongue') || lowerName.includes('牛舌')) {
      matchedItem = MOCK_PRESET_ANALYSES[4]; // Beef tongue
    }

    // Sequence of scanner steps for ultra-premium UX
    const messages = [
      '⚡ [AI] 正在啟動多尺度文字光學辨識 (OCR)...',
      '🔍 [AI] 正在分析包裝條碼與日文特徵標籤...',
      '🤖 [AI] 雙語特有物產標籤匹配率 98.6%：' + matchedItem.name
    ];

    setScanningMessage(messages[0]);
    
    setTimeout(() => {
      setScanningMessage(messages[1]);
    }, 700);

    setTimeout(() => {
      setScanningMessage(messages[2]);
    }, 1400);

    setTimeout(() => {
      setIsScanning(false);
      onAddItem({
        name: matchedItem.name,
        category: matchedItem.category as ProductCategory,
        description: matchedItem.description,
        image: imgDataUrl || undefined,
        originalPlaceholder: false
      });
      setCustomImage(null);
    }, 2100);
  };

  // Trigger scanning of preset items (useful if user doesn't have local sample photos)
  const triggerQuickPresetScan = (index: number) => {
    const preset = MOCK_PRESET_ANALYSES[index];
    setIsScanning(true);
    const messages = [
      '⚡ [AI] 正在連接東北專品高維光學特徵...',
      '🔍 [AI] 比對日本流通藥妝資料庫中...',
      '🎯 [AI] 精確匹配：' + preset.name
    ];

    setScanningMessage(messages[0]);
    setTimeout(() => setScanningMessage(messages[1]), 600);
    setTimeout(() => setScanningMessage(messages[2]), 1200);

    setTimeout(() => {
      setIsScanning(false);
      // Use standard high-quality placeholder illustrations for visual flair
      onAddItem({
        name: preset.name,
        category: preset.category as ProductCategory,
        description: preset.description,
        originalPlaceholder: false
      });
    }, 1800);
  };

  // Manual fast add item by filling form
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemNameInput.trim()) return;
    onAddItem({
      name: itemNameInput,
      category: itemCategoryInput,
      description: itemDescInput || '旅伴手動新增的商品項。',
      originalPlaceholder: false
    });
    setItemNameInput('');
    setItemDescInput('');
  };

  return (
    <div id="shopping-view" className="space-y-6 pb-24">
      
      {/* ⚠️ AI Scanner Upload Zone */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-bold text-indigo-600 tracking-widest uppercase font-display flex items-center gap-1">
            <Camera className="h-3 w-3" />
            <span>AI 智慧視覺辨識 (視覺尋寶)</span>
          </label>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>支援拖曳照片</span>
          </span>
        </div>

        {/* Drag-and-Drop Area */}
        <div 
          id="dropzone-box"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border border-dashed rounded-[2rem] p-6 text-center cursor-pointer transition-all backdrop-blur-md ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50/20 scale-99' 
              : 'border-white/60 bg-white/35 hover:border-indigo-400 hover:bg-white/45'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {isScanning ? (
            <div className="space-y-3 py-3 relative">
              {/* Sci-fi scanner bar animation */}
              <div className="absolute inset-x-0 h-0.5 bg-indigo-500/80 shadow-[0_0_8px_rgba(79,70,229)] animate-shimmer top-0 rounded-full" />
              
              <div className="flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center animate-bounce">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-indigo-600">AI 正在深度解析商品圖...</p>
              <p className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100/50 py-1.5 px-3 rounded-xl max-w-sm mx-auto select-none">
                {scanningMessage}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50">
                <Upload className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">拍照、拖曳或點此上傳商品包裝圖</p>
                <p className="text-xs text-slate-400 mt-1">AI 將自動辨識包裝，翻譯並歸類商品類別</p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Scan Presets for instantaneous user testing in simulation */}
        <div className="bg-white/30 backdrop-blur-xs border border-white/50 p-4 rounded-3xl space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 select-none">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span>沒有產品照片？點選以下快速模擬 AI 神奇掃瞄：</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_PRESET_ANALYSES.map((preset, index) => (
              <button
                id={`quick-scan-preset-${index}`}
                key={index}
                onClick={() => triggerQuickPresetScan(index)}
                disabled={isScanning}
                className="py-1.5 px-3 bg-white/50 hover:bg-white/80 border border-white/60 rounded-xl text-xs font-medium text-slate-700 transition active:scale-95 disabled:opacity-50 shrink-0 backdrop-blur-xs"
              >
                📹 {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Shopping List Items */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-slate-100 pb-4">
          <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>待買清單 ({activeItems.length})</span>
            <span className="text-xs font-sans text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 font-semibold">{activeItems.length} 個寶藏</span>
          </h2>

          {/* Filter options */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {['all', 'Medicine', 'Cosmetics', 'Snacks', 'Apparel', 'Souvenir', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`py-1 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition border backdrop-blur-xs ${
                  selectedFilter === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-white/40 text-slate-600 border-white/50 hover:bg-white/60'
                }`}
              >
                {cat === 'all' ? '全部' : 
                 cat === 'Medicine' ? '藥品' : 
                 cat === 'Cosmetics' ? '美妝' : 
                 cat === 'Snacks' ? '零食' : 
                 cat === 'Apparel' ? '服飾' : 
                 cat === 'Souvenir' ? '特產' : '其他'}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE PRODUCT CARDS GRID */}
        {displayedActive.length === 0 ? (
          <div className="text-center py-10 px-6 bg-white/45 rounded-3xl border border-slate-100">
            <Package className="h-8 w-8 text-slate-300 mx-auto mb-2 stroke-1" />
            <p className="text-sm font-medium text-slate-500">待買清單空空如也</p>
            <p className="text-xs text-slate-400 mt-1">試試拖曳上傳，或點選上方的「AI 快速掃描」新增一個寶藏！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            {displayedActive.map(item => (
              <div 
                id={`shopping-item-card-${item.id}`}
                key={item.id}
                className="bg-white/52 backdrop-blur-md p-4.5 rounded-[2rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-white/60 hover:border-indigo-200/60 hover:bg-white/65 transition-all flex flex-col justify-between gap-3 relative overflow-hidden group"
              >
                {/* Visual Category ribbon indicator */}
                <div className="absolute top-0 right-0 h-1.5 w-12 bg-indigo-600" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest leading-none">
                      {item.category === 'Medicine' ? '藥品' : 
                       item.category === 'Cosmetics' ? '美妝' : 
                       item.category === 'Snacks' ? '零食' : 
                       item.category === 'Apparel' ? '服飾' : 
                       item.category === 'Souvenir' ? '物產特產' : '其他雜貨'}
                    </span>
                    
                    {/* Delete button */}
                    <button
                      id={`delete-shop-item-${item.id}`}
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-350 hover:text-rose-500 p-0.5 rounded transition"
                      title="刪除項目"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    {/* Render uploader preview thumbnails if they exist, else show stylish card icon */}
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-205"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Package className="h-5 w-5 stroke-1" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-450 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 mt-1.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>對準日雜尋寶中</span>
                  </span>

                  {/* Move to purchased toggle */}
                  <button
                    id={`purchase-item-${item.id}`}
                    onClick={() => onToggleBought(item.id)}
                    className="py-1 px-3 bg-indigo-600/90 border border-indigo-500/10 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 active:scale-95 transition-all flex items-center gap-1 shadow-sm font-sans"
                  >
                    <Check className="h-3 w-3" />
                    <span>購入記下</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PURCHASED ITEMS ACCORDION / BIN DISPLAY */}
        {activeItems.length > 0 && displayedPurchased.length > 0 && <div className="border-t border-slate-100 my-6" />}

        {displayedPurchased.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>已買清單 (已收入囊中 • {displayedPurchased.length})</span>
            </h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              {displayedPurchased.map(item => (
                <div 
                  id={`shopping-item-card-bought-${item.id}`}
                  key={item.id}
                  className="bg-emerald-50/15 backdrop-blur-md p-4 rounded-[2rem] border border-emerald-200/30 transition-all flex flex-col justify-between gap-3 relative group opacity-75"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest leading-none">
                        COMPLETED
                      </span>
                      
                      <button
                        id={`delete-shop-item-bought-${item.id}`}
                        onClick={() => onDeleteItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2.5 items-start opacity-60">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-205"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0 animate-pulse">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-500 line-through leading-snug">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3" />
                      <span>已購得寶物</span>
                    </span>

                    <button
                      id={`unpurchase-item-${item.id}`}
                      onClick={() => onToggleBought(item.id)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 underline"
                    >
                      放回備買
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MANUAL FAST-ADD SECTION */}
      <div className="glass-panel p-5 rounded-[2rem] border border-white/55 shadow-sm space-y-4">
        <h3 className="font-serif text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <PlusCircle className="h-4.5 w-4.5 text-indigo-600" />
          <span>手動加入尋寶商品</span>
        </h3>

        <form onSubmit={handleManualAdd} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">商品名稱</label>
              <input 
                type="text"
                placeholder="例如：熱太奇鯛魚燒、喜久大福"
                value={itemNameInput}
                onChange={(e) => setItemNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">商品分類</label>
              <select
                value={itemCategoryInput}
                onChange={(e) => setItemCategoryInput(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
              >
                <option value="Souvenir">物產伴手特產</option>
                <option value="Medicine">常備美日藥品</option>
                <option value="Cosmetics">藥妝美容保養</option>
                <option value="Snacks">甜品名物日治零嘴</option>
                <option value="Apparel">時尚防寒服飾</option>
                <option value="Other">其他雜貨採購</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">備註說明 / 購買地點</label>
            <input 
              type="text"
              placeholder="例如：名掛丁補考、FESAN 本館 B1 採購"
              value={itemDescInput}
              onChange={(e) => setItemDescInput(e.target.value)}
              className="w-full px-3 py-2 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
            />
          </div>

          <button
            id="add-custom-item-btn"
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 active:scale-98 shadow-sm transition-all"
          >
            加入待買清單
          </button>
        </form>
      </div>

    </div>
  );
}
