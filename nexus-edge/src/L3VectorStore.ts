import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface L3Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
  timestamp: string;
}

/**
 * A lightweight, local JSON-based "Vector Store" implementation.
 * For this demo, we use a simple keyword-based search or mock embeddings.
 * In a real-world scenario, this would interface with ChromaDB, Pinecone, or use a local embedding model.
 */
export class L3VectorStore {
  private storePath: string;
  private documents: L3Document[] = [];

  constructor(storePath: string = 'memory/l3/vector_store.json') {
    this.storePath = storePath;
  }

  async init() {
    const dir = path.dirname(this.storePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      const data = await fs.readFile(this.storePath, 'utf-8');
      this.documents = JSON.parse(data);
    } catch (e) {
      this.documents = [];
    }
  }

  async save() {
    await fs.writeFile(this.storePath, JSON.stringify(this.documents, null, 2));
  }

  async addDocument(content: string, metadata: Record<string, any> = {}) {
    const doc: L3Document = {
      id: crypto.randomUUID(),
      content,
      metadata,
      timestamp: new Date().toISOString(),
      // Mock embedding generation: simple word count vector for demonstration
      embedding: this.mockEmbed(content)
    };
    this.documents.push(doc);
    await this.save();
    return doc;
  }

  /**
   * Simple mock semantic search.
   * Compares the query content with documents using basic keyword overlap as a proxy for "semantic" similarity.
   */
  async search(query: string, limit: number = 5): Promise<L3Document[]> {
    const queryTerms = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    
    const scoredDocs = this.documents.map(doc => {
      const docTerms = doc.content.toLowerCase().split(/\W+/);
      let score = 0;
      queryTerms.forEach(term => {
        if (docTerms.includes(term)) score++;
      });
      return { doc, score };
    });

    return scoredDocs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc);
  }

  private mockEmbed(text: string): number[] {
    // Return a dummy 128-dim vector
    return Array.from({ length: 128 }, () => Math.random());
  }

  getStats() {
    return {
      count: this.documents.length,
      path: this.storePath
    };
  }
}
