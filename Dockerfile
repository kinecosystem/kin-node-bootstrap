FROM node:8.16

# Create the workdir
RUN mkdir -p /opt/bootstrap/src

# Set the workdir
WORKDIR /opt/bootstrap

# Copy the pipfiles
COPY package* .env ./

# Install dependencies
RUN npm install

# Copy the code
COPY src/ ./src

CMD npm run prod
