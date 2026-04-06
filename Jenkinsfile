pipeline {
    agent any

    environment {
        MVN_HOME = "/usr/local/maven"  // adjust if using custom Maven path
        DOCKER_IMAGE = "bank-management:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ramya0888/BANK-SIMULATOR'
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'  // generates dist/
                }
                // Copy frontend build to backend webapp
                sh 'cp -r frontend/dist/* backend/src/main/webapp/'
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Docker Run') {
            steps {
                // Stop & remove old container if exists
                sh "docker rm -f bank-simulator || true"
                // Run new container mapping host port 8081 to container 8080
                sh "docker run -d --name bank-simulator -p 8081:8080 ${DOCKER_IMAGE}"
            }
        }
    }

    post {
        success {
            echo "Deployment Successful! Access the app at http://localhost:8081/"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}