import fs from 'fs/promises';
import path from 'path';
import { L3VectorStore } from './L3VectorStore.js';

export class MemoryManager {
  private l1Cache: Map<string, any[]> = new Map();
  private l2Dir: string;
  private l3Store: L3VectorStore;

  constructor(l2Dir: string = 'memory/l2', l3Path: string = 'memory/l3/vector_store.json') {
    this.l2Dir = l2Dir;
    this.l3Store = new L3VectorStore(l3Path);
  }

  async init() {
    await fs.mkdir(this.l2Dir, { recursive: true });
    await this.l3Store.init();
  }

  // L1: In-memory context
  storeL1(key: string, data: any) {
    if (!this.l1Cache.has(key)) {
      this.l1Cache.set(key, []);
    }
    this.l1Cache.get(key)!.push({
      data,
      timestamp: new Date().toISOString()
    });
  }

  getL1(key: string) {
    return this.l1Cache.get(key) || [];
  }

  // L2: Scratchpad (Local File Storage)
  async storeL2(filename: string, data: any) {
    const filePath = path.join(this.l2Dir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async readL2(filename: string) {
    const filePath = path.join(this.l2Dir, filename);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      return null;
    }
  }

  async listL2() {
    return await fs.readdir(this.l2Dir);
  }

  // L3: Long-term (Vector Store)
  async storeL3(content: string, metadata: Record<string, any> = {}) {
    return await this.l3Store.addDocument(content, metadata);
  }

  async queryL3(query: string, limit: number = 3) {
    return await this.l3Store.search(query, limit);
  }

  getStats() {
    return {
      l1: this.l1Cache.size,
      l2: this.l2Dir,
      l3: this.l3Store.getStats()
    };
  }
}
