#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required environment variables
check_env() {
    local missing=()
    [[ -z "$AWS_PROFILE" ]] && missing+=("AWS_PROFILE")
    [[ -z "$AWS_ACCOUNT_ID" ]] && missing+=("AWS_ACCOUNT_ID")
    [[ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]] && missing+=("CLOUDFRONT_DISTRIBUTION_ID")

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${RED}Error: Missing environment variables: ${missing[*]}${NC}"
        echo "Please set up .envrc and run 'direnv allow'"
        exit 1
    fi
}

# Deploy backend (Lambda)
deploy_backend() {
    echo -e "${YELLOW}=== Deploying Backend ===${NC}"

    local ECR_REPO="$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com"
    local IMAGE="$ECR_REPO/pedalboard-demo/lambda:latest"

    echo -e "${GREEN}1. Logging in to ECR...${NC}"
    aws ecr get-login-password --region ap-northeast-1 --profile "$AWS_PROFILE" | \
        docker login --username AWS --password-stdin "$ECR_REPO"

    echo -e "${GREEN}2. Building Docker image...${NC}"
    docker build --platform linux/arm64 --target lambda -t "$IMAGE" ./backend

    echo -e "${GREEN}3. Pushing to ECR...${NC}"
    docker push "$IMAGE"

    echo -e "${GREEN}4. Updating Lambda function...${NC}"
    aws lambda update-function-code \
        --function-name pedalboard-demo-prod-processor \
        --image-uri "$IMAGE" \
        --region ap-northeast-1 \
        --profile "$AWS_PROFILE"

    echo -e "${GREEN}5. Waiting for Lambda update...${NC}"
    aws lambda wait function-updated \
        --function-name pedalboard-demo-prod-processor \
        --region ap-northeast-1 \
        --profile "$AWS_PROFILE"

    echo -e "${GREEN}Backend deployment complete!${NC}"
}

# Deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}=== Deploying Frontend ===${NC}"

    echo -e "${GREEN}1. Building frontend...${NC}"
    cd client
    bun run build
    cd ..

    echo -e "${GREEN}2. Uploading to S3...${NC}"
    aws s3 sync client/dist s3://pedalboard-demo-prod-frontend --delete \
        --profile "$AWS_PROFILE" --region ap-northeast-1

    echo -e "${GREEN}3. Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*" \
        --profile "$AWS_PROFILE"

    echo -e "${GREEN}Frontend deployment complete!${NC}"
}

# Main
main() {
    local target="${1:-all}"

    # Move to project root
    cd "$(dirname "$0")/.."

    check_env

    case "$target" in
        backend)
            deploy_backend
            ;;
        frontend)
            deploy_frontend
            ;;
        all)
            deploy_backend
            deploy_frontend
            ;;
        *)
            echo "Usage: $0 [backend|frontend|all]"
            exit 1
            ;;
    esac

    echo -e "${GREEN}=== Deployment finished! ===${NC}"
}

main "$@"
