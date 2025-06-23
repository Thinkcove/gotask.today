# Remove the previous build folder
rm -rf .next

keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"
appFolder="/home/ec2-user/gotask/test/app/"

#Create Build
bash uat-build.sh
 
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

echo "New build Copied"
 
ssh -i "$keyfile" $user@$ipaddr "pm2 restart 'test-gotask-web'"
# echo "Service Restarted"


# after running this script
#ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
#pm2 start npm --name "test-gotask-today " -- start

# for standalone first time only - pm2 start npm --name "test-gotask-web" -- run standalone:test
 