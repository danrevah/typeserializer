

git filter-branch -f --env-filter \
    'if [ $GIT_COMMIT = de464ea0c3984beae0eb2eba31f3057f0f7185fe ]
     then
         export GIT_AUTHOR_DATE="Tue May 15 09:08:33 2018 -0800"
     fi'