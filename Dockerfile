# Use official Tomcat image with JDK 17
FROM tomcat:10.1-jdk17

# Remove default Tomcat apps to avoid conflicts
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy built WAR to Tomcat webapps as ROOT.war
COPY bank-simulator/target/bank-simulator.war /usr/local/tomcat/webapps/ROOT.war

# Expose Tomcat port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]