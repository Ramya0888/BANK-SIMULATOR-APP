pipeline {
    agent any

    environment {
        // Add any environment variables here if needed
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Checkout the main repo
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    // Windows uses bat instead of sh
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                // Make sure Docker Desktop is running on Windows
                bat 'docker build -t bank-simulator:latest .'
            }
        }

        stage('Docker Run') {
            steps {
                bat 'docker run -d -p 3000:3000 --name bank-simulator bank-simulator:latest'
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