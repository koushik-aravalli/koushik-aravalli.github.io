---
layout: post
title: AzureDevOps Extension Canary deployed backed API
date: "2021-08-06"
description: ""
tags: ["azure-devops"]
comments: true
---
<!-- Post Content -->

<br/>

## What and Why ?? 

Today evening I had a chance to speak at Azure Thursday Netherlands event. It is fantastic stage where I have been learning from the community and experienced, on their efforts in keeping up with Azure. I was sharing my experience on building Azure DevOps Pipeline Extensions at Cloud Center of Excellences. Here is the [YouTube link](https://www.youtube.com/watch?v=kLHRA_ec1Zo)

Ok that is not the What part noir the Why!! During the questions session, a very interesting one was how to manage canary deployments. Simple question, but something to think about to manage new features behavior. 

## How to work with canary

At CCoE's, I have seen traditional implementation approach when Extension developments are done. Here is the view. 
 
 ![](../../assets2020-08-06-AzDevops-Extension.jpg?v=4&s=50)

Now when we rethink, [canary deployments](https://martinfowler.com/bliki/CanaryRelease.html#:~:text=Canary%20release%20is%20a%20technique,making%20it%20available%20to%20everybody.) are typical in a normal application developments when introducing new features in an application. We now we are working with software development that is managing the infrastructure on public cloud platform. In this post we are referring to the Azure as the landing zone and pipeline extensions are developed to target an Azure resource. A task within an extension, can call an ARM template or execute a PowerShell command from Azure PowerShell module or also invoke Azure Rest API to manage a resource. 

So, here is one solution. 

 ![](../../assets2020-08-06-AzDevops-Canary-Approach.jpg?s=200)

- Create extension with task(s)
- Create micro services (API Apps) performing
    - Authentication / Authorization
    - Validation and Elevate permissions
    - Invoke Azure REST API to manage Azure Resource

While creating these microservice, the API App can be deployed in blue-green deployment model and can be configured according to divert the traffic. 

That is it.. why not it is possible to have new features tested from Azure DevOps extension. I will illustrate this will an example in later posts.