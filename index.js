const { spawn } = require("child_process");
const http = require("http");
const https = require("https");
const fs = require("fs");

// 1. Basic Web Server
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
      console.log("Download complete, waiting for system to release file...");

      // Wait 3 seconds to avoid ETXTBSY error
      setTimeout(() => {
        console.log("Setting permissions and starting tunnel...");
        spawn('chmod', ['+x', fileName]);
        
        const tunnel = spawn(fileName, ['tunnel', '--no-autoupdate', 'run', '--token', token]);

        tunnel.stdout.on('data', (data) => console.log(`Tunnel Log: ${data}`));
        tunnel.stderr.on('data', (data) => console.log(`Tunnel Status: ${data}`));
      }, 3000); 
    });
  });
} else {
  console.log("Error: ARGO_TOKEN not found");
}
