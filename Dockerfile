# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Install Git (required for npm to pull git dependencies)
RUN apk add --no-cache git

# Set to production for optimization
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port Fastify listens on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
