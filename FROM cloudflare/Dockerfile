FROM cloudflare/cloudflared:latest
# 这种写法不依赖 sh，直接由容器内核启动程序
CMD ["tunnel", "--no-autoupdate", "run", "--token", "${ARGO_TOKEN}"]
