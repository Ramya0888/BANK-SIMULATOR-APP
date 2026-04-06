pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'bank-frontend'
        BACKEND_DIR = 'bank-simulator'
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "Installing frontend dependencies..."
                    bat 'npm install'

                    echo "Building frontend..."
                    bat 'npx vite build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Building backend WAR..."
                    // Use Maven to build WAR
                    bat 'mvn clean package'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                bat 'docker build -t bank-simulator:latest .'
            }
        }

        stage('Docker Run') {
            steps {
                echo "Running Docker container..."
                // Stop existing container if exists
                bat '''
                docker stop bank-simulator || echo "No existing container"
                docker rm bank-simulator || echo "No existing container"
                docker run -d -p 8080:8080 --name bank-simulator bank-simulator:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Succeeded!'
        }
        failure {
            echo 'Deployment Failed!'
        }
    }
}