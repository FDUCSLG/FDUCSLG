import git
import re
import os
import json


fileList=[]
for root,dirs,files in os.walk("content"):
	for file in files:
		fileList.append(os.path.join(root,file))

allList={}

for filename in fileList:
	repo=git.Repo('.')
	log=repo.git.shortlog('-s','-n',filename)
	loginfo=[]
	loginfo=re.sub('[\s,' ']+',',',log).split(',')[1:]
	autherList={}
	i=0
	while i<len(loginfo)-1:
		autherList[loginfo[i+1]]=loginfo[i]
		i+=2
	allList[filename[8:]]=autherList
	
with open("content/autherList.json","w") as f:
	json.dump(allList,f)
	