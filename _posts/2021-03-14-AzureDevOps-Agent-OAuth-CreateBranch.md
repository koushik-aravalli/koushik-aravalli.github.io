---
layout: post
title: Using AzureDevOps Agent's OAuth to create branch
---
<!-- Post Content -->

## What is the reason behind

Working more AzureDevOps, artifacts are generated during the build process and release follows based on the artifacts, basic CI/CD. 

At times, extensions require an OAuth to be enabled on the agent to perform actions within Azure DevOps e.g., creating or updating work items on a task board, creating a new repository or creating new branch, creating or completing a pull request. So two questions, under who's context is this OAuth generated, and how to provide fine grained access to create branch and pr. 

 ![](/assets/2021-03-14-OAuth-token-security.jpg)


### To answer the first question, _under who's context is this OAuth generated>_: 

First lets understand permissions within Azure DevOp. An Azure DevOps Organization has built-in default accounts and groups that are created and managed by AzureDevOps Service. These are at both Collection (Organization) level and Project level. _(Side note, Collection comes from the Team Foundation Service)_

_For additional information [Refer](https://docs.microsoft.com/en-us/azure/devops/organizations/security/permissions?view=azure-devops&tabs=preview-page#service-accounts)_ to Azure DevOps documentation. 

The closest lead `Agent Pool Service` who belong to the collections `Security Service Group`.  Notice that within this security group there are Project level `<projectname> Build Service` - one for each project and one `Project Collection Build Service (<organizationname>)`. One of these two will be a used by the agents. Now that is only a partial answer because which service account is it Collection or Project? And next question is fine grained controls that AzureDevOps provides for each service account 

 ![](/assets/2021-03-14-agentpoolservice.jpg)

The default behavior is always from the Collection level, so the `Project Collection Build Service (<organizationname>)` will be used by the Agent for OAuth generation. 

In some organizations, where a central IT team owns the Azure DevOps Organization and Projects are created per DevOps teams,  collection level access is restricted. It can be verified by checking out the Azure DevOps Organization Settings.

 ![](/assets/2021-03-14-Organization-Settings.jpg)

This setting can also be managed from the Project level, if not set at Organization level. 

 ![](/assets/2021-03-14-Project-Settings.jpg)

By limiting the job authorization scope, all the pipelines within the Projects consider `<projectname> Build Service` instead of Collection level Build Service.

### To answer the second question, _how to provide fine grained access to create branch and pull request_: 

Fine grained controls for the service account are set at Project level by selecting Project Settings &rarr; Repos &rarr; Repositories. Select `Security` on `All Repositories` or each repository.

 ![](/assets/2021-03-14-Secuirty-BuildService-Allow.jpg)

That is it .. now create a script which can create a new branch and does a Pull Request. 