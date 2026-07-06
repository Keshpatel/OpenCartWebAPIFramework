pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
        maven 'Maven-3.9'
        jdk 'JDK21'
        allure 'Allure'
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['QA', 'DEV', 'UAT', 'PROD'],
            description: 'Select Environment'
        )

        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select Browser'
        )

        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'sanity', 'regression'],
            description: 'Select Test Suite'
        )
    }

    environment {
        SLACK_CHANNEL = '#all-k3dtech'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {

        stage('Install Dependencies') {
            steps {

                echo "Installing Playwright Dependencies..."

                git(
                    url: 'https://github.com/Keshpatel/OpenCartWebAPIFramework.git',
                    branch: 'master'
                )

                bat 'npm ci'

                bat 'npx playwright install chromium'

            }
        }
        stage('Deploy to DEV') {
            steps {
                echo "Deploying to DEV..."
                echo "DEV deployment completed."
            }
        }

        stage('DEV - Sanity Tests') {
            steps {
                bat 'if exist allure-results rd /s /q allure-results'
                bat 'if exist reports rd /s /q reports'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dev-credentials',
                        usernameVariable: 'APP_USERNAME',
                        passwordVariable: 'APP_PASSWORD'
                    ),
                    string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                    string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                    string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                    string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                ]) {

                    bat '''
                        set ENV=dev
                        set BASE_URL=%BASE_URL%
                        set APP_USERNAME=%APP_USERNAME%
                        set APP_PASSWORD=%APP_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @sanity
                    '''
                }
            }

            post {
                always {

                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    bat 'if not exist reports-dev\\allure mkdir reports-dev\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-dev\\html\\'

                    bat 'if exist allure-results allure generate allure-results --clean -o reports-dev\\allure'

                    publishHTML(target: [
                        reportName: 'DEV - Playwright Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'DEV - Allure Report',
                        reportDir: 'reports-dev/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        stage('Deploy to QA') {
            steps {
                echo "Deploying to QA..."
                echo "QA deployment completed."
            }
        }

        stage('QA - Regression Tests') {
            steps {

                bat 'if exist allure-results rd /s /q allure-results'
                bat 'if exist reports rd /s /q reports'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'qa-credentials',
                        usernameVariable: 'APP_USERNAME',
                        passwordVariable: 'APP_PASSWORD'
                    ),
                    string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                    string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                    string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'qa-base-url', variable: 'BASE_URL'),
                    string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                ]) {

                    bat '''
                        set ENV=qa
                        set BASE_URL=%BASE_URL%
                        set APP_USERNAME=%APP_USERNAME%
                        set APP_PASSWORD=%APP_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium
                    '''
                }
            }

            post {
                always {

                    bat 'if not exist reports-qa\\html mkdir reports-qa\\html'
                    bat 'if not exist reports-qa\\allure mkdir reports-qa\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-qa\\html\\'

                    bat 'if exist allure-results allure generate allure-results --clean -o reports-qa\\allure'

                    publishHTML(target: [
                        reportName: 'QA - Playwright Report',
                        reportDir: 'reports-qa/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'QA - Allure Report',
                        reportDir: 'reports-qa/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
        stage('Deploy to UAT') {
            steps {
                echo "Deploying to UAT..."
                echo "UAT deployment completed."
            }
        }

        stage('UAT - Sanity Tests') {
            steps {

                bat 'if exist allure-results rd /s /q allure-results'
                bat 'if exist reports rd /s /q reports'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'uat-credentials',
                        usernameVariable: 'APP_USERNAME',
                        passwordVariable: 'APP_PASSWORD'
                    ),
                    string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                    string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                    string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'uat-base-url', variable: 'BASE_URL'),
                    string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                ]) {

                    bat '''
                        set ENV=uat
                        set BASE_URL=%BASE_URL%
                        set APP_USERNAME=%APP_USERNAME%
                        set APP_PASSWORD=%APP_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @sanity
                    '''
                }
            }

            post {
                always {

                    bat 'if not exist reports-uat\\html mkdir reports-uat\\html'
                    bat 'if not exist reports-uat\\allure mkdir reports-uat\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-uat\\html\\'

                    bat 'if exist allure-results allure generate allure-results --clean -o reports-uat\\allure'

                    publishHTML(target: [
                        reportName: 'UAT - Playwright Report',
                        reportDir: 'reports-uat/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'UAT - Allure Report',
                        reportDir: 'reports-uat/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        stage('Approval for PROD') {
            steps {
                input(
                    message: 'Deploy to PROD?',
                    ok: 'Deploy',
                    submitter: 'admin,keshini'
                )
            }
        }

        stage('Deploy to PROD') {
            steps {
                echo "Deploying to PROD..."
                echo "PROD deployment completed."
            }
        }

        stage('PROD - Smoke Tests') {
            steps {

                bat 'if exist allure-results rd /s /q allure-results'
                bat 'if exist reports rd /s /q reports'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'prod-credentials',
                        usernameVariable: 'APP_USERNAME',
                        passwordVariable: 'APP_PASSWORD'
                    ),
                    string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                    string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                    string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'prod-base-url', variable: 'BASE_URL'),
                    string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                ]) {

                    bat '''
                        set ENV=prod
                        set BASE_URL=%BASE_URL%
                        set APP_USERNAME=%APP_USERNAME%
                        set APP_PASSWORD=%APP_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @sanity
                    '''
                }
            }

            post {
                always {

                    bat 'if not exist reports-prod\\html mkdir reports-prod\\html'
                    bat 'if not exist reports-prod\\allure mkdir reports-prod\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-prod\\html\\'

                    bat 'if exist allure-results allure generate allure-results --clean -o reports-prod\\allure'

                    publishHTML(target: [
                        reportName: 'PROD - Playwright Report',
                        reportDir: 'reports-prod/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'PROD - Allure Report',
                        reportDir: 'reports-prod/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
    } 

    post {

        always {
             echo 'Pipeline finished.'
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
             echo 'Pipeline failed.'
        }

        cleanup {

            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true
            )
        }
    }
}
