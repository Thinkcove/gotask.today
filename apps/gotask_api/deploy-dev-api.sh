rm -rf lib
 
#Create new build
npm run build
 
echo "Build created"

# copy config folder
cp -r config lib

#copy package.json
cp package.json lib
 
echo "Removing the Previous build"
#Remove the previous build in the server [tc-api-server-1]
ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17 "rm -r --exclude=node_modules /home/ec2-user/gotask/test/api"
echo "Previous build removed"
 
#Copy the new build to the server [tc-api-server-1]
scp -r -i "tc-test-key1.pem" lib/* ec2-user@13.127.153.17:/home/ec2-user/gotask/test/api
scp -r -i "tc-test-key1.pem" .env ec2-user@13.127.153.17:/home/ec2-user/gotask/test/api
ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17 "pm2 restart gotask-test-api"
echo "New build Copied"
 
#After Running this script
#1. ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
#2. cd gotask-prod-api
#3. npm install - if any new package install and first time
#4. pm2 restart gotask-prod-api
 
#0. For the first time only - pm2 start index.js --name "gotask-test-api"