import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'rendinti-db';
const DB_VERSION = 1;

export interface Order {
  id: string;
  merchantId: string;
  items: string[];
  status: 'pending' | 'preparing' | 'pickup' | 'delivered';
  photoUrl?: string;
  customerOtp?: string;
}

export interface OfflineAction {
  id?: number;
  type: 'UPLOAD_PHOTO' | 'UPDATE_ORDER';
  payload: any;
  timestamp: number;
}

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addToQueue(action: OfflineAction) {
  const db = await getDB();
  return db.add('queue', action);
}

export async function getQueue() {
  const db = await getDB();
  return db.getAll('queue');
}

export async function clearQueue() {
  const db = await getDB();
  return db.clear('queue');
}
