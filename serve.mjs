/**
 * serve.mjs — 零依赖轻量本地服务
 *
 * 为什么不能双击 index.html：
 *   ES Modules 在 file:// 协议下受 CORS 限制无法加载，
 *   IndexedDB 在 file:// 下亦不可靠。必须通过 HTTP 访问。
 *
 * 用法：
 *   node serve.mjs            → http://localhost:5173
 *   PORT=8080 node serve.mjs  → http://localhost:8080
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif':  'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.ico':  'image/x-icon',
  '.md':   'text/markdown; charset=utf-8',
};

/** 把 URL 路径安全解析到 ROOT 内的真实路径（防目录穿越） */
function resolveSafe(urlPath) {
  // 先剥离 query 与 hash
  const qIdx = urlPath.indexOf('?');
  const hIdx = urlPath.indexOf('#');
  const qEnd = qIdx === -1 ? urlPath.length : qIdx;
  const hEnd = hIdx === -1 ? urlPath.length : hIdx;
  const raw = urlPath.substring(0, Math.min(qEnd, hEnd));

  const decoded = decodeURIComponent(raw);
  // 根路径 → index.html
  const normalized = decoded === '/' ? '/index.html' : decoded;
  const rel = normalize(normalized).replace(/^([/\\])+/, '');
  const full = join(ROOT, rel);

  // 逃逸检查
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

const server = createServer(async (req, res) => {
  const full = resolveSafe(req.url || '/');

  if (!full) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  try {
    const body = await readFile(full);
    const type = MIME[extname(full).toLowerCase()] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': type,
      // 开发期禁用缓存，改 CSS/JS 后刷新即生效
      'Cache-Control': 'no-store, must-revalidate',
    });
    res.end(body);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found — ' + decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]));
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
    }
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  端口 ${PORT} 已被占用。`);
    console.error(`  换一个端口：  PORT=8080 node serve.mjs\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`\n  综合楼 — Y2K 电脑 ARG 已启动`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  本机访问    http://localhost:${PORT}/`);
  console.log(`  换端口      PORT=8080 node serve.mjs`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  保持本窗口开启即可；关闭窗口 = 停止服务`);
  console.log(`  若浏览器连不上，说明本进程已退出，重新运行 start-server.bat 或 node serve.mjs\n`);
});
