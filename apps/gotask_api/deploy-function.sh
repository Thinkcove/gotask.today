# Function to clean up old build folder
cleanup_old_build() {
  local buildFolder=$1
  rm -rf $buildFolder
  echo "Old build folder removed"
}

# Function to create a new build
create_build() {
  local appFolder=$1
  echo "Creating a new build for $appFolder..."
  npm run build
}

# Function to copy necessary files and manage .env file for deployment
copy_files() {
  local buildFolder=$1
  local configFolder=$2
  local env=${3:-dev}  # Default to 'dev'
  
  echo "Using environment: $env"

  # If environment is not 'dev', backup local .env
  if [[ "$env" != "dev" ]]; then
    echo "Backing up local .env file..."
    cp .env .env.bak
  fi

  # Copy config and package.json
  echo "Copying config and package.json to $buildFolder..."
  cp -r $configFolder $buildFolder
  cp package.json $buildFolder

  # Copy the corresponding .env.{env} file to .env
  if [[ "$env" != "dev" ]]; then
  # this is file name contructed
    local envFile=".env.$env"
    if [[ -f $envFile ]]; then
      echo "Setting up environment file: $envFile"
      cp $envFile .env
    else
      echo "Warning: $envFile does not exist!"
    fi
  fi
}

# Function to remove the previous build from the server
remove_previous_build() {
  local keyfile=$1
  local user=$2
  local ipaddr=$3
  local appFolder=$4
  echo "Removing the previous build from $user@$ipaddr..."
  ssh -i $keyfile $user@$ipaddr "rm -rf --exclude=node_modules $appFolder"
  echo "Previous build removed"
}

# Function to copy the new build to the server
copy_new_build_to_server() {
  local keyfile=$1
  local user=$2
  local ipaddr=$3
  local buildFolder=$4
  local appFolder=$5
  echo "Copying the new build to the server..."
  scp -r -i $keyfile $buildFolder/* $user@$ipaddr:$appFolder
  scp -i $keyfile .env $user@$ipaddr:$appFolder
  echo "New build copied"
}

# Function to restart the server
restart_server() {
  local keyfile=$1
  local user=$2
  local ipaddr=$3
  local appname=$4
  echo "Restarting the server for $appname..."
  ssh -i $keyfile $user@$ipaddr "pm2 restart $appname"
  echo "Server restarted"
}

# Function to restore local .env after deployment - for UAT 
restore_local_env() {
  if [ -f .env.bak ]; then
    echo "Restoring local .env file from backup..."
    mv .env.bak .env
    rm -f .env.bak  # Clean up the backup file
  else
    echo "No backup found. Skipping restore."
  fi
}
