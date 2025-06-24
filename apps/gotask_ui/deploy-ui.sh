# To run this script, you need to have the correct environment variables set.
# You can set them in the .env.dev file for dev or in the .env.uat file for uat or .env.prod for prod.
# ensure you have the tc-test-key1.pem file in the same directory as this script.

# Then run the script with the appropriate argument:
# For uat: bash deploy-ui.sh uat
# For prod: bash deploy-ui.sh prod
# For dev: bash deploy-ui.sh dev

keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"

if [ "$1" = "prod" ]; then
  env=".env.prod"
  pm2Name="prod-gotask-web"
  appFolder="/home/ec2-user/gotask/prod/app/"

elif [ "$1" = "uat" ]; then
  env=".env.uat"
  pm2Name="test-gotask-web"
  appFolder="/home/ec2-user/gotask/test/app/"

elif [ "$1" = "dev" ]; then
  env=".env.dev"
  pm2Name="dev-gotask-today"
  appFolder="/home/ec2-user/gotask/dev/app/"

else
  echo "Environment not found"
  echo "Valid environment: prod, uat, dev"
  echo "Usage: bash deploy-ui.sh <environment>"
  exit 1
fi

# Function to handle interruption
handle_interrupt() {
    echo ""
    echo "Are you sure you want to cancel? (y/n): "
    read -n 1 -r response
    echo ""
    
    if [[ $response =~ ^[Yy]$ ]]; then
        
        # Check if .env.copy exists and restore it
        if [ -f ".env.copy" ]; then
            cp .env.copy .env
            rm -rf .env.copy
        fi
        
        echo "Script cancelled."
        exit 130
    else
        echo "Continuing..."
        # Reset the trap to handle future interrupts
        trap handle_interrupt SIGINT
    fi
}

# Set up the trap for SIGINT (Ctrl+C)
trap handle_interrupt SIGINT

#Remove Old Build
rm -rf .next
cp -r .env .env.copy
cp -r $env .env
 
# Create new build
npm run lint
npm run format
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
rm -rf .next/static
cp .env.copy .env
rm -rf .env.copy

echo "Removing the Previous build"
# Remove the previous build in the server
ssh -i "$keyfile" $user@$ipaddr "rm -r $appFolder"
 
echo "Previous build Removed"

ssh -i "$keyfile" $user@$ipaddr "mkdir $appFolder"

# Copy the standalone folder to the app folder in the server
echo "Transfering the new build"
scp -r -i "$keyfile" .next/standalone/* $user@$ipaddr:$appFolder/
# ssh -i "$keyfile" $user@$ipaddr "mkdir $appFolder/.next"

# Copy the .next files
scp -r -i "$keyfile" .next/standalone/.next/* $user@$ipaddr:$appFolder/.next/
echo "New build transfered successfully"

# pm2 restart the service
echo "pm2 restarting $pm2Name"
ssh -i "$keyfile" $user@$ipaddr "pm2 restart $pm2Name"

# Login to the server (if necessary)
# ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
