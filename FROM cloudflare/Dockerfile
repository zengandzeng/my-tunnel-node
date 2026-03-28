FROM cloudflare/cloudflared:latest
# 直接运行程序，不依赖 sh
CMD ["tunnel", "--no-autoupdate", "run", "--token", "${ARGO_TOKEN}"]
