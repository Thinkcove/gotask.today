#!/bin/bash

# To run this script, you need to have the correct environment variables set.
# You can set them in the .env.dev file for dev or in the .env.uat file for uat or .env.prod for prod.
# ensure you have the tc-test-key1.pem file in the same directory as this script.
# Then run the script with the appropriate argument:
# For uat: bash deploy-ui.sh uat
# For prod: bash deploy-ui.sh prod  
# For dev: bash deploy-ui.sh dev

set -Eeuo pipefail

source ./deployment_helper/utils.sh
source ./deployment_helper/setup.sh
source ./deployment_helper/functions.sh

trap 'catch_error ${LINENO} $?' ERR
trap handle_interrupt SIGINT

# ---------- Main Entrypoint ----------
main() {
    if [ $# -lt 1 ]; then
        echo "Usage: $0 [prod|uat|dev]"
        exit 1
    fi

    env="$1"
    setup_environment "$env"

    current_step="update_code"; update_code
    # current_step="setup_env_file"; setup_env_file
    current_step="run_linters"; run_linters
    current_step="run_next_build"; run_next_build
    current_step="organize_standalone_folder"; organize_standalone_folder
    # current_step="restore_env_file"; restore_env_file
    current_step="deploy"; deploy "$env"

    log_success "Deployment completed successfully."
}

main "$@"

# Login to the server
# ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17