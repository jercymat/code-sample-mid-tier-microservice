buildDeployService {
    email = '%owner_email%'
    platform  = 'node'
    nodeVersion="16"
    initialDelaySeconds = '120'
    healthUri = '%health_uri%'
    ingressType = 'root-context'
    args = []
    envs = [
        '{"env": {"name": "NODE_ENV", "value": "%env%"}}',
        '{"secretEnv":{"name": "VERTEX_PASSWORD", "secretKey": "vertex_password", "secretName": "%secret_name%"}}',
        '{"secretEnv":{"name": "SOAP_AUTH_SECRET", "secretKey": "soap_auth_secret", "secretName": "%secret_name%"}}',
    ]
    contextPath = '/'
    context = 'external'
    deployLocations = '%deploy_locations%'
    namespace = '%namespace%'
    snyk = ["org": "%snyk-org%", "environment": "backend", "devBranch": "dev", "block": "false"]
    cors = [
        'enabled': 'true',
        'allowOrigin': '*',
        'allowCredentials': 'true'
    ]
    buildCommands = [
        'CI=true npm install',
        'CI=true npm run build'
    ]
    requestCpu = '100m'
    maxCpu = '200m'
    enableFileUpload= "true"
	uploadFileSize= "10m"
    minReplicas = '2'
    maxReplicas = '3'
    readiness = 'false'
    liveness = 'false'
}