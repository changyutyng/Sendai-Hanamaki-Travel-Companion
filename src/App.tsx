/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Compass, 
  Camera, 
  Coins, 
  MapPin, 
  Calendar, 
  Layers, 
  HelpCircle,
  Sparkles,
  RefreshCw,
  Heart
} from 'lucide-react';

import { ItineraryItem, ShoppingItem, Expense, SyncSession } from './types';
import { INITIAL_ITINERARY, INITIAL_SHOPPING_ITEMS } from './data';

import ItineraryView from './components/ItineraryView';
import ShoppingView from './components/ShoppingView';
import ExpensesView from './components/ExpensesView';
import SyncIndicator from './components/SyncIndicator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'itinerary' | 'shopping' | 'expenses'>('itinerary');

  // Load state from localStorage on startup, fallback to default seeds with smart merge on 'isCompleted' status
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('sendai_itinerary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ItineraryItem[];
        // Map over INITIAL_ITINERARY to guarantee correct items, times, notes, and photos, retaining the user's completion status and custom images
        return INITIAL_ITINERARY.map(initItem => {
          const savedItem = parsed.find(p => p.id === initItem.id);
          return {
            ...initItem,
            isCompleted: savedItem ? !!savedItem.isCompleted : !!initItem.isCompleted,
            image: (savedItem && savedItem.image !== undefined) ? savedItem.image : initItem.image
          };
        });
      } catch (e) {
        return INITIAL_ITINERARY;
      }
    }
    return INITIAL_ITINERARY;
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('sendai_shopping');
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING_ITEMS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('sendai_expenses');
    if (saved) return JSON.parse(saved);
    
    // Seed 3 stunning starter expenses for instant calculations preview
    return [
      {
        id: 'exp-seed-1',
        description: '星野界秋保 溫泉會席料理晚餐與房費加選',
        amountJpy: 25000,
        amountTwd: 25000 * 0.21,
        payer: 'Ting',
        category: 'Stay',
        createdAt: new Date('2026-06-16T18:00:00').toISOString()
      },
      {
        id: 'exp-seed-2',
        description: '仙台租車 5日安全險 + ETC 卡租借費',
        amountJpy: 15800,
        amountTwd: 15800 * 0.21,
        payer: 'Chuan',
        category: 'Transport',
        createdAt: new Date('2026-06-16T10:00:00').toISOString()
      },
      {
        id: 'exp-seed-3',
        description: '名掛丁阿部蒲鉾店 炸葫蘆串點心補考',
        amountJpy: 1200,
        amountTwd: 1200 * 0.21,
        payer: 'Ting',
        category: 'Food',
        createdAt: new Date('2026-06-17T15:30:00').toISOString()
      }
    ];
  });

  const [syncSession, setSyncSession] = useState<SyncSession>(() => {
    const saved = localStorage.getItem('sendai_sync_session');
    return saved ? JSON.parse(saved) : {
      sessionId: 'SENDAI-2026-616',
      partnerName: 'Chuan (旅伴)',
      partnerEmail: 'changyutyng@gmail.com', // custom user email logged
      lastSyncedAt: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
      isConnected: true
    };
  });

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sendai_itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('sendai_shopping', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem('sendai_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sendai_sync_session', JSON.stringify(syncSession));
  }, [syncSession]);

  // Handle URL Sync Join Code parameter on load (E.g. ?syncSession=XYZ)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionCode = params.get('syncSession');
    if (sessionCode) {
      setSyncSession(prev => ({
        ...prev,
        sessionId: sessionCode.toUpperCase(),
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('zh-TW', { hour12: false })
      }));
      // Clean query params so it doesnt clutter the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Handler functions
  const handleToggleItineraryComplete = (id: string) => {
    setItinerary(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    triggerFastCloudSync();
  };

  const handleUpdateItineraryItem = (id: string, updates: Partial<ItineraryItem>) => {
    setItinerary(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    triggerFastCloudSync();
  };

  const handleAddShoppingItem = (newItem: Omit<ShoppingItem, 'id' | 'isBought'>) => {
    const added: ShoppingItem = {
      ...newItem,
      id: `shop-${Date.now()}`,
      isBought: false
    };
    setShoppingItems(prev => [added, ...prev]);
    triggerFastCloudSync();
  };

  const handleToggleShoppingBought = (id: string) => {
    setShoppingItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBought: !item.isBought } : item
    ));
    triggerFastCloudSync();
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== id));
    triggerFastCloudSync();
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'amountTwd' | 'createdAt'>) => {
    const added: Expense = {
      ...newExpense,
      id: `exp-${Date.now()}`,
      amountTwd: newExpense.amountJpy * 0.21,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, added]);
    triggerFastCloudSync();
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    triggerFastCloudSync();
  };

  // Emulates an active cloud upload pipeline when stats change
  const triggerFastCloudSync = () => {
    setSyncSession(prev => ({
      ...prev,
      lastSyncedAt: new Date().toLocaleTimeString('zh-TW', { hour12: false })
    }));
  };

  const handleUpdateSyncSession = (newSession: Partial<SyncSession>) => {
    setSyncSession(prev => ({ ...prev, ...newSession }));
  };

  // Calculate dynamic stats
  const completedItineraryCount = itinerary.filter(i => i.isCompleted).length;
  const itineraryProgressPercent = Math.round((completedItineraryCount / itinerary.length) * 100);

  const boughtShoppingCount = shoppingItems.filter(s => s.isBought).length;
  const shoppingProgressPercent = shoppingItems.length > 0 
    ? Math.round((boughtShoppingCount / shoppingItems.length) * 100)
    : 0;

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-white/25 backdrop-blur-[28px] flex flex-col justify-between max-w-lg mx-auto shadow-2xl relative pb-20 border-x border-white/60">
      
      {/* 🏡 Luxury Resort Header */}
      <header id="luxury-app-header" className="sticky top-0 z-40 bg-white/40 backdrop-blur-[24px] border-b border-white/50 p-5 space-y-4 shadow-[0_4px_30px_rgba(31,38,135,0.02)]">
        <div className="flex justify-between items-start gap-4">
          <div className="text-left space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase font-display block">
              HOSHINO KAI RESORTS INSPIRED
            </span>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900 leading-none">
              仙台 • 花卷悠旅
            </h1>
            <p className="text-[10px] text-slate-400 font-medium font-sans">
              2026/06/16 - 06/20 • 東北自駕 5 日
            </p>
          </div>

          <SyncIndicator 
            session={syncSession} 
            onRefresh={triggerFastCloudSync}
            onUpdateSession={handleUpdateSyncSession}
          />
        </div>

        {/* Global Travel Progress Bar Card */}
        <div className="bg-white/40 border border-white/65 p-3.5 rounded-2xl flex items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-indigo-50/60 text-indigo-600 border border-indigo-100/10">
              <Compass className="h-4 w-4 animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-700">旅途探索度 {itineraryProgressPercent}%</div>
              <div className="text-[9px] text-slate-400 mt-0.5">已征服 {completedItineraryCount} / {itinerary.length} 個行程地標</div>
            </div>
          </div>

          <div className="w-24 bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${itineraryProgressPercent}%` }}
              className="bg-indigo-600/85 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </header>

      {/* 📱 Main Tab-Specific Screens Area */}
      <main id="app-main-content-area" className="flex-1 p-5 overflow-y-auto">
        {currentTab === 'itinerary' && (
          <ItineraryView 
            items={itinerary} 
            onToggleComplete={handleToggleItineraryComplete} 
            onUpdateItem={handleUpdateItineraryItem}
          />
        )}

        {currentTab === 'shopping' && (
          <ShoppingView 
            items={shoppingItems} 
            onAddItem={handleAddShoppingItem} 
            onToggleBought={handleToggleShoppingBought} 
            onDeleteItem={handleDeleteShoppingItem} 
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesView 
            expenses={expenses} 
            onAddExpense={handleAddExpense} 
            onDeleteExpense={handleDeleteExpense}
            currentPartnerName={syncSession.partnerName}
          />
        )}
      </main>

      {/* 🧘 Hoshino-style Zen Bottom message before navigation bar */}
      <footer className="text-center text-[10px] text-slate-400 font-serif italic py-6 select-none bg-white/20 border-t border-white/10">
        宮城・岩手五日「界秋保」奢華風呂極緻自駕
      </footer>

      {/* 📱 Fixed bottom iOS navigation bar */}
      <nav 
        id="ios-bottom-nav-bar" 
        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/50 backdrop-blur-[28px] border-t border-white/60 py-2 px-6 flex items-center justify-around shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.04)] z-50 rounded-t-[2.5rem]"
      >
        <button
          id="tab-itinerary-btn"
          onClick={() => setCurrentTab('itinerary')}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all relative ${
            currentTab === 'itinerary' 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="h-5 w-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-wider">互動行程</span>
          {currentTab === 'itinerary' && (
            <div className="absolute top-0 w-2.5 h-0.5 rounded-full bg-indigo-600 block" />
          )}
        </button>

        <button
          id="tab-shopping-btn"
          onClick={() => setCurrentTab('shopping')}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all relative ${
            currentTab === 'shopping' 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Camera className="h-5 w-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-wider">相機尋寶</span>
          {currentTab === 'shopping' && (
            <div className="absolute top-0 w-2.5 h-0.5 rounded-full bg-indigo-600 block" />
          )}
        </button>

        <button
          id="tab-expenses-btn"
          onClick={() => setCurrentTab('expenses')}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all relative ${
            currentTab === 'expenses' 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Coins className="h-5 w-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-wider">記帳拆帳</span>
          {currentTab === 'expenses' && (
            <div className="absolute top-0 w-2.5 h-0.5 rounded-full bg-indigo-600 block" />
          )}
        </button>
      </nav>

    </div>
  );
}
