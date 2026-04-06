pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        FRONTEND_DIR = 'bank-frontend'
        BACKEND_DIR  = 'bank-simulator'
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
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Building backend WAR..."
                    // If Maven backend
                    bat 'mvn clean package'
                    // If Gradle backend, replace with: bat 'gradle build'
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
                bat 'docker stop bank-simulator || echo "Container not running"'
                bat 'docker rm bank-simulator || echo "Container not present"'
                bat 'docker run -d -p 8080:8080 --name bank-simulator bank-simulator:latest'
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