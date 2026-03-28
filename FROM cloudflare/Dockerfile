FROM cloudflare/cloudflared:latest
# 这种写法不通过 shell 启动，直接运行二进制，完美避开所有报错
ENTRYPOINT ["cloudflared", "tunnel", "--no-autoupdate", "run"]
