# ---------- Setup Environment ----------
setup_environment() {
    
    env="$1"

    # Check if key file exists
    [ ! -f "tc-test-key1.pem" ] && log_error "tc-test-key1.pem does not exist in the current directory." && exit 1

    # Check if correct env file exists
    [ ! -f ".env.$env" ] && log_error ".env.$env does not exist in the current directory." && exit 1

    user="ec2-user"
    ipaddr="13.127.153.17"
    keyfile="tc-test-key1.pem"

    case "$1" in
        prod)
            envFile=".env.prod"
            pm2Name="prod-gotask-api"
            appFolder="/home/ec2-user/gotask/prod/api/"
            ;;
        dev)
            envFile=".env.dev"
            pm2Name="dev-gotask-api"
            appFolder="/home/ec2-user/gotask/dev/api/"
            ;;
        uat)
            envFile=".env.uat"
            pm2Name="test-gotask-api"
            appFolder="/home/ec2-user/gotask/test/api/"
            ;;
        *)
            log_error "Invalid environment: $1"
            echo "Usage: $0 [prod|uat|dev]"
            exit 1
            ;;
    esac
}