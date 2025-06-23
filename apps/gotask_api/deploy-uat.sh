source ./deploy-function.sh

keyfile="tc-test-key1.pem"
user="ec2-user"
ipaddr="13.127.153.17"
appname="test-gotask-api"
appFolder="/home/$user/gotask/test/api"
buildFolder="lib"
configFolder="config"
env="uat" 

cleanup_old_build "$buildFolder"
create_build "$appFolder"
copy_files "$buildFolder" "$configFolder" "$env"
remove_previous_build "$keyfile" "$user" "$ipaddr" "$appFolder"
copy_new_build_to_server "$keyfile" "$user" "$ipaddr" "$buildFolder" "$appFolder"
restart_server "$keyfile" "$user" "$ipaddr" "$appname"
restore_local_env

#After Running this script
#1. ssh -i "tc-test-key1.pem" ec2-user@13.127.153.17
#2. cd /gotask/test/api/
#3. npm install - if any new package install and first time
#4. pm2 restart "test-gotask-api"
 
#0. For the first time only - pm2 start index.js --name "test-gotask-api"