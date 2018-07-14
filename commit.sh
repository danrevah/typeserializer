git filter-branch --env-filter \
    'if [ $GIT_COMMIT = f36d67bcdbefadd62251b388eb778d6d53c9613f ]
     then
         export GIT_AUTHOR_DATE="Sun May 13 21:38:53 2018 -0800"
     fi'