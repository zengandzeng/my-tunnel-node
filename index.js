const { spawn } = require('child_process');
const http = require('http');

// 创建一个简单的 HTTP 服务，防止 Railway 认为程序没启动
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Service is running");
}).listen(process.env.PORT || 8080);

console.log("正在启动核心组件...");

// 这里会自动运行你配置在变量里的指令
// 实际上我们会在 Railway 的环境变量里配置具体的运行参数
