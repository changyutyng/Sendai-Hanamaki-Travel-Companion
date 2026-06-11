/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wifi, RefreshCw, Send, Users, Check, Copy } from 'lucide-react';
import { SyncSession } from '../types';

interface SyncIndicatorProps {
  session: SyncSession;
  onRefresh: () => void;
  onUpdateSession: (newSession: Partial<SyncSession>) => void;
}

export default function SyncIndicator({ session, onRefresh, onUpdateSession }: SyncIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncCodeInput, setSyncCodeInput] = useState('');

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onRefresh();
    }, 1200);
  };

  const copySyncLink = () => {
    const syncUrl = `${window.location.origin}?syncSession=${session.sessionId}`;
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncCodeInput.trim()) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdateSession({
        sessionId: syncCodeInput.toUpperCase(),
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('zh-TW', { hour12: false })
      });
      setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      {/* Mini status indicator bar on top */}
      <div 
        id="sync-status-indicator"
        className="glass-panel px-4 py-2 rounded-full shadow-xs flex items-center justify-between gap-3 text-xs cursor-pointer active:scale-98 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${session.isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${session.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-medium text-slate-700">
            {session.isConnected ? `已連線: ${session.partnerName}` : '離線暫存中'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 border-l border-slate-200 pl-2">
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
          <span>{isSyncing ? '同步中...' : '同步'}</span>
        </div>
      </div>

      {/* Sync Management drawer / modal */}
      {isOpen && (
        <div 
          id="sync-modal-overlay" 
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            id="sync-modal-container"
            className="w-full sm:max-w-md bg-white rounded-t-4xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden transition-all duration-300 transform translate-y-0 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab bar for mobile look */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-slate-900 tracking-tight">旅伴雲端同步</h3>
                  <p className="text-xs text-slate-500">多人即時記帳 & 行程即時分享</p>
                </div>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-600 font-medium text-sm p-1"
                onClick={() => setIsOpen(false)}
              >
                關閉
              </button>
            </div>

            <div className="space-y-5">
              {/* Active Connection state card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">當前同步狀態</span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Wifi className="h-3 w-3" />
                    <span>即時連線中</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-display font-semibold text-sm">
                    {session.partnerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{session.partnerName}</div>
                    <div className="text-xs text-slate-400 font-mono">{session.partnerEmail}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>同步代碼: <span className="font-mono font-semibold text-slate-700">{session.sessionId}</span></span>
                  <span>最後更新時間: {session.lastSyncedAt}</span>
                </div>
              </div>

              {/* Share section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">分享同步邀請</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  將此旅程的同步碼分享給您的旅伴，即可在一台裝置記帳或勾選清單時，即時在對方螢幕同步。
                </p>

                <div className="flex gap-2 mt-2">
                  <button 
                    id="copy-sync-link-btn"
                    onClick={copySyncLink}
                    className="flex-1 py-3 px-4 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/50 text-xs font-medium flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-98 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>已複製邀請連結！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>複製專屬同步網址</span>
                      </>
                    )}
                  </button>

                  <button 
                    id="manual-sync-btn"
                    onClick={triggerSync}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>立即重整理</span>
                  </button>
                </div>
              </div>

              {/* Connect to another Session block */}
              <div className="pt-2 border-t border-slate-100">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium text-xs text-slate-600 cursor-pointer list-none select-none py-2 hover:text-slate-800">
                    <span>輸入旅伴的同步代碼連線</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>

                  <form onSubmit={handleConnectSync} className="mt-2 space-y-2 group-open:animate-slide-down">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="請輸入例如: SENDAI-2026-616"
                        value={syncCodeInput}
                        onChange={(e) => setSyncCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
                      />
                      <button 
                        type="submit"
                        className="py-2 px-3 bg-slate-900 text-white font-medium text-xs rounded-xl hover:bg-black active:scale-98 transition-all"
                      >
                        連線
                      </button>
                    </div>
                  </form>
                </details>
              </div>

              {/* Hoshino-style visual Zen Footer note */}
              <p className="text-[10px] text-center text-slate-400 font-serif italic py-1">
                KAI Akiu Resort Companion — 宮城奥敷山溪流之美
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
