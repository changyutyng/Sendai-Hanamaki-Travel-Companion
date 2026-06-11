/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityCategory = 'flight' | 'food' | 'shopping' | 'sightseeing' | 'hotel' | 'culture' | 'transit';

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  locationName: string;
  category: ActivityCategory;
  note: string;
  phoneNav?: string; // PHONE_NUMBER / MAPCODE to trigger google maps and car GPS
  isEarlyClosing?: boolean;
  closingTime?: string;
  isCompleted?: boolean;
  image?: string; // Unsplash aesthetic resort/landmark photo
}

export type ProductCategory = 'Medicine' | 'Cosmetics' | 'Snacks' | 'Apparel' | 'Souvenir' | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ProductCategory;
  image?: string;
  isBought: boolean;
  description?: string;
  originalPlaceholder?: boolean;
  isAnalyzing?: boolean;
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Stay' | 'Shopping' | 'Activity' | 'Other';

export interface Expense {
  id: string;
  description: string;
  amountJpy: number;
  amountTwd: number;
  payer: string;
  category: ExpenseCategory;
  receiptImage?: string; // Data URL or Image URL
  createdAt: string;
}

export interface SyncSession {
  sessionId: string;
  partnerName: string;
  partnerEmail: string;
  lastSyncedAt: string;
  isConnected: boolean;
}
