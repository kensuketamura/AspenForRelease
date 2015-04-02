#!/usr/bin/env bash
CURRENT_DIR=`pwd`
sudo apt-get update
sudo apt-get upgrade -y
sudo echo 'mysql-server mysql-server/root_password password konoha' | sudo debconf-set-selections
sudo echo 'mysql-server mysql-server/root_password_again password konoha' | sudo debconf-set-selections
sudo apt-get install -y vim git mysql-server
sudo echo ''
wget http://nodejs.org/dist/v0.10.32/node-v0.10.32-linux-x64.tar.gz
cd /usr/local && sudo tar --strip-components 1 -xzf $CURRENT_DIR/node-v0.10.32-linux-x64.tar.gz
cd $CURRENT_DIR
git clone https://github.com/kensuketamura/AspenForRelease.git
cd AspenForRelease
npm install
