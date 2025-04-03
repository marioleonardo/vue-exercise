# sunlight-service/Dockerfile

# Use an official Node runtime as a parent image
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules # Copy installed node_modules

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"] # Use npm start if it runs node dist/index.js
# CMD ["npm", "start"]