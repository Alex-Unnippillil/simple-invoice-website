# Local HTTPS with mkcert

This project can be served locally over HTTPS using a locally-trusted certificate.

## Generate certificates

1. Install [mkcert](https://github.com/FiloSottile/mkcert).
   - Debian/Ubuntu: `apt-get install mkcert`
   - macOS (Homebrew): `brew install mkcert`
2. Install the local certificate authority:
   ```bash
   mkcert -install
   ```
3. Create a directory for certificates and generate one for `localhost`:
   ```bash
   mkdir certs
   mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1
   ```

The `certs/` directory is ignored by git.

## Caddy reverse proxy

A sample `Caddyfile` is included at the repo root:

```
localhost:8443 {
    tls certs/localhost.pem certs/localhost-key.pem
    reverse_proxy localhost:3000
}
```

Start the application and Caddy:

```bash
node server.js &
caddy run --config Caddyfile
```

Visit https://localhost:8443 in your browser. The page should load without TLS warnings and proxy traffic to the development server running on port 3000.
