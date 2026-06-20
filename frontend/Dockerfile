# TS Assistant frontend — build the Vite/React app, then serve the static bundle
# with nginx. The bundle talks to the backend at http://<window.location.hostname>:8008
# at *runtime*, so one image works for any host without a rebuild.
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (cached unless package-lock.json changes).
COPY package.json package-lock.json ./
RUN npm ci

# Optional: pin the backend API base at build time (e.g. when you publish the
# backend on a non-8008 port). Leave unset to use the runtime default above.
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

COPY . .
RUN npm run build

# --- serve -----------------------------------------------------------------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
