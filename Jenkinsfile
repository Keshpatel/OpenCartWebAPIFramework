// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline
// Playwright TypeScript Framework
// Naveen Automation Labs
// ═══════════════════════════════════════════════════════════════

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
            description: 'Select environment to run tests'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'sanity', 'regression'],
            description: 'Select test suite'
        )
    }

    environment {
        SLACK_CHANNEL = '#all-k3dtech'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        // ═════════════════════════════════════════════════
        // STAGE 1: BUILD APP + UNIT TESTS
        // ═════════════════════════════════════════════════
        stage('Build & Unit Tests') {
            steps {
                echo "========================================="
                echo "  Building App + Running Unit Tests"
                echo "========================================="
                dir('dev-app') {
                    git url: 'https://github.com/jglick/simple-maven-project-with-tests.git',
                        branch: 'master'
                    bat 'mvn clean install -Dmaven.test.failure.ignore=true'
                }
            }
            post {
                always {
                    junit 'dev-app/target/surefire-reports/*.xml'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 2: INSTALL PLAYWRIGHT DEPENDENCIES
        // ═════════════════════════════════════════════════
        stage('Install Dependencies') {
            steps {
                echo "========================================="
                echo "  Installing Playwright Dependencies"
                echo "========================================="
                dir('qa-tests') {
                    git url: 'https://github.com/Keshpatel/OpenCartWebAPIFramework.git',
                        branch: 'master'
                    bat 'npm ci'
                    bat 'npx playwright install --with-deps chromium'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 3: DEPLOY DEV + SANITY
        // ═════════════════════════════════════════════════
        stage('Deploy to DEV') {
            steps {
                echo "========================================="
                echo "  Deploying to DEV..."
                echo "========================================="
                echo "DEV deployment complete ✅"
            }
        }

        stage('DEV - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @sanity on DEV"
                echo "========================================="
                dir('qa-tests') {
                    // Cleans old results safely on Windows
                    bat 'if exist allure-results rd /s /q allure-results'
                    bat 'if exist reports rd /s /q reports'
                    
                    withCredentials([
                        usernamePassword(credentialsId: 'dev-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'APP_PASSWORD'),
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
                            cmd /c npx playwright test --project=chromium --grep @sanity
                        '''
                    }
                }
            }
            post {
                 always {

                    // Create report directories
                        bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                        bat 'if not exist reports-dev\\allure mkdir reports-dev\\allure'

                    // Copy Playwright HTML Report
                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-dev\\html\\'

                      // Generate Allure Report
                    bat 'if exist allure-results allure generate allure-results --clean -o reports-dev\\allure'

                    // Optional - Debug (remove once everything works)
                    bat 'dir /S reports'
                    bat 'dir /S allure-results'
                    bat 'dir /S reports-dev'

                  // Publish Playwright HTML Report
                    publishHTML(target: [
                        reportName: 'DEV Sanity - PW HTML Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                     // Publish Allure Report
                    publishHTML(target: [
                        reportName: 'DEV Sanity - Allure Report',
                        reportDir: 'reports-dev/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 4: DEPLOY QA + REGRESSION
        // ═════════════════════════════════════════════════
        stage('Deploy to QA') {
            steps {
                echo "========================================="
                echo "  Deploying to QA..."
                echo "========================================="
                echo "QA deployment complete ✅"
            }
        }

        stage('QA - Regression Tests') {
            steps {
                echo "========================================="
                echo "  Running REGRESSION (all tests) on QA"
                echo "========================================="
                dir('qa-tests') {
                    bat 'if exist allure-results rd /s /q allure-results'
                    bat 'if exist reports rd /s /q reports'
                    withCredentials([
                        usernamePassword(credentialsId: 'qa-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'APP_PASSWORD'),
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
                            cmd /c npx playwright test --project=chromium
                        '''
                    }
                }
            }
            post {
                always {
                        bat 'if not exist reports-qa\\html mkdir reports-qa\\html'
                        bat 'if not exist reports-qa\\allure mkdir reports-qa\\allure'

                        bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-qa\\html\\'
                        bat 'if exist allure-results allure generate allure-results --clean -o reports-qa\\allure'

                        bat 'dir reports\\html-report'
                        bat 'dir reports-qa\\html'
                        bat 'dir reports-qa\\allure'

                        publishHTML(target: [
                            reportName: 'QA Regression - PW HTML Report',
                            reportDir: 'reports-qa/html',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])

                        publishHTML(target: [
                            reportName: 'QA Regression - Allure Report',
                            reportDir: 'reports-qa/allure',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                    }
                }

        // ═════════════════════════════════════════════════
        // STAGE 5: DEPLOY UAT + SANITY
        // ═════════════════════════════════════════════════
        stage('Deploy to UAT') {
            steps {
                echo "========================================="
                echo "  Deploying to UAT..."
                echo "========================================="
                echo "UAT deployment complete ✅"
            }
        }

        stage('UAT - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @sanity on UAT"
                echo "========================================="
                dir('qa-tests') {
                    bat 'if exist allure-results rd /s /q allure-results'
                    bat 'if exist reports rd /s /q reports'
                    withCredentials([
                        usernamePassword(credentialsId: 'uat-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'APP_PASSWORD'),
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
                            cmd /c npx playwright test --project=chromium --grep @sanity
                        '''
                    }
                }
            }
           post {
                always {
                    bat 'if not exist reports-uat\\html mkdir reports-uat\\html'
                    bat 'if not exist reports-uat\\allure mkdir reports-uat\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-uat\\html\\'
                    bat 'if exist allure-results allure generate allure-results --clean -o reports-uat\\allure'

                    bat 'dir reports\\html-report'
                    bat 'dir reports-uat\\html'
                    bat 'dir reports-uat\\allure'

                    publishHTML(target: [
                        reportName: 'UAT Sanity - PW HTML Report',
                        reportDir: 'reports-uat/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'UAT Sanity - Allure Report',
                        reportDir: 'reports-uat/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // UAT 6: DEPLOY PROD + SANITY (with approval)
        // ═════════════════════════════════════════════════
        stage('Approval for PROD') {
            steps {
                input message: 'Deploy to PROD?',
                    ok: 'Yes, Deploy!',
                    submitter: 'admin,keshini'
            }
        }

        stage('Deploy to PROD') {
            steps {
                echo "========================================="
                echo "  Deploying to PROD..."
                echo "========================================="
                echo "PROD deployment complete ✅"
            }
        }

        stage('PROD - Smoke Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @sanity on PROD"
                echo "========================================="
                dir('qa-tests') {
                    bat 'if exist allure-results rd /s /q allure-results'
                    bat 'if exist reports rd /s /q reports'
                    withCredentials([
                        usernamePassword(credentialsId: 'prod-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'APP_PASSWORD'),
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
                            cmd /c npx playwright test --project=chromium --grep @sanity
                        '''
                       
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-prod\\html mkdir reports-prod\\html'
                    bat 'if not exist reports-prod\\allure mkdir reports-prod\\allure'

                    bat 'if exist reports\\html-report xcopy /E /I /Y reports\\html-report\\* reports-prod\\html\\'
                    bat 'if exist allure-results allure generate allure-results --clean -o reports-prod\\allure'

                    bat 'dir reports\\html-report'
                    bat 'dir reports-prod\\html'
                    bat 'dir reports-prod\\allure'

                    publishHTML(target: [
                        reportName: 'PROD Smoke - PW HTML Report',
                        reportDir: 'reports-prod/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])

                    publishHTML(target: [
                        reportName: 'PROD Smoke - Allure Report',
                        reportDir: 'reports-prod/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
    }

    // ═════════════════════════════════════════════════════
    // POST — SLACK NOTIFICATIONS
    // ═════════════════════════════════════════════════════
    post {
        always {
            script {
                def buildStatus = currentBuild.currentResult
                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : '❌'
                def statusColor = buildStatus == 'SUCCESS' ? 'good' : 'danger'

                // Slack Notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: statusColor,
                    message: """
                        🎭 *Playwright CI/CD Pipeline Report*

                        *Overall: ${statusEmoji} ${buildStatus}*
                        *Environment:* `${params.ENVIRONMENT}`
                        *Branch:* `${env.BRANCH_NAME ?: 'master'}`
                        *Build:* #${env.BUILD_NUMBER}
                        *Duration:* ${currentBuild.durationString.replace(' and counting', '')}

                        📊 <${env.BUILD_URL}|View Reports in Jenkins>
                        🔍 <${env.BUILD_URL}console|View Console Logs>
                    """
                )              
            }
        }
        success {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ✅ SUCCESS'
            echo '═══════════════════════════════════════════'
        }
        failure {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ❌ FAILED'
            echo '═══════════════════════════════════════════'
        }
    }
}
