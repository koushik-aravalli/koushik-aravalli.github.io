---
layout: post
title: git commands helper
use_mermaid: true
date: "2021-02-01"
description: ""
categories: [git]
comments: true
---
<!-- Post Content -->

<br/>

## git Scenarios 

### master and release, only certain files/folder

Customer has multiple leading branches, yes not good practice but still they survive. 

`master` branch has all kinds of files, but `release` requires only selected folder. Development is all done from master derived branches. Therefore reviews and merges are focused under master. 

`git cherry-pick` in action, perfect and invaluable to help isolate specific commits. 

steps to do:

 1. Create new branch from `master` and develop all changes. Follow good practices to do commits.
 2. Create Pull Request and merge changes to `master`. Locally, get latest `master` now including the merged changes. 
 3. Using `git log` get the latest log. Find the merge done in second step. Below is a sample log message from the merge. Notice the commit which will be used next.
 
    ```
    
    commit cf23e3333c222ea40adbb2d2da111b05a00f2f4e (HEAD -> master, DevelopmentRepo/master)
    Merge: 07dc8373c bca29fc4a
    Author: Koushik Aravalli <koushik.aravalli@.com>
    Date:   Thu May 27 13:11:13 2021 +0000

    Merged PR 62636: My pullrequest merge message

    My commit messages

    Related work items: #224345
    
    ```
    
 4. Create new branch from `release` and checkout locally the new branch. 
 5. Now lets cherry pick only this merge that has changes to the folder which is now in master branch. Assuming latest merge is still the same, run the following command. <br/>

    ```
    
    git cherry-pick -m 1 <merge-commit-id>
    
    ## git cherry-pick -m 1 cf23e3333c222ea40adbb2d2da111b05a00f2f4e
    
    ```

That is it. The new branch now contains only the merge changes, which can be handled the same way to do a Pullrequest into the `release` branch.
 
