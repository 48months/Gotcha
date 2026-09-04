pipeline {
    agent any

    environment {
        AWS_REGION      = 'eu-west-1'
        AWS_ACCOUNT_ID  = '558050136406'

        AWS_CREDENTIAL  = 'aws_prod'

        BACKEND_REPO    = 'thbs-gotcha-backend'
        FRONTEND_REPO   = 'thbs-gotcha-frontend'

        CLUSTER_NAME    = 'prod-green'

        IMAGE_TAG       = "${BUILD_NUMBER}"

        BACKEND_IMAGE   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        FRONTEND_IMAGE  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
    }

    stages {

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
                    echo "=== Build Output ==="
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
        -t ${BACKEND_IMAGE}:latest \
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
        -t ${FRONTEND_IMAGE}:latest \
        -f frontend/Dockerfile \
        frontend
        '''
    }
}

        stage('Verify Images') {
            steps {
                sh '''
                echo "=== Available Images ==="
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

            podman push \
            --remove-signatures \
            --format docker \
            ${BACKEND_IMAGE}:latest
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

            podman push \
            --remove-signatures \
            --format docker \
            ${FRONTEND_IMAGE}:latest
            '''
        }
    }
}

        stage('Deploy To EKS') {
            steps {
                withAWS(
                    credentials: "${AWS_CREDENTIAL}",
                    region: "${AWS_REGION}"
                ) {
                    sh '''
                    set -e

                    echo "=== Configure EKS ==="
                    aws eks update-kubeconfig \
                        --region ${AWS_REGION} \
                        --name ${CLUSTER_NAME}

                    echo "=== Verify Identity ==="
                    aws sts get-caller-identity

                    echo "=== Verify Cluster Access ==="
                    kubectl get nodes

                    echo "=== Create Namespace ==="
                    kubectl apply -f namespace.yaml

                    echo "=== Apply Backend Deployment ==="
                    kubectl apply -f backend-deployment.yaml

                    echo "=== Apply Frontend Deployment ==="
                    kubectl apply -f frontend-deployment.yaml

                    echo "=== Apply Ingress ==="
                    kubectl apply -f Ingress-controller.yaml

                    kubectl delete pvc mongodb-pvc -n gotcha

                    kubectl apply -f mongodb.yaml

                    echo "=== Update Backend Image ==="
                    kubectl set image deployment/gotcha-backend \
                    backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                    -n gotcha

                    echo "=== Update Frontend Image ==="
                    kubectl set image deployment/gotcha-frontend \
                    frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    -n gotcha

                    echo "=== Wait For Backend Rollout ==="
                    kubectl rollout status deployment/gotcha-backend \
                    -n gotcha \
                    --timeout=300s

                    echo "=== Wait For Frontend Rollout ==="
                    kubectl rollout status deployment/gotcha-frontend \
                    -n gotcha \
                    --timeout=300s

                    echo "=== Validate Deployment ==="
                    kubectl get all -n gotcha
                    kubectl get ingress -n gotcha
                    '''
                }
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
