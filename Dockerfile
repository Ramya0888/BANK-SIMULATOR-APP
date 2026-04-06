# --------------------- FRONTEND BUILD ---------------------
    FROM node:20-alpine AS frontend-builder
    WORKDIR /app
    COPY bank-frontend/package*.json ./
    RUN npm install
    COPY bank-frontend/ .
    RUN npm run build  # this creates /app/dist
    
    # --------------------- BACKEND BUILD ---------------------
    FROM maven:3.9.3-eclipse-temurin-20 AS backend-builder
    WORKDIR /app
    COPY bank-simulator/pom.xml .
    COPY bank-simulator/src ./src
    RUN mvn clean package -DskipTests
    
    # --------------------- FINAL TOMCAT IMAGE ---------------------
    FROM tomcat:10.1.14-jdk20
    WORKDIR /usr/local/tomcat/webapps/
    
    # Remove default ROOT webapp
    RUN rm -rf ROOT
    
    # Copy backend WAR
    COPY --from=backend-builder /app/target/bank-simulator.war .
    
    # Copy frontend build into WAR folder (so frontend served by Tomcat)
    COPY --from=frontend-builder /app/dist ./bank-simulator
    
    EXPOSE 8082