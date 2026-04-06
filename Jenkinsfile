# --------------------- FRONTEND BUILD ---------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY bank-frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY bank-frontend/ . 
RUN npm run build

# --------------------- BACKEND BUILD ---------------------
FROM maven:3.9.3-eclipse-temurin-20 AS backend-builder
WORKDIR /app/backend

# Copy backend pom.xml and source, then package WAR
COPY bank-simulator/pom.xml .
COPY bank-simulator/src ./src
RUN mvn clean package

# --------------------- FINAL TOMCAT IMAGE ---------------------
FROM tomcat:10.1-jdk20-temurin
WORKDIR /usr/local/tomcat/webapps/

# Remove default ROOT app
RUN rm -rf ROOT

# Copy backend WAR
COPY --from=backend-builder /app/backend/target/bank-simulator.war ./bank-simulator.war

# Copy frontend build inside a folder (optional, e.g., /bank-simulator)
COPY --from=frontend-builder /app/frontend/dist ./bank-simulator

# Expose Tomcat port
EXPOSE 8082

# Start Tomcat
CMD ["catalina.sh", "run"]