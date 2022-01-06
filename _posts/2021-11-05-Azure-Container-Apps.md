---
layout: post
title: Deploying Application in Azure Container Apps
---
<!-- Post Content -->

The new kid in Azure's town is [Azure Container Apps](https://azure.microsoft.com/en-us/services/container-apps/). During last week Microsoft Ignite this was launched in preview. If you are wondering what AWS equivalent, then it is Fargate, which was adopted widely by many AWS customers for medium scale workloads. My understanding for simplification of these services, Conatiner Apps or Fargate, is going **Serverless Kubernetes**. 

In my current migration project I had to go with Azure Kubernetes Service for the only reason there is no equivalent for Fargate. 

Let me dive in, what am I going to do:

1. **Get Docker running on local machine**

If [Docker Desktop](https://docs.docker.com/desktop/) is already installed, just start it, check if the docker machine is running.

1. **Create ACR, If not available**

```
RESOURCE_GROUP_NAME='exploration'
ACR_NAME='sampleregistry'

az acr create -n $ACR_NAME -g $RESOURCE_GROUP_NAME --sku Basic --admin-enabled --allow-trusted-services --identity
```

__Questions:__

- How to install Container Apps extension in Azure CLI?

`az extension add --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.0-py2.py3-none-any.whl -y`


> Check az version: `az --version`

- What all AZ CLI commands are available for Azure Container Apps?

As of today, only one which is powerful enough to deploy a container from an existing Azure Container Registry 