pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "bank-management:latest"
        CONTAINER_NAME = "bank-management"
        HOST_PORT = "8081"   // Access app at localhost:8081
        CONTAINER_PORT = "8080"
    }

    stages {
        stage('Build Frontend') {
            steps {
                dir('bank-frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('bank-simulator') {
                    bat 'xcopy /E /I /Y "..\\bank-frontend\\dist\\*" "src\\main\\webapp\\"'
                    bat 'mvn clean package'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %DOCKER_IMAGE% ."
            }
        }

        stage('Run Docker Container') {
            steps {
                // Stop and remove existing container if it exists
                bat "docker stop %CONTAINER_NAME% || exit 0"
                bat "docker rm %CONTAINER_NAME% || exit 0"
                // Run new container
                bat "docker run -d -p %HOST_PORT%:%CONTAINER_PORT% --name %CONTAINER_NAME% %DOCKER_IMAGE%"
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful! Access at http://localhost:8081"
        }
        failure {
            echo "❌ Deployment Failed"
        }
    }
}