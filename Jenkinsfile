pipeline {
    environment {
        mongoImage = 'mongo:latest' 
        mongoContainerName = 'mongodb' 
        MONGO_PORT = '23017'
        docker_image = ''
    }
    
    agent any

    stages {
        
        // stage('Stage 1: Pull MongoDB') {
        //     steps {
        //         script {
        //             docker.withRegistry('', 'DockerHubCred') {
        //                 docker.image("${mongoImage}").pull()
        //             }
        //         }
        //     }
        // }
        
        stage('Stage 2: Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Bambo0st/CabPool'
            }
        }

        // stage('Stage 3: Testing Frontend and Backend') {
        //     steps {
        //         dir('backend')
        //         {
        //             sh "docker build -t Bambo0st/backend-test -f Dockerfile.test ."
        //             // sh "docker run menkchad/backend-test"
        //         }
        //         dir('frontend')
        //         {
        //             sh "docker build -t Bambo0st/frontend-test -f Dockerfile.test ."
        //             // sh "docker run menkchad/frontend-test"
        //         }
        //     }
        // }
        
        stage('Stage 4: Build Frontend and Backend') {
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

        stage('Stage 5: Push Backend and Frontend to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker push bambo0st/backend'
                        sh 'docker push bambo0st/frontend'
                    }
                }
            }
        }

        stage('Stage 6: Clean') {
            steps {
                script {
                    sh 'docker container prune -f'
                    sh 'docker image prune -f'
                    sh 'if [ -n "$(docker ps -aq)" ]; then docker rm -f $(docker ps -aq); fi'
                    // sh 'if [ -n "$(docker images -aq)" ]; then docker rmi -f $(docker images -aq); fi'
                }
            }
        }

        stage('Stage 6: Ansible Deployment') {
            steps {
                ansiblePlaybook(
                    becomeUser: adithya,
                    colorized: true,
                    credentialsId: 'localhost',
                    disableHostKeyChecking: true,
                    installation: 'Ansible',
                    inventory: 'inventory',
                    playbook: 'playbook.yml',
                    sudoUser: null
                )
            }
        }
    }
}