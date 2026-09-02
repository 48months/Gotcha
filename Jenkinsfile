pipeline {
    agent any

    environment {

        AWS_REGION = "eu-west-1"
        AWS_ACCOUNT_ID = "558050136406"

        ECR_REPO = "thbs-gotcha"

        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"

        CLUSTER_NAME = "thbs-eks"

        BUILD_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password \
                --region ${AWS_REGION} | \
                docker login \
                --username AWS \
                --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                docker build \
                -t backend:${BUILD_TAG} \
                -f backend/Dockerfile \
                backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                docker build \
                -t frontend:${BUILD_TAG} \
                -f frontend/Dockerfile \
                frontend
                '''
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag backend:${BUILD_TAG} \
                ${ECR_URI}:backend-${BUILD_TAG}

                docker tag frontend:${BUILD_TAG} \
                ${ECR_URI}:frontend-${BUILD_TAG}
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push ${ECR_URI}:backend-${BUILD_TAG}
                docker push ${ECR_URI}:frontend-${BUILD_TAG}
                '''
            }
        }

        stage('Configure EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig \
                --region ${AWS_REGION} \
                --name ${CLUSTER_NAME}
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-backend \
                backend=${ECR_URI}:backend-${BUILD_TAG} \
                -n gotcha

                kubectl rollout status deployment/gotcha-backend -n gotcha
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-frontend \
                frontend=${ECR_URI}:frontend-${BUILD_TAG} \
                -n gotcha

                kubectl rollout status deployment/gotcha-frontend -n gotcha
                '''
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af || true'
        }
    }
}
