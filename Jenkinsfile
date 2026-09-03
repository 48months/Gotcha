pipeline {
    agent any

    environment {
        AWS_REGION     = 'eu-west-1'
        AWS_ACCOUNT_ID = '558050136406'

        BACKEND_REPO   = 'thbs-gotcha-backend'
        FRONTEND_REPO  = 'thbs-gotcha-frontend'

        CLUSTER_NAME   = 'prod-green'

        IMAGE_TAG      = "${BUILD_NUMBER}"

        BACKEND_IMAGE  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        FRONTEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
    }

    stages {
        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password \
                  --region ${AWS_REGION} | \
                docker login \
                  --username AWS \
                  --password-stdin \
                  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Angular') {
    steps {
        dir('frontend') {
            sh '''
            npm ci
            npx ng build --configuration production
            '''
        }
    }
}

stage('Verify Angular Build') {
    steps {
        dir('frontend') {
            sh '''
            echo "Build output:"
            find dist
            '''
        }
    }
}

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                docker build \
                  -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                  -f backend/Dockerfile \
                  backend
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                docker build \
                  -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                  -f frontend/Dockerfile \
                  frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest

                docker push ${BACKEND_IMAGE}:latest
                docker push ${FRONTEND_IMAGE}:latest
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
            echo 'Deployment Completed Successfully'
        }

        failure {
            echo 'Deployment Failed'
        }

        always {
            sh '''
            docker system prune -af || true
            '''
            cleanWs()
        }
    }
}
