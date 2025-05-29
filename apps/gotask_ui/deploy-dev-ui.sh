# Remove the previous build folder
rm -rf .next

keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"
appFolder="/home/ec2-user/gotask/test/app/"

#Create new build 
npm run build

echo "Build created"

echo "Removing the Previous build"

ssh -i "$keyfile" $user@$ipaddr "rm -r $appFolder/.next/"

# Copy the new build to the server 
scp -r -i "$keyfile" .next/* $user@$ipaddr:$appFolder/.next/

scp -r -i "$keyfile" package.json $user@$ipaddr:$appFolder/package.json
echo "New build Copied"

ssh -i "$keyfile" $user@$ipaddr "pm2 restart 'test-gotask-today'"

echo "Service Restarted"


# after running this script
#ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
#pm2 start npm --name "test-gotask-today " -- start