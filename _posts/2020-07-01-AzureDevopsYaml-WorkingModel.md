---
layout: post
title: Azure DevOps YAML Working models and challenges
---
<!-- Post Content -->

<br/>

## Background
As we, within a team, start working together and digest that the operations are part of our daily activities, the subconscious part of our mind treat these as development actions. This gradually mutates into code (in any language) and automation, assuming that it will simplify our lives! 

When a ProductOwner starts his question with "Is it possible to ...", thinking with my developers hat, without any hesitation the reply would be "Every thing is possible with code". _(But wait how many lines of code are we writing everyday. Again I started writing code to count the number of lines of code, number of git diffs and make a statics out of it. That is another post later.)_

_[Azure DeveOps](https://dev.azure.com)_ is almost a default across many organizations. Continuous improvements on the features by the product team and their transparency on their _[road map](https://dev.azure.com/mseng/AzureDevOpsRoadmap/_workitems/recentlyupdated)_ helps in making a rational decision on the implementations. Most of the leading Application release automation products, pipeline as code is a norm. As I already said, our inclination towards writing code is now much more biased, isn't it? 

<br/>

### _Concern_: __Pipeline as Code != Pipeline as Scripture__

Azure DevOps supports developers in organizing pipelines as either YAML or friendly drag-drop view. Teams prefer former approach which has advantages over the later one mostly because of the embedded DevOps culture.

|   YAML   |    Classic   |
|---|---|
|![](/assets/2020-07-02-AzDevops-Yaml-Build.jpg)|![](/assets/2020-07-02-AzDevops-Classic-Build.jpg)|

### _How to Address_: __Standards when writing pipeline__

Inline with general coding standards, team should also enforce all possible actions when writing a pipelines. Some basic rules that can be enforced are 
 - Comments at the top of the pipeline describing briefly about activities performed within each Jobs. Avoid granular details at task level, unless required
 ![](/assets/2020-07-02-AzDevops-Yaml-Comments.jpg)
 - List all the [Queue time variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#allow-at-queue-time) because they are not evident in the YAML but added within the Azure DevOps pipeline
    ![](/assets/2020-07-02-AzDevops-Yaml-Queuetime-Var.jpg)
 - Maintain and identify the differences
    - __PascalCase__ for Parameters
    - __camelCase__ for variables
    - __UPPERCASE_UNDERSCORE_SEPARATED_NAME__ for Stage Names
    - __lowercase_underscore_separated_name__ for Job Names
    - __lowercase_underscore_separated_name__ for task Names
 - Azure DevOps accepts runtime variables in either ``` $(var) ``` or ``` $[variables.var] ``` format. Stay consistent in runtime variable declaration to avoid confusion. 
 - Target towards light weight Jobs. Single Stage with multiple Jobs is acceptable as well.
 - Finally, work towards not embedding process complexity into pipeline yaml.
 
 <br/>

### _Concern_: __Pipeline name__

By default new pipeline created in Azure DevOps is named ```YourRepo - CI``` or ```YourRepo - CI(#)```. This is not always the case if there are bunch of solutions hosted within the same repo. 

### _How to Address_: __Naming convention__
- When a repo has **_one solution_** with one pipeline which does the full deployment, just name the file as ```azure-pipeline.yaml``` which will be automatically picked up by Azure DevOps for continuous integration.

- While working with multiple YAML files, file names should represent target build/deployment process

- Having Azure DevOps Pipeline name as the YAML file name is always easy to map the reference.

- Templates are reusable entities, naming stage template and job template as ```{common-process}.stage-template.yaml``` or ```{common-process}.job-template.yaml```

- Rename pipeline as soon as they are added manually. 
![](2020-07-02-AzDevops-Yaml-PipelineName)

<br/>

### _Concern_ : __Random execution name__
Every execution of the pipeline should tell a story of what could have been done. Execution Name make a story along with comment messages. 

### _How to Address_: __Naming convention__
- Select a standard name similar to below, with multiple Repos in same Project also have a repo name
    ```name: $(TeamProject)_$(BuildDefinitionName)_$(SourceBranch)_$(Date:yyyyMMdd)$(Rev:.r)```

- Build names can be changed during the execution of the pipeline using ```$(build.updatebuildnumber)```

So, these are some of my learning when working with Azure DevOps YAML. These could be simple common sense points but they help in betterment of work.
