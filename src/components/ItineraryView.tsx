/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ChangeEvent } from 'react';
import { 
  Plane, 
  MapPin, 
  Store, 
  Compass, 
  Hotel, 
  Sparkles,
  Car, 
  Search, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Camera,
  X,
  Upload,
  Link,
  RotateCcw,
  Image,
  Check,
  Edit3,
  FileText
} from 'lucide-react';
import { ItineraryItem, ActivityCategory } from '../types';
import { INITIAL_ITINERARY } from '../data';

interface ItineraryViewProps {
  items: ItineraryItem[];
  onToggleComplete: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ItineraryItem>) => void;
}

export default function ItineraryView({ items, onToggleComplete, onUpdateItem }: ItineraryViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // State for customized photo editing
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // State for viewing/editing activity details and notes
  const [activeNoteItem, setActiveNoteItem] = useState<ItineraryItem | null>(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const [editedLocationName, setEditedLocationName] = useState('');
  const [editedPhoneNav, setEditedPhoneNav] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const [isNoteUploading, setIsNoteUploading] = useState(false);
  const [noteUploadError, setNoteUploadError] = useState('');
  const [noteShowPresets, setNoteShowPresets] = useState(false);

  const handleCloseNoteModal = () => {
    setActiveNoteItem(null);
    setEditedNoteText('');
    setEditedLocationName('');
    setEditedPhoneNav('');
    setEditedImage('');
    setNoteUploadError('');
    setNoteShowPresets(false);
  };

  const handleSaveNote = () => {
    if (!activeNoteItem) return;
    onUpdateItem(activeNoteItem.id, { 
      note: editedNoteText,
      locationName: editedLocationName,
      phoneNav: editedPhoneNav || undefined,
      image: editedImage || undefined
    });
    handleCloseNoteModal();
  };

  const handleNoteImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setNoteUploadError('照片容量過大（請選擇 5MB 內照片，以加速運行）');
      return;
    }

    setNoteUploadError('');
    setIsNoteUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditedImage(base64String);
      setIsNoteUploading(false);
    };
    reader.onerror = () => {
      setNoteUploadError('讀取檔案失敗，請再試一次');
      setIsNoteUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const PRESET_SCENERY = [
    {
      name: '溪流界溫泉',
      url: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '仙台極上牛舌',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '楓紅名勝老街',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '東北紅葉山巔',
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '森林秘境自駕',
      url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '日式和風庭園',
      url: 'https://images.unsplash.com/photo-1528150493867-b5cc062d59ae?auto=format&fit=crop&w=600&q=80',
    }
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('照片容量過大（請選擇 5MB 內照片，以加速運行）');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomImageUrl(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError('讀取檔案失敗，請再試一次');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!editingItem) return;
    onUpdateItem(editingItem.id, { image: customImageUrl });
    setEditingItem(null);
    setCustomImageUrl('');
    setUploadError('');
  };

  const handleRestoreDefault = () => {
    if (!editingItem) return;
    const originalImage = INITIAL_ITINERARY.find(i => i.id === editingItem.id)?.image || '';
    onUpdateItem(editingItem.id, { image: originalImage });
    setEditingItem(null);
    setCustomImageUrl('');
    setUploadError('');
  };

  // Days list (1 to 5)
  const daysList = [1, 2, 3, 4, 5];

  // Map category to aesthetic color badges and icons
  const getCategoryStyles = (cat: ActivityCategory) => {
    switch (cat) {
      case 'flight':
        return {
          icon: <Plane className="h-4 w-4" />,
          bg: 'bg-blue-50 text-blue-700 border-blue-100',
          dot: 'bg-blue-500'
        };
      case 'transit':
        return {
          icon: <Car className="h-4 w-4" />,
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-500'
        };
      case 'hotel':
        return {
          icon: <Hotel className="h-4 w-4" />,
          bg: 'bg-stone-50 text-stone-700 border-stone-200/60',
          dot: 'bg-stone-600'
        };
      case 'shopping':
        return {
          icon: <Store className="h-4 w-4" />,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          dot: 'bg-indigo-500'
        };
      case 'sightseeing':
        return {
          icon: <Compass className="h-4 w-4" />,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500'
        };
      case 'food':
        return {
          icon: <Sparkles className="h-4 w-4" />,
          bg: 'bg-rose-50 text-rose-700 border-rose-100',
          dot: 'bg-rose-500'
        };
      case 'culture':
        return {
          icon: <HelpCircle className="h-4 w-4 text-xs" />, // custom fallback
          bg: 'bg-purple-50 text-purple-700 border-purple-100',
          dot: 'bg-purple-500'
        };
      default:
        return {
          icon: <MapPin className="h-4 w-4" />,
          bg: 'bg-slate-50 text-slate-700 border-slate-100',
          dot: 'bg-slate-500'
        };
    }
  };

  const getDayThemeLabel = (day: number) => {
    switch (day) {
      case 1: return { main: '仙台抵達 • 頂級選物爆買與神級牛舌', desc: '星宇星級降落 / Montbell 快攻 / 仙台特產' };
      case 2: return { main: '朝市慢活 • 金蛇求財 ➔ 奢華界秋保', desc: '百年麻糬 / 烤魚板 / 星野溪畔露天浴' };
      case 3: return { main: 'Costco 爆入 • 盛岡搶時與別墅自炊', desc: '富谷好市多採購和牛 / 肴町商店街 / 豪華大餐' };
      case 4: return { main: '盛岡晨喚 • 尋找牛奶瓶海膽 ➔ 椀子挑戰', desc: '盛岡八幡宮八角神籤 / 嘉司屋蕎麥麵 / 樂天別墅' };
      case 5: return { main: '花卷自然散策 • York 超市爆購回台', desc: '釜淵瀑布吸吐大自然 / 備用補考點 / 返回溫暖的家' };
      default: return { main: '', desc: '' };
    }
  };

  // Filter schedules based on day, query, and category filter
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchDay = item.day === selectedDay;
      const matchQuery = item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.note.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchDay && matchQuery && matchCategory;
    });
  }, [items, selectedDay, searchQuery, filterCategory]);

  return (
    <div id="itinerary-view" className="space-y-6 pb-24">
      {/* Search & Category Filter bar */}
      <div className="glass-panel p-4 rounded-3xl shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="搜尋今日景點、美食或備註..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/40 border border-white/60 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/80 transition-all placeholder:text-slate-400 backdrop-blur-xs"
          />
        </div>

        {/* Mini quick filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar">
          {[
            { id: 'all', label: '全部項目' },
            { id: 'food', label: '美食景點' },
            { id: 'shopping', label: '日雜採購' },
            { id: 'sightseeing', label: '大自然與打卡' },
            { id: 'hotel', label: '極上名宿' },
            { id: 'culture', label: '文化祈願' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border active:scale-95 ${
                filterCategory === cat.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                  : 'bg-white/40 backdrop-blur-xs text-slate-600 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Hoshino-style Day Tabs Header */}
      <div className="space-y-4">
        {/* Day selection tabs */}
        <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-3xl border border-white/50 shadow-xs justify-between gap-1.5">
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setSearchQuery('');
              }}
              className={`flex-1 py-3 text-center rounded-[1.25rem] transition-all relative ${
                selectedDay === day 
                  ? 'bg-indigo-600/90 text-white shadow-sm font-semibold backdrop-blur-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-75">DAY</div>
              <div className="text-lg font-serif leading-none mt-0.5">{day}</div>
              
              {/* Highlight active with dot if desired */}
              {selectedDay === day && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 block sm:hidden" />
              )}
            </button>
          ))}
        </div>

        {/* Current Day description title */}
        <div className="px-1 text-left">
          <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase font-display">
            {getDayThemeLabel(selectedDay).desc}
          </span>
          <h2 className="font-serif text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
            {getDayThemeLabel(selectedDay).main}
          </h2>
        </div>
      </div>

      {/* Itinerary Cards List Timeline */}
      <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200/80">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/50 rounded-3xl border border-slate-100">
            <MapPin className="h-10 w-10 text-slate-350 mx-auto mb-3 stroke-1" />
            <p className="text-sm font-medium text-slate-500">此篩選條件今天沒有對應活動</p>
            <p className="text-xs text-slate-400 mt-1">您可以更換上方快速標籤，或搜看看別的關鍵字</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const style = getCategoryStyles(item.category);
            return (
              <div 
                id={`itinerary-item-${item.id}`}
                key={item.id} 
                className={`group relative flex gap-4 pl-1 transition-all duration-300 ${
                  item.isCompleted ? 'opacity-65' : ''
                }`}
              >
                {/* Custom Left Timeline Dot and Icon */}
                <div className="flex-none flex flex-col items-center">
                  <div className={`h-9 w-9 rounded-full border flex items-center justify-center bg-white shadow-xs transition-colors z-10 ${
                    item.isCompleted 
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-55/20' 
                      : 'border-slate-200 text-slate-700 hover:border-indigo-400'
                  }`}>
                    {item.isCompleted ? <CheckCircle className="h-5 w-5" /> : style.icon}
                  </div>
                  <div className="text-[11px] font-mono font-medium text-slate-400 mt-2 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100/50">
                    {item.time}
                  </div>
                </div>

                {/* Main Card */}
                <div 
                  id={`itinerary-card-${item.id}`}
                  onClick={() => {
                    setActiveNoteItem(item);
                    setEditedNoteText(item.note);
                    setEditedLocationName(item.locationName);
                    setEditedPhoneNav(item.phoneNav || '');
                    setEditedImage(item.image || '');
                  }}
                  className={`flex-1 bg-white/52 backdrop-blur-md p-5 rounded-[2rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)] border cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-white/65 hover:scale-[1.01] ${
                    item.isCompleted 
                      ? 'border-emerald-200/50 bg-emerald-50/15' 
                      : item.isEarlyClosing 
                        ? 'border-amber-300/50 bg-amber-50/10' 
                        : 'border-white/60 hover:border-indigo-200/60'
                  }`}
                >
                  {/* Card Wide Photograph */}
                  {item.image ? (
                    <div className="w-full h-36 rounded-2xl overflow-hidden mb-3.5 relative shadow-inner border border-white/50 bg-slate-100 group/image">
                      <img 
                        src={item.image} 
                        alt={item.locationName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      {/* Edit Image Trigger Overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                          setCustomImageUrl(item.image || '');
                        }}
                        className="absolute bottom-2.5 right-2.5 h-8 w-8 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border border-white/10 z-20"
                        title="更換相片"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-14 border border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl mb-3.5 flex items-center justify-center gap-1.5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                        setCustomImageUrl('');
                      }}
                    >
                      <Camera className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-505">新增這張卡片的照片</span>
                    </div>
                  )}

                  {/* Category badge & Early warning */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${style.bg}`}>
                      {item.category === 'food' ? '舌尖饗宴' : 
                       item.category === 'shopping' ? '名物購入' : 
                       item.category === 'sightseeing' ? '祕境景點' : 
                       item.category === 'hotel' ? '經典名宿' : 
                       item.category === 'culture' ? '文化祈願' : 
                       item.category === 'transit' ? '自駕行進' : '航班飛越'}
                    </span>

                    {/* Early Closing Alarm Badge */}
                    {item.isEarlyClosing && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        <span>提早關門 ({item.closingTime} Close)</span>
                      </span>
                    )}
                  </div>

                  {/* Title and note */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className={`text-base font-bold text-slate-900 tracking-tight leading-snug font-sans ${
                        item.isCompleted ? 'line-through text-slate-400' : ''
                      }`}>
                        {item.locationName}
                      </h3>
                      <p className={`text-xs text-slate-500 leading-relaxed font-sans ${
                        item.isCompleted ? 'text-slate-405' : ''
                      }`}>
                        {item.note}
                      </p>
                    </div>

                    {/* Checkbox item */}
                    <button 
                      id={`check-activity-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(item.id);
                      }}
                      className={`flex-none h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.isCompleted 
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs' 
                          : 'border-slate-200 hover:border-indigo-400 text-transparent bg-slate-50'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Telephone or Maps Navigation footer block */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100/70 flex flex-wrap items-center justify-between gap-2.5">
                    {item.phoneNav ? (
                      <div className="text-[11px] font-sans text-slate-600 flex items-center gap-2 select-none">
                        <div className="flex items-center gap-1 bg-amber-50/80 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border border-amber-200/50">
                          <Car className="h-3 w-3" />
                          <span>自駕 GPS 電話:</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 bg-white/60 px-1.5 py-0.5 rounded-md border border-slate-100">{item.phoneNav}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-450 flex items-center gap-1 select-none">
                        <span>📍 GPS:</span>
                        <span className="font-semibold text-slate-600">無專屬電話 (請地名導航)</span>
                      </div>
                    )}

                    {/* Large styled button to trigger maps targeting destination name */}
                    <a
                      id={`navigate-button-${item.id}`}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationName + " 日本東北")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-semibold tracking-wide flex items-center gap-1.5 active:scale-95 transition-all shadow-xs shrink-0"
                    >
                      <span>導航</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🖼️ Image Editor Drawer Modal */}
      {editingItem && (
        <div id="image-edit-modal" className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] shadow-2xl relative border-t border-white/40 max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="text-left font-sans">
                  <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase block mb-1">
                    CUSTOM CARD PHOTO
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-none">
                    自訂卡片封面照
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    為「{editingItem.locationName}」上傳你所拍攝的絕美相片，或精選主題圖檔
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setEditingItem(null);
                    setCustomImageUrl('');
                    setUploadError('');
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Current Preview */}
              <div className="space-y-2 font-sans">
                <span className="text-xs font-bold text-slate-500 block text-left">效果預覽 Preview</span>
                <div className="w-full h-40 rounded-2xl bg-slate-50 border border-slate-150 overflow-hidden relative shadow-inner flex items-center justify-center">
                  {customImageUrl ? (
                    <img 
                      src={customImageUrl} 
                      alt="Preview" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-1">
                      <Image className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5]" />
                      <p className="text-xs text-slate-400">目前尚無預覽圖</p>
                    </div>
                  )}
                  {/* Visual Accent */}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    PREVIEW
                  </div>
                </div>
              </div>

              {/* Selection Methods */}
              <div className="space-y-4 font-sans">
                
                {/* Method 1: Upload File */}
                <div className="bg-slate-50/75 rounded-2xl p-4 border border-slate-150 text-left space-y-2.5">
                  <div className="flex items-center gap-1.5 text-slate-705">
                    <Upload className="h-4 w-4 text-indigo-500" />
                    <span className="text-xs font-bold">上傳手機/本機相片</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border border-dashed border-slate-300 rounded-xl py-3 px-4 text-center hover:bg-white hover:border-indigo-400 transition-all">
                      <span className="text-xs text-slate-505 font-medium">
                        {isUploading ? '讀取檔案中...' : '點擊此處，拍照或選擇相簿中的照片'}
                      </span>
                    </div>
                  </div>
                  {uploadError && (
                    <p className="text-[11px] text-rose-500 font-medium">{uploadError}</p>
                  )}
                </div>

                {/* Method 2: Curated Themes list */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 block text-left">精選日本東北主題美景</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_SCENERY.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomImageUrl(p.url)}
                        className="group relative h-16 rounded-xl overflow-hidden border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all active:scale-95 text-left"
                      >
                        <img 
                          src={p.url} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                          <span className="text-[9px] font-semibold text-white truncate w-full">
                            {p.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method 3: Direct Web Link */}
                <div className="space-y-1.5 text-left font-sans">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Link className="h-3 w-3 text-slate-400" />
                    <span>或填寫外部圖片網址 (Image URL)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/your-image.jpg"
                    value={customImageUrl && !customImageUrl.startsWith('data:') ? customImageUrl : ''}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:bg-white transition-all font-mono"
                  />
                </div>

              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-6 pt-4 pb-6 bg-slate-50 border-t border-slate-100 flex gap-2.5 font-sans">
              
              {/* Reset to default */}
              <button
                onClick={handleRestoreDefault}
                className="flex-1 py-3 text-xs font-bold text-slate-550 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200 shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>還原預設圖</span>
              </button>

              {/* Save image */}
              <button
                disabled={isUploading}
                onClick={handleSaveImage}
                className={`flex-[2] py-3 text-xs font-bold text-white rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
                  isUploading 
                    ? 'bg-slate-300 border-slate-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 shadow-md'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>儲存並更新卡片</span>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 📝 Card Note / Travel Item Details Editor Modal */}
      {activeNoteItem && (
        <div id="note-edit-modal" className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] shadow-2xl relative border-t border-white/40 max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="text-left font-sans">
                  <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase block mb-1">
                    ITINERARY DETAIL & NOTE
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-none">
                    查看與編輯行程內容
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    修改「{activeNoteItem.locationName}」的備忘筆記、名稱或 GPS / 電話資訊
                  </p>
                </div>
                <button 
                  onClick={handleCloseNoteModal}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Details Display */}
              <div className="bg-slate-50/75 rounded-2xl p-4 border border-slate-150 text-left space-y-3 font-sans">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-bold">基本行程資訊</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">造訪時間</label>
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-100 block">
                      {activeNoteItem.time}
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">行程類別</label>
                    <span className="font-semibold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-100 block capitalize">
                      {activeNoteItem.category === 'food' ? '舌尖饗宴' : 
                       activeNoteItem.category === 'shopping' ? '名物購入' : 
                       activeNoteItem.category === 'sightseeing' ? '祕境景點' : 
                       activeNoteItem.category === 'hotel' ? '經典名宿' : 
                       activeNoteItem.category === 'culture' ? '文化祈願' : 
                       activeNoteItem.category === 'transit' ? '自駕行進' : '航班飛越'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editing Inputs */}
              <div className="space-y-4 font-sans text-left">
                
                {/* Edit Destination Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                    <span>修改景點 / 活動名稱</span>
                  </label>
                  <input 
                    type="text" 
                    value={editedLocationName}
                    onChange={(e) => setEditedLocationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:bg-white transition-all font-semibold text-slate-800"
                    placeholder="例如: 仙台極上牛舌"
                  />
                </div>

                {/* Edit Note Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>備忘筆記 (Notes)</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={editedNoteText}
                    onChange={(e) => setEditedNoteText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:bg-white transition-all text-slate-755 leading-relaxed font-sans"
                    placeholder="填寫細節指引、必買品項、或提醒事項..."
                  />
                </div>

                {/* Edit Phone/Navigation code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Car className="h-3.5 w-3.5 text-slate-400" />
                    <span>自駕 GPS 電話 (選填)</span>
                  </label>
                  <input 
                    type="text" 
                    value={editedPhoneNav}
                    onChange={(e) => setEditedPhoneNav(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:bg-white transition-all font-mono text-slate-700"
                    placeholder="例如: 022-264-1111 (若無則不顯示)"
                  />
                </div>

                {/* Edit Card Photograph */}
                <div className="space-y-2.5 pt-1 border-t border-slate-100 mt-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Image className="h-3.5 w-3.5 text-slate-400" />
                    <span>自訂行程卡片封面照</span>
                  </label>
                  
                  {/* Current image preview card with absolute actions overlay */}
                  <div className="w-full h-40 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center">
                    {editedImage ? (
                      <div className="relative w-full h-full group">
                        <img 
                          src={editedImage} 
                          alt="Cover" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setEditedImage('')}
                          className="absolute top-2.5 right-2.5 bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95 z-20"
                        >
                          <X className="h-3 w-3" />
                          <span>移除相片</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-6 space-y-1.5">
                        <Camera className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5]" />
                        <p className="text-xs text-slate-400 font-medium">目前此行程無相片封面</p>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider select-none">
                      PHOTO COVER
                    </div>
                  </div>

                  {/* Upload Actions Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* File Upload Button */}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleNoteImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        disabled={isNoteUploading}
                        className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 border border-indigo-100/40"
                      >
                        <Upload className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{isNoteUploading ? '讀取中...' : '本機上傳 / 拍照'}</span>
                      </button>
                    </div>

                    {/* Presets Gallery Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setNoteShowPresets(!noteShowPresets)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 border border-slate-200/50"
                    >
                      <Image className="h-3.5 w-3.5 text-slate-500" />
                      <span>{noteShowPresets ? '隱藏推薦圖庫' : '精選主題圖庫'}</span>
                    </button>
                  </div>

                  {noteUploadError && (
                    <p className="text-[11px] text-rose-500 font-medium text-left">{noteUploadError}</p>
                  )}

                  {/* Collapsible Presets Section */}
                  {noteShowPresets && (
                    <div className="bg-slate-50/75 rounded-2xl p-3 border border-slate-150 space-y-2 animate-fade-in">
                      <span className="text-[10px] font-bold text-slate-400 block text-left uppercase">點擊直接套用日本東北精選美景：</span>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_SCENERY.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditedImage(p.url)}
                            className="group relative h-14 rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-505 hover:shadow-xs transition-all active:scale-95 text-left"
                          >
                            <img 
                              src={p.url} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                              <span className="text-[8px] font-semibold text-white truncate w-full">
                                {p.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Method 3: Direct Web Link */}
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">或輸入外部圖片網址 (Image URL)：</span>
                    <input 
                      type="text" 
                      placeholder="https://example.com/your-image.jpg"
                      value={editedImage && !editedImage.startsWith('data:') ? editedImage : ''}
                      onChange={(e) => setEditedImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-6 pt-4 pb-6 bg-slate-50 border-t border-slate-100 flex gap-2.5 font-sans">
              
              {/* Cancel Button */}
              <button
                onClick={handleCloseNoteModal}
                className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
                <span>取消</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSaveNote}
                className="flex-[2] py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 shadow-md rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="h-3.5 w-3.5" />
                <span>儲存更改</span>
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
