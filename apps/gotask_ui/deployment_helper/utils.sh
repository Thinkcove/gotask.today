log_info()  { echo -e "\033[0;32m[INFO]\033[0m $1"; }
log_warn()  { echo -e "\033[0;33m[WARN]\033[0m $1"; }
log_error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; }
log_success()  { echo -e "\033[0;32m[SUCCESS]\033[0m $1"; }


catch_error() {
    local lineno=$1
    local code=$2
    log_error "Failed at line $lineno with code $code"
    [ -f ".env.copy" ] && restore_env_file
    exit $code
}

handle_interrupt() {
    echo ""
    read -p "Are you sure you want to cancel deployment? (y/n): " -n 1 -r response
    echo ""
    if [[ $response =~ ^[Yy]$ ]]; then
        [ -f ".env.copy" ] && restore_env_file
        log_warn "Script cancelled."
        exit 130
    else
        log_info "Resuming from $current_step"
        trap handle_interrupt SIGINT
        run_steps_from "$current_step"
        exit 0
    fi
}