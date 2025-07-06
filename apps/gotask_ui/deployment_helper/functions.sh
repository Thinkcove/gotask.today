
# ---------- Step Resume Logic ----------
run_steps_from() {
    steps=(
        "update_code"
        # "setup_env_file"
        "run_linters"
        "run_next_build"
        "organize_standalone_folder"
        # "restore_env_file"
        "deploy"
    )

    start_found=false
    for step in "${steps[@]}"; do
        if [[ "$start_found" = false && "$step" == "$1" ]]; then
            start_found=true
        fi

        if [[ "$start_found" = true ]]; then
            current_step="$step"
            "$step"
        fi
    done
}

# ---------- Steps ----------
update_code() {
    log_info "Pulling latest changes..."
    git pull
    # log_info "Installing dependencies..."
    # npm install
}

# setup_env_file() {
#     log_info "Cleaning previous build..."
#     rm -rf .next
#     log_info "Backing up and applying .env"
#     cp .env .env.copy
#     cp "$envFile" .env
# }

run_linters() {
    log_info "Running lint and format..."
    npm run lint
    npm run format
}

run_next_build() {
    log_info "Building the project for $env environment..."

    case "$env" in
        dev)
            npm run build:dev
            ;;
        uat)
            npm run build:uat
            ;;
        prod)
            npm run build:prod
            ;;
        *)
            log_error "Unknown environment: $env"
            exit 1
            ;;
    esac
}


organize_standalone_folder() {
    log_info "Organizing build output..."
    cp -r public .next/standalone/
    cp -r .next/static .next/standalone/.next/
    rm -rf .next/static
}

# restore_env_file() {
#     log_info "Restoring original .env..."
#     cp .env.copy .env
#     rm -rf .env.copy
# }

deploy() {
    log_info "Deploying to $env environment..."
    ssh -i "$keyfile" "$user@$ipaddr" "rm -rf $appFolder && mkdir -p $appFolder"
    log_info "Transferring new build..."
    scp -r -i "$keyfile" .next/standalone/* "$user@$ipaddr:$appFolder/"
    scp -r -i "$keyfile" .next/standalone/.next/* "$user@$ipaddr:$appFolder/.next/"
    log_info "Restarting PM2 process: $pm2Name"
    ssh -i "$keyfile" "$user@$ipaddr" "pm2 restart $pm2Name"
}