pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "bank-simulator:latest"
        DOCKER_CONTAINER = "bank-simulator-container"
        APP_PORT = "8082"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Pulling latest code..."
                checkout scm
            }
        }

        stage('Build & Deploy Docker') {
            steps {
                script {
                    echo "Building Docker image..."
                    bat 'docker build -t %DOCKER_IMAGE% .'

                    bat """
                    if docker ps -q -f name=%DOCKER_CONTAINER% (
                        docker stop %DOCKER_CONTAINER%
                        docker rm %DOCKER_CONTAINER%
                    )
                    """

                    echo "Starting Docker container..."
                    bat 'docker run -d -p %APP_PORT%:8080 --name %DOCKER_CONTAINER% %DOCKER_IMAGE%'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Checking container..."
                bat 'docker ps -a'
                echo "Access app at http://localhost:%APP_PORT%/bank-simulator"
            }
        }
    }

    post {
        success { echo "🎉 Deployment succeeded!" }
        failure { echo "❌ Deployment failed!" }
    }
}