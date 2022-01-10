---
layout: post
title: Building AzureDevOps PipelineExtension
date: "2021-07-13"
description: ""
categories: [azure-devops extension]
comments: true
---
<!-- Post Content -->

<br/>

## Why are we talking about building custom extension?

To meet one or more **_[objectives of a CCoE](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/organize/cloud-center-of-excellence#key-responsibilities)_**, out-of-box Azure Resources (Service) are deployed with preapproved configuration sets, security controls and organization standards. Therefore, a need arises to box the required solution into one package which is reusable, idempotent and consistent across all working teams. 

When working with Azure, infrastructure is provisioned using Azure Resource Manager _(basically an API)_. ARM Templates, Azure CLI or Terraform are tools which interface with this API to provision any required Azure service. 

DevOps and DevSecOps are already well known terms and are used in conjunction with automation in an application architecture. _Azure DevOps_ is one of the proven DevOps tool which is also customizable. Automating the infrastructure deployment (Infra-as-code) on Azure with Azure DevOps is a potential solution towards achieving the objectives. 

## What are the steps to build an extension

An Extension adds new capabilities to Azure DevOps environment. These capabilities are termed as **_Contributions_**. A Contribution can be of type ```hub```, ```action```, ```build-task``` which is a unit of work or a building block that makes a pipeline. 

To build an extension with one or more tasks:
Using simple ARM deployment, lets build an Azure DevOps Extension in 5 steps.

**_Step 1_**: PowerShell script with Azure Modules invoking ARM template

**_Step 2_**: Download To wrap the scripts as an extension, download the dependent modules (more like SDKs) from [Azure DevOps GitHub](https://github.com/microsoft/azure-pipelines-tasks/tree/master/Tasks/Common), Save it to folder ```ps_modules```. (Yes the name should be exactly that!!)
    * VstsTaskSDK
    * VstsAzureRestHelper
    * VstsAzureHelper
    * TlsHelper (Common library handling security)

**_Step 3_**: Create entry point by adding Invoke script - ```main.ps1```. User input is captured using ```Get-VstsInput```, a parameter object is created to fulfil the ARM template requirements. 

*In case RestAPI is used instead of ARM templates, POST operation payload can also be gathered as input.*

**_Step 4_**: Make this as task. Task acts an interface to collect required information (Parameters).. consider it as a UI. Add ```task.json```. 

```task.json main.ps1``` bridges across user and the script that were created in first step. 

**_Step 5_**: Wrap every thing into an Extension - ```vss-extension.json```
    * Take ownership by assigning it to an Organization
    * Embed tasks
    * Beautify it with icon

## Test your extension - Locally

**_Step 1_**: Import required Azure Modules ```Import-Module Az```

**_Step 2_**: Import VstsSdk Module ```Import-Module .\ps_modules\VstsTaskSdk\VstsTaskSdk.psd1 -Global```

**_Step 3_**: Get Azure context ```Login-AzAccoount``` 

**_Step 4_**: Execute entry point script ```main.ps1```. During execution, each input will be prompted in the attached terminal.

*Note - Since Azure Context is already provided at Step 3, Ignore the values for ```ConnectedServiceNameSelector```, ```ConnectedServiceName```, ```Service Endpoint Url``` can be left empty. Safely ignore the pop out log errors* 
```
##vso[task.logissue type=error]Required: '' service endpoint URL
##vso[task.logissue type=error]Cannot bind argument to parameter 'Endpoint' because it is null.
```

**_Step 5_**: Login to Azure and validate deployed resource if it meets the required controls

## Package and Publish - Locally

TFS cli (tfx) is offered as an npm package. To perform actions locally, NodeJS installation is a requirement.

**_Package_**: Navigate to the extension directory. 

```tfx extension create --manifests vss-extension.json```

**_Publish_**: 

```tfx extension create --manifests vss-extension.json```

## Package and Publish - Pipeline

As the number of custom extensions grow, having the entire deployment cycle with Querying latest extension, Packaging the extension and Publishing the extension will be redundant. And more importantly, automating the extension publishing remove the overhead of manual interactions. 

Here is the Job template to publish extension in an Azure DevOps Organization

```
{% raw %}
## Deploy Extension Job Template

parameters:
  extension_name: ''
  extension_path: ''
  service_connection: ''

jobs:
- job: "Deploy_Extension"
  pool:
    vm_image: windows-latest
  variables:
    Extension.Name: ${{ parameters.extension_name }}
  steps:
    - task: ms-devlabs.vsts-developer-tools-build-tasks.extension-version-build-task.QueryAzureDevOpsExtensionVersion@2
      displayName: 'Query Extension Version'
      inputs:
        connectedServiceName: ${{parameters.service_connection}}
        publisherId: Koushik-Aravalli ## Change accordingly, publisherId doesnt seem to support variablization
        extensionId: $(Extension.Name)
        versionAction: Patch
        outputVariable: QueryExtension.Version
        extensionVersionOverride: QueryExtension.VersionOverride

    - task: ms-devlabs.vsts-developer-tools-build-tasks.package-extension-build-task.PackageAzureDevOpsExtension@2
      displayName: 'Package Extension'
      inputs:
        rootFolder: ${{ parameters.extension_path }}
        outputPath: output/vstspackage.vsix
        extensionVersion: '$(QueryExtension.Version)'
        updateTasksVersion: true
        updateTasksVersionType: patch
        extensionVisibility: private
        outputVariable: CreateExtension.OutputPath

    - task: PublishBuildArtifacts@1
      displayName: 'Publish Artifact: output'
      inputs:
        PathtoPublish: "$(CreateExtension.OutputPath)"
        ArtifactName: output

    - task: ms-devlabs.vsts-developer-tools-build-tasks.publish-extension-build-task.PublishAzureDevOpsExtension@2
      displayName: 'Publish Extension'
      inputs:
        connectedServiceName: ${{ parameters.service_connection }}
        fileType: vsix
        vsixFile: $(CreateExtension.OutputPath)
        publisherId: Koushik-Aravalli ## Change accordingly, publisherId doesnt seem to support variablization
        extensionId: $(Extension.Name)
        extensionName: $(Extension.Name)
        updateTasksVersion: false
{% endraw %}
```

Invoke the template

```
## Extension deployment pipeline

variables:
    extension_name: 'sample-extension'
    extension_location: 'SampleExtension' # Name of the extension root folder
jobs:
  - template: deploy-extension.yaml
    parameters:
      extension_name: $(extension_name)
      extension_path: $(extension_location)
      service_connection: "azdevops-extension-spn"
```

Here is the **_[extension code](https://github.com/koushik-aravalli/azuredevops-pipeline-extension)_**