# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build the production-ready static files
RUN npm run build

# Expose the frontend port
EXPOSE 4173

# Use Vite's preview server to serve the app
CMD ["npm", "run", "preview"]
