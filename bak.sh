#!/bin/bash

logs_dir=/var/lib/mongo
bak_dir=/var/lib/mongoDataSaveHere
bak_file1=BusinessMate.0
bak_file2=BusinessMate.1
bak_file3=BusinessMate.ns
nowtime=$(date +%Y-%m-%d)
mkdir $bak_dir/$nowtime
cp -r $logs_dir/$bak_file1 $bak_dir/$nowtime/$bak_file1
cp -r $logs_dir/$bak_file2 $bak_dir/$nowtime/$bak_file2
cp -r $logs_dir/$bak_file3 $bak_dir/$nowtime/$bak_file3