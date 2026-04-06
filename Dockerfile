# Dockerfile
FROM tomcat:10.1-jdk17

# Remove default ROOT
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy backend WAR to Tomcat webapps as ROOT.war
COPY bank-simulator/target/bank-simulator.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080