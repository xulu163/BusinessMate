source_dir=/deploy/BusinessMate/files
bak_dir=/deploy/BusinessMateFiles
nowtime=$(date +%Y-%m-%d)
RetainDay=30
file=$bak_dir/$nowtime
mkdir $file
cp -r $source_dir $file
OldFile="$bak_dir/"$(date --date="$RetainDay days ago" +"%Y-%m-%d")
if [ -f $OldFile ]
then
 rm -rf $OldFile 
fi