const { spawn, exec } = require("child_process");
const http = require("http");
const https = require("https");
const fs = require("fs");

// 1. 基础 Web 服务
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Service is running");
}).listen(process.env.PORT || 8080);

const token = process.env.ARGO_TOKEN;
const fileName = "./cloudflared";

if (token) {
  console.log("Downloading core components...");
  const file = fs.createWriteStream(fileName);

  https.get("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("Download complete. Setting permissions...");

      // 关键修正：使用 exec 确保权限更改完成后再执行后续操作
      exec(`chmod +x ${fileName}`, (error) => {
        if (error) {
          console.error(`Permission error: ${error}`);
          return;
        }
        
        console.log("Permissions set. Starting tunnel...");
        // 延迟 1 秒给系统缓冲
        setTimeout(() => {
          const tunnel = spawn(fileName, ['tunnel', '--no-autoupdate', 'run', '--token', token]);

          tunnel.stdout.on('data', (data) => console.log(`Tunnel Log: ${data}`));
          tunnel.stderr.on('data', (data) => {
            const msg = data.toString();
            // 过滤掉无关的连接信息，只看核心状态
            if (msg.includes("error") || msg.includes("Connected")) {
               console.log(`Tunnel Status: ${msg}`);
            }
          });
        }, 1000);
      });
    });
  });
} else {
  console.log("Error: ARGO_TOKEN not found");
}
