keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"
appFolder="/home/ec2-user/gotask/dev/app/"
 
#Create Build
bash dev-build.sh
 
echo "Removing the Previous build"
# Remove the previous build in the server
ssh -i "$keyfile" $user@$ipaddr "rm -r $appFolder"
 
echo "Previous build Removed"
 
echo "Coping new build"
ssh -i "$keyfile" $user@$ipaddr "mkdir $appFolder"
# Copy the standalone folder to the app folder in the server
scp -r -i "$keyfile" .next/standalone/* $user@$ipaddr:$appFolder/
ssh -i "$keyfile" $user@$ipaddr "mkdir $appFolder/.next"
# Copy the .next files
scp -r -i "$keyfile" .next/standalone/.next/* $user@$ipaddr:$appFolder/.next/
# Copy the env files
# scp -r -i "$keyfile" .env $user@$ipaddr:$appFolder/.env
echo "New build Copied"
 
ssh -i "$keyfile" $user@$ipaddr "pm2 restart dev-gotask-today"
# echo "Service Restarted"


#ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
 
#pm2 start npm --name dev-gotask-today -- start
#For the first time only - pm2 start server.js --name dev-gotask-today
 
#Copy the public asset alone
#scp -r -i tc-test-key1.pem public ec2-user@13.127.153.17:/home/ec2-user/gotask/public
