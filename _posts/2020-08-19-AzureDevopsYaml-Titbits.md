---
layout: post
title: Azure Devops YAML titbits
---
<!-- Post Content -->

When working with YAML pipeline, there are many patterns that are reused across the projects.

Here are a few references 

**Scenario:**
- _Trigger Release or Test (load/performance/regression) pipelines after successful build_

```
# azure-pipelines-primary.yaml
trigger: none
steps:
  - powershell: Write-Host "Triggering pipeline invoked"
  - task: PublishBuildArtifacts@1
    displayName: 'Drop sample file'
    inputs:
      pathToPublish: $(System.DefaultWorkingDirectory)/Get-ResourceGroupTags.ps1
      artifactName: drop
```

```
# azure-pipelines-secondary.yaml
trigger: none
resources:
  pipelines:
  - pipeline: randomname
    source: primary
    trigger: 
      branches:
      - master
      - Koushik/*
steps:
  - powershell: Write-Host "Triggered secondary pipeline"
  # - task: DownloadPipelineArtifact@2
  #   displayName: 'artifact: Download artifacts'
  #   name: download_artifacts
  #   enabled: true
  #   inputs:
  #     source: 'specific'
  #     project: development
  #     pipeline: randomname
  #     preferTriggerPipeline: true
  #     runVersion: latest

```

**Scenario:**
- _Reuse variables across jobs within a pipeline_

```
# azure-pipelines-test-variable-crossjobs.yaml
trigger: none
jobs:
  - job: set_variable
    displayName: Set Variable
    steps:
      - task: PowerShell@2
        displayName: 'ps: Set OBJ'
        name: set_obj
        enabled: true
        inputs: 
          targetType: 'inline'
          script: | 
            $objInfo = @{
                "Name" = "var-set-in-set_variable-job";
              } | ConvertTo-Json -Compress
              Write-Host "##vso[task.setvariable variable=objInfo;isOutput=true]$($objInfo)"          
  - job: get_variable
    displayName: Get Variable
    dependsOn: 
      - set_variable
    variables:
      objInfo: $[ dependencies.set_variable.outputs['set_obj.objInfo'] ]
    steps:
      - powershell: |
          $objInfoDtl = '$(objInfo)' | ConvertFrom-Json
          Write-Host $objInfoDtl.Name
```

**Scenario:**
- _Dynamically change the buildname of executing pipeline_
 ***Note: Default name of the pipeline will start as date when 'name' is not provided ***
```
# azure-pipelines-updaterunningbuildname.yaml
name: $(BuildId)_$(SourceBranch)_$(Date:yyyyMMdd)$(Rev:.r)
trigger: none
jobs:
  - job: set_variable
    displayName: Set Variable
    steps:
      - task: PowerShell@2
        displayName: 'ps: Set BuildId'
        name: set_buildId
        enabled: true
        inputs: 
          targetType: 'inline'
          script: | 
            $buildId_name = "your-awesome-name with somespace and number 100"
            Write-Host "##vso[task.setvariable variable=newId;isOutput=true]$buildId_name"
  - job: update_buildName
    displayName: Set BuildId
    dependsOn: 
      - set_variable
    variables:
      newBuildId: $[ dependencies.set_variable.outputs['set_buildId.newId'] ]
    steps:
      - powershell: |
          Write-Host "##vso[build.updatebuildnumber]$(newBuildId)"
```
