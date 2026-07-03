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
                            ENV=dev \
                            BASE_URL=$BASE_URL \
                            APP_USERNAME=$APP_USERNAME \
                            APP_PASSWORD=$APP_PASSWORD \
                            API_BASE_URL=$API_BASE_URL \
                            API_TOKEN=$API_TOKEN \
                            OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID \
                            OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
                            GRANT_TYPE=client_credentials \
                            npx playwright test --project=chromium --grep @sanity
                        '''
                    }
                }
            }
            post {
                always {                    
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    bat 'if not exist reports-dev\\allure mkdir reports-dev\\allure'  
                    bat 'if exist qa-tests\\reports\\html-report xcopy /E /Y qa-tests\\reports\\html-report\\* reports-dev\\html\\'           
                    bat 'if exist qa-tests\\allure-results allure generate qa-tests/allure-results --clean -o reports-dev/allure & exit 0'

                    publishHTML(target: [
                        reportName: 'DEV Sanity - PW HTML Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
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
                            ENV=qa \
                            BASE_URL=$BASE_URL \
                            APP_USERNAME=$APP_USERNAME \
                            APP_PASSWORD=$APP_PASSWORD \
                            API_BASE_URL=$API_BASE_URL \
                            API_TOKEN=$API_TOKEN \
                            OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID \
                            OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
                            GRANT_TYPE=client_credentials \
                            npx playwright test --project=chromium
                        '''
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-qa\\html mkdir reports-qa\\html'
                    bat 'if not exist reports-qa\\allure mkdir reports-qa\\allure'  
                    bat 'if exist qa-tests\\reports\\html-report xcopy /E /Y qa-tests\\reports\\html-report\\* reports-qa\\html\\'           
                    bat 'if exist qa-tests\\allure-results allure generate qa-tests/allure-results --clean -o reports-qa/allure & exit 0'

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
                            ENV=uat \
                            BASE_URL=$BASE_URL \
                            APP_USERNAME=$APP_USERNAME \
                            APP_PASSWORD=$APP_PASSWORD \
                            API_BASE_URL=$API_BASE_URL \
                            API_TOKEN=$API_TOKEN \
                            OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID \
                            OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
                            GRANT_TYPE=client_credentials \
                            npx playwright test --project=chromium --grep @sanity
                        '''
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-stage\\html mkdir reports-stage\\html'
                    bat 'if not exist reports-stage\\allure mkdir reports-stage\\allure'  
                    bat 'if exist qa-tests\\reports\\html-report xcopy /E /Y qa-tests\\reports\\html-report\\* reports-stage\\html\\'               
                    bat 'if exist qa-tests\\allure-results allure generate qa-tests/allure-results --clean -o reports-stage/allure & exit 0'


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
                            ENV=prod \
                            BASE_URL=$BASE_URL \
                            APP_USERNAME=$APP_USERNAME \
                            APP_PASSWORD=$APP_PASSWORD \
                            API_BASE_URL=$API_BASE_URL \
                            API_TOKEN=$API_TOKEN \
                            OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID \
                            OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
                            GRANT_TYPE=client_credentials \
                            npx playwright test --project=chromium --grep @sanity
                        '''
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-prod\\html mkdir reports-prod\\html'
                    bat 'if not exist reports-prod\\allure mkdir reports-prod\\allure'  
                    bat 'if exist qa-tests\\reports\\html-report xcopy /E /Y qa-tests\\reports\\html-report\\* reports-prod\\html\\'           
                    bat 'if exist qa-tests\\allure-results allure generate qa-tests/allure-results --clean -o reports-prod/allure & exit 0'

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
    // POST — EMAIL + SLACK NOTIFICATIONS
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

                // Email Notification
                emailext(
                    to: 'kdpatel8184@gmail.com','naveenanimation20@gmail.com',
                    subject: "🎭 CI/CD Pipeline — ${statusEmoji} ${buildStatus} — Build #${env.BUILD_NUMBER}",
                    mimeType: 'text/html',
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
                            <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px;">🎭 Playwright CI/CD Dashboard</h1>
                                    <p style="margin: 8px 0 0; opacity: 0.8;">Master Pipeline Report</p>
                                    <span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 12px; background: ${buildStatus == 'SUCCESS' ? '#28a745' : '#dc3545'}; color: white;">
                                        ${statusEmoji} ${buildStatus}
                                    </span>
                                </div>
                                <div style="padding: 24px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr><td style="padding: 10px; color: #666;">Environment</td><td style="padding: 10px; font-weight: bold;">${params.ENVIRONMENT}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Build</td><td style="padding: 10px; font-weight: bold;">#${env.BUILD_NUMBER}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Duration</td><td style="padding: 10px; font-weight: bold;">${currentBuild.durationString.replace(' and counting', '')}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Triggered by</td><td style="padding: 10px; font-weight: bold;">${currentBuild.getBuildCauses()[0]?.shortDescription ?: 'Manual'}</td></tr>
                                    </table>
                                </div>
                                <div style="background: #f8f9fa; padding: 20px 24px; border-top: 1px solid #eee;">
                                    <h3 style="margin: 0 0 12px;">📊 Reports (8 reports per build)</h3>
                                    <p style="color: #666; font-size: 13px; margin: 0 0 12px;">Click below to open Jenkins build page → Reports in sidebar</p>
                                    <a href="${env.BUILD_URL}" style="display: inline-block; padding: 10px 20px; background: #1a1a2e; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">📁 Open Jenkins Build</a>
                                    <a href="${env.BUILD_URL}console" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">🔍 Console Logs</a>
                                </div>
                                <div style="text-align: center; padding: 16px; color: #999; font-size: 12px; border-top: 1px solid #eee;">
                                    Naveen Automation Labs | Playwright Framework
                                </div>
                            </div>
                        </body>
                        </html>
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
