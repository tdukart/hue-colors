#!/bin/bash
# h/t https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db#.6cbwrf5b1
npm run-script build-docs
(
 cd docs
 git init
 git config user.name "Travis-CI"
 git config user.email "travis@aloftinteractive.com"
 git add .
 git commit -m "Deploy to GitHub Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)
