---
layout: post
title: Clone GitHub Repo from VSCode
date: "2020-06-14"
description: ""
tags: ["git"]
comments: true
---
<!-- Post Content -->
           
Yes ok, we all know how to clone with git command

```
git clone https://github.com/{your-account-name}/{your-repo-name}.git
```

One fine day you have your a new most powerful (developers dream) laptop, everything tool/package installed and all set for rework on your code. Rerun git clone on your own repo, BAAAAMMM.. git error 

```
fatal: repository https://github.com/{your-account-name}/{your-repo-name}.git not found
```

So you login with your favorite browser and check, and your repo is right there untouched!! 

Scratch your head and rethink, is it network error. Now open your awesome ide 'VSCode', click on the shining button 'Clone Repository' --> Clone from GitHub. 

![](../../assetsvscode-github-connection.jpg)

Browser opens up and asks to authorize VSCode. Now with a smiling face, we authorize. BAAAAMMMM... Error 

![](../../assetsvscode-github-connection-browser-error.jpg)

  ```
    Oh no! An error occurred!
    Please restart the sign in process from the editor.
    Error code 801
  ```

### Issue

GitHub internally maintains the list of all devices which were used for authentication and it doesn't have your latest device

### Solution

   - Login into GitHub from the browser
   
   - Select your profile and settings
    ![](../../assetsgithub-settings.jpg)

   - On the right bottom look for Developer Settings
    ![](../../assetsgithub-developer-settings.jpg)
   
   - Select and Open Personal Access tokens
   
   - Notice that it lists all the workstations (devices) that you have used to work or cloned your personal GitHub projects
    ![](../../assetsgithub-pat.jpg)
   
   - Now, on the top 'Generate new token', give it a name and ***make sure you copy the token hash key***

   - Jump back to your VSCode, retry your git clone command or at the right bottom look for 'Signing into GitHub', click it and you will be asked to enter token. Paste it and done. 

Simple isn't it. ... Happy coding..