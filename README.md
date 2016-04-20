# node-express-redis-demo
Simple node express application that stores login sessions in Redis.  This solution uses a proxy to front the Redis cluster. This readme describes how to deploy the solution to AWS.

## Prerequisites
+ Node.js version 4.3.0
+ EB CLI: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
+ AWS CLI: https://aws.amazon.com/cli/
+ MySQL Workbench:  https://www.mysql.com/products/workbench/ (if desired)

## Clone Repo, Create and Push a new Branch
```bash
git clone git@github.com:redapt/node-express-redis-demo.git
https://github.com/redapt/node-express-redis-demo.git (in case your set up differently)
git checkout -b [name_of_your_new_branch]
git push origin [name_of_your_new_branch]
```
## Setup Elasticache Cluster
http://docs.aws.amazon.com/opsworks/latest/userguide/other-services-redis.html

## Setup Standalone Twemproxy Server
The [Twemproxy Server] (https://github.com/twitter/twemproxy) is used to front Redis. 
Either through AWS console or API setup a standalone Ubuntu Instance to host Twemproxy. [This](http://www.icchasethi.com/setting-up-horizontal-scaling-with-redis-using-twemproxy-elasticache-and-ec2/) is a good guide.

### Start Twemproxy with Debug 
Adjust listen and servers values in [twemproxy-config file](https://github.com/redapt/node-express-redis-demo/blob/master/twemproxy/twemproxy-config.yml) to the vaulues of your standalone ubuntu server and redis replication host respectively and start the nutcracker with the following command. Copy this file to the home directory of the Twemproxy instance.
```bash
cd ~
nutcracker --daemonize --output=test.log -c twemproxy-config.yml --verbose=11
```
##  Deploy Node App to AWS via Elasticbeanstalk

From the root of the repo ...

```bash
cd redis-session-node
eb init
eb create redis-session-node -d -db -db.engine mysql -db.user jon —single
```
The above commands will create the EC2 node box and a MySQL RDS instance.

## Create DDL

The app stores simple usernames/password in a MYSQL db. You will need to seed using the following file on the created RDS instance.

https://github.com/redapt/node-express-redis-demo/blob/master/redis-session-node/redis-demo-db-schema.sql.  

## Change Applicaiton Config File

The default applicaiton [config file](https://github.com/redapt/node-express-redis-demo/blob/master/redis-session-node/config/default.json)  will need to be changed to point to the DB host and Twemproxy host in your environment.

```bash
git commit
git push origin [name_of_your_new_branch]
eb deploy
```

# Use App
The app should be running at the address indicated in the Elastic Beanstalk Config.  
For Example: http://redis-session-node.pmchq4hrnn.us-west-2.elasticbeanstalk.com/


