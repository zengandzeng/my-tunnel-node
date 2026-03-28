FROM cloudflare/cloudflared:latest
ENTRYPOINT ["sh", "-c", "cloudflared tunnel --no-autoupdate run --token ${ARGO_TOKEN}"]
