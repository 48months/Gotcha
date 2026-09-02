pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'

        ECR_ACCOUNT_ID = '123456789012'

        FRONTEND_REPO = 'gotcha-frontend'
        BACKEND_REPO  = 'gotcha-backend'

        FRONTEND_IMAGE = "${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
        BACKEND_IMAGE  = "${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"

        EKS_CLUSTER = 'gotcha-eks'

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('AWS Login') {
            steps {
                sh '''
                aws ecr get-login-password \
                --region ${AWS_REGION} | \
                docker login \
                --username AWS \
                --password-stdin ${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build \
                -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build \
                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Configure EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig \
                  --region ${AWS_REGION} \
                  --name ${EKS_CLUSTER}
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-backend \
                  backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                  -n gotcha

                kubectl rollout status deployment/gotcha-backend -n gotcha
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-frontend \
                  frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                  -n gotcha

                kubectl rollout status deployment/gotcha-frontend -n gotcha
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }

        failure {
            echo 'Deployment Failed!'
        }
    }
}
