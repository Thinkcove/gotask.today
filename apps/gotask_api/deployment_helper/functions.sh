
# ---------- Step Resume Logic ----------
run_steps_from() {
    steps=(
        "update_code"
        "setup_env_file"
        "run_linters"
        "run_build"
        "restore_env_file"
        "transfer_files"
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
}

setup_env_file() {
    log_info "Cleaning previous build..."
    rm -rf lib
    log_info "Backing up and applying .env"
    cp .env .env.copy
    cp "$envFile" .env
}

run_linters() {
    log_info "Running lint and format..."
    npm run lint
    npm run format
}

run_build() {
    log_info "Building the project..."
    npm run build
}

transfer_files() {
    log_info "Transferring files to $env environment..."
    ssh -i "$keyfile" "$user@$ipaddr" "rm -rf $appFolder && mkdir -p $appFolder"
    
    # Transfer files
    log_info "Transferring new build..."
    scp -i "$keyfile" package.json "$user@$ipaddr:$appFolder/"
    scp -r -i "$keyfile" config "$user@$ipaddr:$appFolder/"
    scp -r -i "$keyfile" lib/* "$user@$ipaddr:$appFolder/"
    scp -i "$keyfile" .env "$user@$ipaddr:$appFolder/"
}

deploy() {    
    log_info "Installing dependencies..."
    ssh -i "$keyfile" "$user@$ipaddr" "
        echo '[$(date)] Starting npm install...'
        cd $appFolder && npm install --production --loglevel=info
        echo '[$(date)] npm install finished!'
    "
    log_info "Restarting PM2 process: $pm2Name"
    ssh -i "$keyfile" "$user@$ipaddr" "pm2 restart $pm2Name"
}

restore_env_file() {
    log_info "Restoring .env..."
    cp .env.copy .env
    rm -rf .env.copy
}