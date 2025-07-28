import fs from 'fs/promises';
import path from 'path';
import * as chokidar from 'chokidar';
import { WebSocket } from 'ws';

export class FileManager {
  private publicDir: string;
  private watcher: chokidar.FSWatcher | null = null;
  private clients: Set<WebSocket> = new Set();

  constructor() {
    this.publicDir = path.resolve(process.cwd(), 'public');
  }

  async ensurePublicDir(): Promise<void> {
    try {
      await fs.access(this.publicDir);
    } catch {
      await fs.mkdir(this.publicDir, { recursive: true });
    }
  }

  async writeFiles(files: Record<string, string>): Promise<void> {
    await this.ensurePublicDir();
    
    const writePromises = Object.entries(files).map(async ([filename, content]) => {
      const filePath = path.join(this.publicDir, filename);
      const dir = path.dirname(filePath);
      
      // Ensure directory exists
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
      
      await fs.writeFile(filePath, content, 'utf-8');
    });

    await Promise.all(writePromises);
  }

  async readFiles(): Promise<Record<string, string>> {
    await this.ensurePublicDir();
    const files: Record<string, string> = {};
    
    try {
      const entries = await fs.readdir(this.publicDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const content = await fs.readFile(
            path.join(this.publicDir, entry.name), 
            'utf-8'
          );
          files[entry.name] = content;
        }
      }
    } catch (error) {
      console.warn('Error reading files:', error);
    }
    
    return files;
  }

  startWatching(): void {
    if (this.watcher) return;

    this.watcher = chokidar.watch(this.publicDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('change', () => this.notifyClients('reload'))
      .on('add', () => this.notifyClients('reload'))
      .on('unlink', () => this.notifyClients('reload'));
  }

  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  addClient(ws: WebSocket): void {
    this.clients.add(ws);
    
    ws.on('close', () => {
      this.clients.delete(ws);
    });
  }

  private notifyClients(message: string): void {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: message }));
      }
    });
  }

  notifyAllClients(message: string): void {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  getPublicDir(): string {
    return this.publicDir;
  }
}

export const fileManager = new FileManager();
