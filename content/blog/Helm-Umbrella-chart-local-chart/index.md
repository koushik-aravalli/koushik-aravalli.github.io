---
layout: post
title: Helm - Umbrella chart using local reference
date: "2021-12-04"
description: ""
tags: ["k8s","helm"]
comments: true
---
<!-- Post Content -->

## Overview

In many situations it is not always that the Helm chart that is created is built on public or shared packages. Especially, in local developments, consider an API that is built on other building blocks. Building such complex charts which are interdependent are referred as __["Umbrella charts"](https://helm.sh/docs/howto/charts_tips_and_tricks/#complex-charts-with-many-dependencies)__

## Include subchart

According to __[Helm documentation](https://helm.sh/docs/topics/charts/#chart-dependencies)__, subcharts can be refereed from web server or local file system. Well direct reference to the file system does not work with `file://` and returns `Error: INSTALLATION FAILED: found in Chart.yaml, but missing in charts/ directory: <dependent-chart-name>`

Create two charts `chartOne` and `chartTwo`, and consider `chartTwo` depends on multiple instances on `chartOne`. 

 ```
 helm create -n chartOne chartOne
 helm create -n chartTwo chartTwo
 ```

When referring subcharts from external webserver (registry), `charts` folder is created by `helm create` and followed by `helm dependency update` all dependent sub charts of the parent chart are downloaded in `tgz`. Since Helm version 3, `helm serve` is deprecated, therefore that is not an option. 

To get this running, manually copy contents of `chartOne` into `chartTwo\charts\`. 

In `chartTwo\Chart.yaml`, include dependencies tag with chartOne. 

```
dependencies:
  - name: chartOne ## should match `name` in charts/subfolder `Chart.yaml`
    charts: chartOne ## should match name of the subfolder in `charts`
    # repository: "file://../chartOne" ## does not work!
    version: "0.1.0" ## should match `version` in charts/subfolder `Chart.yaml`
```

Consider another case when multiple instances of the same building block are required by the parent chart. The challenge could be with the `Release.Name` overlap, which causes chart installation failure. 

To handle this, common practice is to update the default name of the subchart to 'Chart.Name' in the `_helpers.tpl`. 

```
{{- define "chartOne.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
```

In the parent chart `chartTwo\Chart.yaml`, under the dependencies tag include `alias` for each subchart. 

```
dependencies:
  - name: chartOne
    alias: first-instance ## release-name on the dependent chart
    charts: chartOne
    version: "0.1.0"

  - name: chartOne
    alias: second-instance ## release-name on the dependent chart
    charts: chartOne
    version: "0.1.0"
```

Refer code __[here](https://github.com/koushik-aravalli/development/tree/master/helm)__

Tags: `Helm`
Categories: `Kubernetes`