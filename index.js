const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');

// 1. 创建基础 Web 服务
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Service Running");
}).listen(process.env.PORT || 8080);

const token = process.env.ARGO_TOKEN;
const fileName = 'cloudflared';

if (token) {
  console.log("正在通过内置引擎下载核心组件...");
  
  // 使用 Node.js 内置的 https 模块下载，不依赖 wget/curl
  const file = fs.createWriteStream(fileName);
  https.get("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("下载完成，正在启动隧道...");
      
      // 赋予执行权限并启动
      spawn('chmod', ['+x', fileName]);
      const tunnel = spawn('./' + fileName, ['tunnel', '--no-autoupdate', 'run', '--token', token]);

      tunnel.stdout.on('data', (data) => console.log(`隧道日志: ${data}`));
      tunnel.stderr.on('data', (data) => console.log(`隧道状态: ${data}`));
    });
  });
} else {
  console.log("错误：未找到 ARGO_TOKEN");
}
