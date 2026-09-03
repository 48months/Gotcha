pipeline {
    agent any

    environment {
        AWS_REGION     = 'eu-west-1'
        AWS_ACCOUNT_ID = '558050136406'

        AWS_CREDENTIAL = 'aws_prod'

        BACKEND_REPO   = 'thbs-gotcha-backend'
        FRONTEND_REPO  = 'thbs-gotcha-frontend'

        CLUSTER_NAME   = 'prod-green'

        IMAGE_TAG      = "${BUILD_NUMBER}"

        BACKEND_IMAGE  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        FRONTEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
    }

    stages {

        stage('Verify AWS Account') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    echo "=== AWS Identity ==="
                    aws sts get-caller-identity

                    echo "=== Available EKS Clusters ==="
                    aws eks list-clusters --region ${AWS_REGION}

                    echo "=== ECR Repositories ==="
                    aws ecr describe-repositories --region ${AWS_REGION}
                    '''
                }
            }
        }

        stage('Login to ECR') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    aws ecr get-login-password \
                    --region ${AWS_REGION} | \
                    podman login \
                    --username AWS \
                    --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
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

        stage('Verify Images') {
            steps {
                sh '''
                podman images
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    podman push \
                    --remove-signatures \
                    --format docker \
                    ${BACKEND_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    podman push \
                    --remove-signatures \
                    --format docker \
                    ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Configure EKS') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    aws eks update-kubeconfig \
                    --region ${AWS_REGION} \
                    --name ${CLUSTER_NAME}

                    kubectl get nodes
                    '''
                }
            }
        }

        stage('Verify Namespace & Deployments') {
            steps {
                sh '''
                kubectl get ns gotcha || true
                kubectl get deployment -n gotcha || true
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-backend \
                backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                -n gotcha

                kubectl rollout status deployment/gotcha-backend \
                -n gotcha --timeout=300s
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                kubectl set image deployment/gotcha-frontend \
                frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -n gotcha

                kubectl rollout status deployment/gotcha-frontend \
                -n gotcha --timeout=300s
                '''
            }
        }

        stage('Validate Deployment') {
            steps {
                sh '''
                kubectl get pods -n gotcha -o wide
                kubectl get svc -n gotcha
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
            podman image prune -af || true
            docker system prune -af || true
            '''

            cleanWs()
        }
    }
}
