const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

// 1. 创建一个简单的 Web 服务，让 Railway 认为程序运行正常
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Tunnel is Running");
}).listen(process.env.PORT || 8080);

// 2. 自动下载并运行 Cloudflared (隧道核心)
const token = process.env.ARGO_TOKEN;
if (token) {
  console.log("检测到 Token，正在启动 Cloudflare 隧道...");
  // 下载 cloudflared 并在内存中执行
  const tunnel = spawn('sh', ['-c', `curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared && chmod +x cloudflared && ./cloudflared tunnel --no-autoupdate run --token ${token}`]);

  tunnel.stdout.on('data', (data) => console.log(`隧道日志: ${data}`));
  tunnel.stderr.on('data', (data) => console.error(`隧道状态: ${data}`));
} else {
  console.error("错误：未检测到 ARGO_TOKEN 环境变量！");
}

// 3. 运行你的节点核心 (这里以简单的提示为例)
console.log("节点服务已就绪，等待隧道连接...");
