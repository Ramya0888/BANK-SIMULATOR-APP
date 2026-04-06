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
                echo "Pulling latest code from GitHub..."
                checkout scm
            }
        }

        stage('Build & Deploy Docker') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${DOCKER_IMAGE} ."

                    // Stop & remove existing container if running
                    sh """
                        if [ \$(docker ps -q -f name=${DOCKER_CONTAINER}) ]; then
                            docker stop ${DOCKER_CONTAINER}
                            docker rm ${DOCKER_CONTAINER}
                        fi
                    """

                    echo "Starting Docker container..."
                    sh "docker run -d -p ${APP_PORT}:8080 --name ${DOCKER_CONTAINER} ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Checking if Docker container is running..."
                sh "docker ps -a"
                echo "✅ Deployment complete. Access app at http://localhost:${APP_PORT}/bank-simulator"
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment succeeded!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}