pipeline {
    environment {
        VAULT_PASS = credentials('VAULT_PASSWORD') 
    }
    agent any
    stages {
        stage('Stage 1: Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Bambo0st/CabPool'
            }
        }
        stage('Stage 2: Testing Frontend and Backend') {
            steps {
                dir('api')
                {
                    sh "docker build -t bambo0st/backend-test -f Dockerfile.test ." //Builds and runs the tests
                }
                dir('client')
                {
                    sh "docker build -t bambo0st/frontend-test -f Dockerfile.test ."
                }
            }
        }
        stage('Stage 3: Build Frontend and Backend') {
            steps {
                dir('api')
                {
                    sh "docker build -t bambo0st/backend ." 
                }
                dir('client') 
                {
                    sh "docker build -t bambo0st/frontend ."
                }
            }
        }
        stage('Stage 4: Push Backend and Frontend to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker push bambo0st/backend'
                        sh 'docker push bambo0st/frontend'
                    }
                }
            }
        }
        stage('Stage 5: Clean') {
            steps {
                script {
                sh "docker rmi bambo0st/backend:latest || true"
                sh "docker rmi bambo0st/frontend:latest || true"
                // sh 'docker rmi $(docker images --filter "dangling=true" --filter "reference=bambo0st/backend:latest" -q)||true'
                }
            }
        }
        stage('Stage 6: Ansible Deployment') {
            steps {
                sh '''
                    echo "$VAULT_PASS" > /tmp/temp.txt

                    chmod 600 /tmp/temp.txt
                    
                    ansible-playbook -i inventory.ini --vault-password-file /tmp/temp.txt playbook.yml
                    
                    rm -f /tmp/temp.txt
                '''
            }
        }
    }
}