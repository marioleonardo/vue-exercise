# daylight-app/Dockerfile

# --- Build Stage ---
    FROM node:18-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    COPY . .
    
    # Build the Vue app for production
    # Pass build-time environment variables if needed
    # ARG VITE_API_BASE_URL
    # ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
    RUN npm run build
    
    # --- Serve Stage (Example using Vite preview, not ideal for production) ---
    # For real production, use Nginx or another static server
    FROM node:18-alpine AS serve
    
    WORKDIR /app
    
    # Copy built assets from the build stage
    COPY --from=build /app/dist ./dist
    COPY --from=build /app/package*.json ./ # Need package.json for preview command
    # Install only production dependencies if needed by preview or server script
    RUN npm install --only=production
    
    # Expose the port Vite preview runs on (or Nginx port)
    EXPOSE 5173
    
    # Command to serve the built files using Vite's preview server
    # Note: For actual production, replace this with 'nginx -g "daemon off;"' or similar
    # after setting up an nginx.conf file and copying 'dist' contents to nginx html dir.
    # The '--host' flag makes it accessible outside the container.
    CMD ["npm", "run", "preview", "--", "--host"]