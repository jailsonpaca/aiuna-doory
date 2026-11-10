# ---- build the SPA ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: the install scripts only matter for the test tooling (`canvas` compiles a native module that has
# no prebuilt binary for Alpine/musl and needs a compiler); the production build needs none of them.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- serve it (unprivileged nginx on :8080) and reverse-proxy the API ----
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
# nginx runs as uid 101, so these must be readable by it even from a checkout made with umask 077.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY nginx/dns-resolver.envsh /docker-entrypoint.d/05-dns-resolver.envsh
ENV NGINX_ENVSUBST_FILTER=NGINX_RESOLVER
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER root
RUN chmod a+rX /etc/nginx/templates/default.conf.template \
    /etc/nginx/snippets/security-headers.conf \
    && chmod a+rx /docker-entrypoint.d/05-dns-resolver.envsh \
    && chmod -R a+rX /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
