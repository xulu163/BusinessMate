#!/bin/sh
killall node
NODE_ENV=production  nohup node app &
