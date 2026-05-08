# Base image
FROM node:20-slim

# Application directory
WORKDIR /usr/src/app

# Dependency installation
COPY package*.json ./
RUN npm ci --omit=dev

# Application source
COPY . .

# Environment configuration
ENV PORT=8080
EXPOSE $PORT

# Execution
CMD [ "npm", "start" ]
