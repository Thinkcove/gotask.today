source ./deploy-function.sh

keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"
appname="dev-gotask-api"
appFolder="/home/$user/gotask/dev/api/"
buildFolder="lib"
configFolder="config"

cleanup_old_build "$buildFolder"
 
create_build "$appFolder"
copy_files "$buildFolder" "$configFolder"
remove_previous_build "$keyfile" "$user" "$ipaddr" "$appFolder"
copy_new_build_to_server "$keyfile" "$user" "$ipaddr" "$buildFolder" "$appFolder"
restart_server "$keyfile" "$user" "$ipaddr" "$appname"


#After Running this script
#1. ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
#2. cd /gotask/dev/api/
#3. npm install - if any new package install and first time
#4. pm2 restart "dev-gotask-api"
 
#0. For the first time only - pm2 start index.js --name "dev-gotask-api"