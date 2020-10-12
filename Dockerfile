# This images has node and NPM installed
FROM node:12

# Changed the working directory
WORKDIR /usr/src/app

# Copy tha package.json files and install packages
COPY package*.json ./
RUN npm install

# Copy the application
COPY . .

# Expose port 80
EXPOSE 3000

# Set the application to run of port 80 (Note: you might need root privileges)
ENV PORT=3000

# Database details
ENV MONGO_HOST=10.5.0.6
ENV MONGO_PORT=27018

# Start the application
CMD [ "npm", "start" ];