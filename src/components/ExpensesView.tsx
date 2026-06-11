/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  DollarSign, 
  PlusCircle, 
  Trash2, 
  Camera, 
  TrendingUp, 
  Users, 
  ArrowRightLeft, 
  Check, 
  PieChart, 
  Grid,
  FileText
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'amountTwd' | 'createdAt'>) => void;
  onDeleteExpense: (id: string) => void;
  currentPartnerName: string;
}

export default function ExpensesView({ expenses, onAddExpense, onDeleteExpense, currentPartnerName }: ExpensesViewProps) {
  const [descInput, setDescInput] = useState('');
  const [jpyInput, setJpyInput] = useState('');
  const [payerInput, setPayerInput] = useState('Ting'); // Default to Ting (changyutyng@gmail.com)
  const [categoryInput, setCategoryInput] = useState<ExpenseCategory>('Food');
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto rate conversion coefficient
  const JPY_TO_TWD = 0.21;

  // Calculate high-fidelity stats
  const totals = expenses.reduce((acc, curr) => {
    acc.jpy += curr.amountJpy;
    acc.twd += curr.amountTwd;
    return acc;
  }, { jpy: 0, twd: 0 });

  // Payer statistics
  const payerTotals = expenses.reduce((acc, curr) => {
    if (!acc[curr.payer]) {
      acc[curr.payer] = { jpy: 0, twd: 0 };
    }
    acc[curr.payer].jpy += curr.amountJpy;
    acc[curr.payer].twd += curr.amountTwd;
    return acc;
  }, {} as Record<string, { jpy: number; twd: number }>);

  // Settlement calculations
  // Default travelers: Ting & Chuan
  const tingPaidTwd = payerTotals['Ting']?.twd || 0;
  const chuanPaidTwd = payerTotals['Chuan']?.twd || 0;
  const totalPaidTwd = tingPaidTwd + chuanPaidTwd;
  const fairShareTwd = totalPaidTwd / 2;

  // Split difference:
  // If difference is positive, Chuan owes Ting. If negative, Ting owes Chuan.
  const settlementDifferenceTwd = tingPaidTwd - fairShareTwd;

  // Category statistics breakdown
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amountTwd;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  // Handle local receipt upload
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Mock luxury receipt generator to simplify testing
  const attachMockReceipt = () => {
    // Elegant tiny base64 receipt illustration
    setReceiptBase64(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"><rect width="100" height="150" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><line x1="10" y1="20" x2="90" y2="20" stroke="%234f46e5" stroke-dasharray="2"/><text x="10" y="40" font-family="monospace" font-size="8" fill="%2364748b">RESTAURANT TAX SLIP</text><text x="10" y="60" font-family="monospace" font-size="10" font-weight="bold" fill="%231e293b">TOTAL: %25EF%25BF%25A512,800</text></svg>`);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descInput.trim() || !jpyInput) return;
    const jpyAmount = parseFloat(jpyInput);
    if (isNaN(jpyAmount) || jpyAmount <= 0) return;

    onAddExpense({
      description: descInput,
      amountJpy: jpyAmount,
      payer: payerInput,
      category: categoryInput,
      receiptImage: receiptBase64 || undefined
    });

    setDescInput('');
    setJpyInput('');
    setReceiptBase64(null);
  };

  return (
    <div id="expenses-view" className="space-y-6 pb-24">
      
      {/* Spend Stats & Fast Settling Metric Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-xs space-y-5">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase font-display">
            旅伴共同記帳帳簿
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            日圓支出與台幣拆帳
          </h2>
        </div>

        {/* Big Ledger Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/40 backdrop-blur-xs p-4.5 rounded-2xl border border-white/60 space-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">合計日圓總花費</span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              ¥ {totals.jpy.toLocaleString()}
            </div>
          </div>
          <div className="bg-indigo-600/90 backdrop-blur-xs p-4.5 rounded-2xl text-white space-y-1 shadow-md border border-indigo-500/10">
            <span className="text-[10px] font-bold text-indigo-250 uppercase tracking-wider">合計折合台幣 (匯率0.21)</span>
            <div className="text-xl font-bold font-mono text-indigo-50">
              NT$ {Math.round(totals.twd).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Settlement box (Split Ledger) */}
        <div className="bg-white/40 backdrop-blur-xs p-4 rounded-[1.5rem] border border-white/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">一人一半帳目結算</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                每人應付 NT$ {Math.round(fairShareTwd).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <div className="text-right">
              {Math.abs(settlementDifferenceTwd) < 1 ? (
                <p className="text-xs font-semibold text-slate-700">對帳完美平衡！</p>
              ) : settlementDifferenceTwd > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    旅伴 <span className="text-indigo-600 font-bold">Chuan</span> 應支付給 <span className="text-slate-900 font-bold">Ting</span>
                  </p>
                  <p className="text-base font-bold text-indigo-600 font-mono">
                    NT$ {Math.round(settlementDifferenceTwd).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    旅伴 <span className="text-indigo-600 font-bold">Ting</span> 應支付給 <span className="text-slate-900 font-bold">Chuan</span>
                  </p>
                  <p className="text-base font-bold text-amber-600 font-mono">
                    NT$ {Math.round(Math.abs(settlementDifferenceTwd)).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Small Breakdown categories bar */}
        {expenses.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <PieChart className="h-3.5 w-3.5" />
                <span>各類別花費比例</span>
              </span>
              <span>(台幣累計)</span>
            </div>
            
            <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100">
              {Object.entries(categoryTotals).map(([cat, val]) => {
                const percentage = (val / totals.twd) * 100;
                let colorClass = 'bg-stone-500';
                if (cat === 'Food') colorClass = 'bg-rose-500';
                if (cat === 'Transport') colorClass = 'bg-amber-500';
                if (cat === 'Stay') colorClass = 'bg-slate-800';
                if (cat === 'Shopping') colorClass = 'bg-indigo-500';
                if (cat === 'Activity') colorClass = 'bg-emerald-500';

                return (
                  <div 
                    key={cat}
                    style={{ width: `${percentage}%` }}
                    className={`${colorClass} transition-all`}
                    title={`${cat}: ${Math.round(percentage)}%`}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> 美食 ({Math.round(categoryTotals['Food'] || 0)} 元)</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> 交通 ({Math.round(categoryTotals['Transport'] || 0)} 元)</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span> 住宿 ({Math.round(categoryTotals['Stay'] || 0)} 元)</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> 購物 ({Math.round(categoryTotals['Shopping'] || 0)} 元)</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 活動 ({Math.round(categoryTotals['Activity'] || 0)} 元)</span>
            </div>
          </div>
        )}
      </div>

      {/* Expense Form Inputs */}
      <div className="glass-panel p-5 rounded-[2rem] border border-white/55 shadow-sm space-y-4">
        <h3 className="font-serif text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <PlusCircle className="h-4.5 w-4.5 text-indigo-600" />
          <span>新增一筆支出</span>
        </h3>

        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">項目名稱</label>
              <input 
                type="text"
                placeholder="例如：閣牛舌晚餐、Costco和牛生鮮"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">支出金額 (日圓 JPY)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xs">¥</span>
                <input 
                  type="number"
                  placeholder="例如：12800"
                  value={jpyInput}
                  onChange={(e) => setJpyInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-white/40 border border-white/60 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">付款人</label>
              <select
                value={payerInput}
                onChange={(e) => setPayerInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
              >
                <option value="Ting">Ting (changyutyng@gmail.com)</option>
                <option value="Chuan">Chuan (旅伴君)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">類別</label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2.5 bg-white/40 border border-white/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/85 transition backdrop-blur-xs"
              >
                <option value="Food">🍱 美食餐飲</option>
                <option value="Transport">🚗 交通租車</option>
                <option value="Stay">🏨 溫泉住宿</option>
                <option value="Shopping">🛍️ 購物日雜</option>
                <option value="Activity">🎯 體驗活動</option>
                <option value="Other">📦 其他雜支</option>
              </select>
            </div>
          </div>

          {/* Receipt attachment element */}
          <div className="bg-white/30 backdrop-blur-xs p-3.5 rounded-xl border border-white/50 flex flex-wrap items-center justify-between gap-3.5">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleReceiptChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-3 bg-white/50 hover:bg-white/80 border border-white/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition text-slate-700 active:scale-95 backdrop-blur-xs"
              >
                <Camera className="h-3.5 w-3.5 text-slate-500" />
                <span>上傳收據照片</span>
              </button>

              <button
                type="button"
                onClick={attachMockReceipt}
                className="py-1.5 px-3.5 bg-indigo-50/60 text-indigo-700 border border-indigo-100/40 rounded-lg text-xs font-medium transition active:scale-95 backdrop-blur-xs"
              >
                模擬附上精美收據
              </button>
            </div>

            {/* Receipt Preview thumbnail */}
            {receiptBase64 && (
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10.5 rounded-md border border-slate-250 overflow-hidden bg-white">
                  <img src={receiptBase64} alt="Receipt Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setReceiptBase64(null)}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 text-white flex items-center justify-center font-bold text-[9px] transition-all"
                  >
                    清除
                  </button>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <Check className="h-3 w-3" />
                  <span>收據已附加</span>
                </span>
              </div>
            )}
          </div>

          <button
            id="add-expense-button"
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition active:scale-98 shadow-sm"
          >
            記此一筆
          </button>
        </form>
      </div>

      {/* Expense ledger entries list */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight px-1">
          記帳明細明細表 ({expenses.length})
        </h2>

        {expenses.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/45 rounded-3xl border border-slate-100">
            <DollarSign className="h-10 w-10 text-slate-300 mx-auto mb-2 stroke-1" />
            <p className="text-sm font-medium text-slate-500">目前尚無任何記帳支出項目</p>
            <p className="text-xs text-slate-400 mt-1">今天買了什麼特產？或搭了電車？快記下一筆與旅伴對帳吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...expenses].reverse().map(expense => {
              let categoryEmoji = '🍱';
              if (expense.category === 'Transport') categoryEmoji = '🚗';
              if (expense.category === 'Stay') categoryEmoji = '🏨';
              if (expense.category === 'Shopping') categoryEmoji = '🛍️';
              if (expense.category === 'Activity') categoryEmoji = '🎯';
              if (expense.category === 'Other') categoryEmoji = '📦';

              return (
                <div 
                  id={`expense-card-${expense.id}`}
                  key={expense.id}
                  className="bg-white/52 backdrop-blur-md p-4.5 rounded-[2rem] border border-white/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] hover:border-indigo-200/60 hover:bg-white/65 transition-all duration-350 flex justify-between gap-4"
                >
                  <div className="flex gap-3.5 items-start">
                    <span className="text-2xl mt-0.5 select-none">{categoryEmoji}</span>
                    
                    <div className="space-y-1.5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">{expense.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full select-none">
                            付款人: {expense.payer === 'Ting' ? 'Ting' : 'Chuan'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 select-none">
                            {new Date(expense.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Display receipt thumbnail if attached */}
                      {expense.receiptImage && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <div className="h-10 w-10 rounded-lg border border-slate-205 overflow-hidden bg-slate-50 select-none cursor-pointer hover:scale-105 transition-all">
                            <img src={expense.receiptImage} alt="Receipt Attachment" className="h-full w-full object-cover" />
                          </div>
                          <span className="text-[10px] text-indigo-650 font-bold flex items-center gap-0.5">
                            <FileText className="h-3 w-3" />
                            <span>有收據照片</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between text-right shrink-0">
                    <button
                      id={`delete-expense-${expense.id}`}
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition"
                      title="刪除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1 mt-2">
                      <div className="text-base font-bold text-slate-800 font-mono">
                        ¥ {expense.amountJpy.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold font-mono">
                        NT$ {Math.round(expense.amountTwd).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
