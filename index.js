const { spawn } = require('child_process');
const http = require('http');

// 1. 基础服务
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Tunnel is Running");
}).listen(process.env.PORT || 8080);

const token = process.env.ARGO_TOKEN;

if (token) {
  console.log("检测到 Token，正在尝试启动隧道...");

  // 改用 wget 或者直接通过特定的 shell 命令
  // 我们尝试使用更稳健的方式运行
  const tunnel = spawn('sh', ['-c', `wget -O cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && chmod +x cloudflared && ./cloudflared tunnel --no-autoupdate run --token ${token}`]);

  tunnel.stdout.on('data', (data) => console.log(`日志: ${data}`));
  tunnel.stderr.on('data', (data) => console.log(`状态: ${data}`));
} else {
  console.log("错误：未找到 Token");
}
