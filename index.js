const { exec } = require("child_process");
const http = require("http");
const https = require("https");
const fs = require("fs");

// 保持服务在线
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Service is running");
}).listen(process.env.PORT || 8080);

const token = process.env.ARGO_TOKEN;
const fileName = "cloudflared";

if (token) {
  console.log("Checking components...");
  const file = fs.createWriteStream(fileName);

  https.get("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("Download complete. Starting Tunnel...");
      
      // 直接使用 shell 命令启动，简单粗暴有效
      const cmd = `chmod +x ./cloudflared && ./cloudflared tunnel --no-autoupdate run --token ${token}`;
      const tunnel = exec(cmd);

      tunnel.stdout.on('data', (data) => console.log(`Log: ${data}`));
      tunnel.stderr.on('data', (data) => console.log(`Status: ${data}`));
    });
  });
} else {
  console.log("Error: ARGO_TOKEN is missing!");
}
