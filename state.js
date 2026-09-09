/* ==========================================================================
   游戏状态 — IndexedDB 主存 + LocalStorage 兜底
   ==========================================================================
   设计原则：
   - IndexedDB 不可用时（隐私模式 / 旧浏览器）自动降级到 LocalStorage
   - LocalStorage 也不可用时降级到内存，游戏仍可玩，只是刷新后重置
   - 绝不因为存档失败而阻断游戏
   ========================================================================== */

const DB_NAME = 'arg-archive';
const DB_VERSION = 1;
const STORE = 'state';
const LS_KEY = 'arg-archive:state';

const DEFAULT_STATE = {
  current: 'medical',   // 当前页面 id
  visited: [],          // 已访问页面 id
  clues: [],            // 已收集线索（预留）
  progress: 'p0',       // 剧情进度：p0→p1(002)→p2(003/004)→p3(约定)→p4(查李永钦)→p5
  day: 1,               // 当前游戏内天数
  flags: {},            // 剧情旗标 { forumRoute, d3Played, d4Played, keyRead, ... }
  readPosts: {},        // 已读论坛帖 { t1017: 1, ... }
  searchHistory: [],    // 004 搜索历史
  playerNote: '',       // 记事本文本（玩家私人，游戏不读取）
  bookmarks: [],        // 青搜收藏夹 [{id,title,key}]（增量字段）
  vvRead: {},           // 003 已读会话
  updatedAt: null,
};

/* ---------------- 内存兜底 ---------------- */
let memoryFallback = { ...DEFAULT_STATE };

/* ---------------- IndexedDB ---------------- */
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err);
      return;
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blocked'));
  }).catch((err) => {
    dbPromise = null;         // 允许后续重试
    throw err;
  });

  return dbPromise;
}

function idbGet(key) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function idbSet(key, value) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  }));
}

/* ---------------- LocalStorage 兜底 ---------------- */
function lsGet() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function lsSet(value) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(value));
    return true;
  } catch { return false; }
}

/* ---------------- 对外 API ---------------- */

/** 读取状态。任何一层失败都自动降级，永不 reject。 */
export async function load() {
  let result;
  try {
    const fromIdb = await idbGet('game');
    if (fromIdb) result = { ...DEFAULT_STATE, ...fromIdb };
  } catch { /* 降级到 LocalStorage */ }
  if (!result) {
    const fromLs = lsGet();
    if (fromLs) result = { ...DEFAULT_STATE, ...fromLs };
  }
  if (!result) result = { ...DEFAULT_STATE, ...memoryFallback };
  lastKnown = result;
  return result;
}

/* 保存串行化：并发 setState（如 VV 消息与回复同时发生）不再互相覆盖 */
let saveQueue = Promise.resolve();
let lastKnown = null;

/** 保存状态。三层都失败也只静默降级，不抛错。
 *  flags 等嵌套对象按"键级合并"处理，并发补丁不会丢键。 */
export function save(patch) {
  saveQueue = saveQueue.then(() => doSave(patch));
  return saveQueue;
}

async function doSave(patch) {
  const prev = lastKnown || await load();
  const next = { ...prev, ...patch, updatedAt: Date.now() };
  if (patch.flags) next.flags = { ...(prev.flags || {}), ...patch.flags };
  if (patch.readPosts) next.readPosts = { ...(prev.readPosts || {}), ...patch.readPosts };
  try {
    const d = JSON.parse(localStorage.getItem('__dbg') || '[]');
    d.push([(window.__bootId || '?').slice(0, 5), Date.now() % 100000, Object.keys(patch).join('+'), 'prog=' + next.progress, 'fl=' + Object.keys(next.flags).length, 'bm=' + (next.bookmarks || []).length]);
    localStorage.setItem('__dbg', JSON.stringify(d.slice(-12)));
  } catch {}

  lastKnown = next;                            // 关键：链条延续，否则每次都从空态出发互相覆盖
  memoryFallback = next;
  try {
    await idbSet('game', next);
  } catch {
    lsSet(next);
  }
  return next;
}

/** 清空存档（供后续「重新开始」使用） */
export async function reset() {
  memoryFallback = { ...DEFAULT_STATE };
  lastKnown = null;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete('game');
  } catch { /* 忽略 */ }
  try { localStorage.removeItem(LS_KEY); } catch { /* 忽略 */ }
  return { ...DEFAULT_STATE };
}
