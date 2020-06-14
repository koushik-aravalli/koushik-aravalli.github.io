---
layout: post
title: Clone Github Repo from VSCode
---
<!-- Post Content -->
           
<div class="container">
<p>
  Yes ok, we all know how to clone with git command
    ```
    git clone https://github.com/{your-account-name}/{your-repo-name}.git
    ```
</p>
<p>
  One fine day you have your a new most powerful (developers dream) laptop, everything tool/package installed and all set for rework on your code. Rerun git clone on your own repo, BAAAAMMM.. git error 
  ```
    fatal: repository https://github.com/{your-account-name}/{your-repo-name}.git not found
  ```
  So you login with your favourite browser and check, and your repo is right there untouched!! 

  Scratch your head and rethink, is it network error. Now open your awesome tool 'VSCode', click on the shining button 'Clone Repository' --> Clone from GitHub. 
    <a href="/images/vscode-github-connection"></a>
  Browser opens up and asks to authroize VSCode. Now with a smiling face, we authorize. BAAAAMMMM... Error 
    <a href="/images/vscode-github-connection-browser-error">

  ```
    Oh no! An error occurred!
    Please restart the sign in process from the editor.
    Error code 801
  ```
  </a>
</p>

<p>
 Issue: GitHub internally maintains the list of all devices which were used for authentication and it doesnt have your latest device
</p>

<p>
 Solution: 
    - Login into GitHub
    - Select your profile and settings
            <a href="/images/github-settings">
    - On the right bottopm look for Developer Settings
            <a href="/images/github-developer-settings">
    - Select and Open Personal Access tokens
        - Notice that it lists all the workstations (devices) that you have used to work or cloned your personal github projects
        <a href="/images/github-pat">
        - Now, on the top 'Generate new token', give it a name and <b><u>make sure you copy the token hash key</u></b>
    - Jump back to your VSCode, retry your git clone command or at the right bottom look for 'Signing into GitHub', click it and you willbe asked to enter token. Paste it and done. 

Simple isn't it. ... Happy coding..
</p>

</div>