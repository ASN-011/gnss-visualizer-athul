FROM node:20-alpine
WORKDIR /app
COPY package.json vite.config.js ./
RUN npm install --no-audit --no-fund --ignore-scripts
RUN npm install -D @vitejs/plugin-react --no-audit --no-fund --ignore-scripts
COPY src ./src
COPY index.html ./index.html
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
