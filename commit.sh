git filter-branch --env-filter \
    'if [ $GIT_COMMIT = 022a2839fff9c0420cc0e662e0f04c44228c9609 ]
     then
         export GIT_AUTHOR_DATE="Mon May 14 22:10:23 2018 -0800"
     fi'


git filter-branch --env-filter \
    'if [ $GIT_COMMIT = 7ede6f363556fa220f3ee572479ab4611d0cd0a1 ]
     then
         export GIT_AUTHOR_DATE="Tue May 15 09:08:33 2018 -0800"
     fi'







git filter-branch --env-filter \
    'if [ $GIT_COMMIT = 0cc708811ed5a7f37eeac5f8f71d0dccd27e80be ]
     then
         export GIT_AUTHOR_DATE="Wed May 16 08:18:13 2018 -0800"
     fi'


git filter-branch --env-filter \
    'if [ $GIT_COMMIT = f24811ac6bc2a0bbeb8f9f602df1940860b147f5 ]
     then
         export GIT_AUTHOR_DATE="Thu May 17 10:11:33 2018 -0800"
     fi'


git filter-branch --env-filter \
    'if [ $GIT_COMMIT = b589c952852622b59d7b2af8e5f1074a6bea8699 ]
     then
         export GIT_AUTHOR_DATE="Fri May 18 19:09:11 2018 -0800"
     fi'