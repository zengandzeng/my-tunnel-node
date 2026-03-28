const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');

// 1. 基础 Web 服务
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Service is standby");
}).listen(process.env.PORT || 8080);

const token = process.env.ARGO_TOKEN;
const fileName = './cloudflared';

if (token) {
  console.log("正在下载核心组件...");
  const file = fs.createWriteStream(fileName);

  https.get("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("下载已完成，等待系统释放文件...");

      // 关键修正：给系统 2 秒钟缓冲，避免 ETXTBSY 报错
      setTimeout(() => {
        console.log("正在赋予执行权限并启动隧道...");
        spawn('chmod', ['+x', fileName]);
        
        const tunnel = spawn(fileName, ['tunnel', '--no-autoupdate', 'run', '--token', token]);

        tunnel.stdout.on('data', (data) => console.log(`隧道日志: ${data}`));
        tunnel.stderr.on('data', (data) => console.log(`隧道状态: ${data}`));
      }, 2000); 
    });
  });
} else {
  console.log("错误：未找到 ARGO_TOKEN");
}
