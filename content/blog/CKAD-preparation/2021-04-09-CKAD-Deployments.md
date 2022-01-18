---
layout: post
title: CKAD Preparation - Deployment
date: "2021-04-09"
description: ""
tags: ["kubernetes", "ckad"]
comments: true

---
<!-- Post Content -->

The Deployment Controller within K8S is responsible for reinstating the state of the application based on the definition. A Deployment definition can be created to deploy ReplicaSet there by PODs or Delete the same. Deployment process typically have requirements to create new version of application, upgrade to next version of application, scale it as per load, rollback in case of failure. All these actions to be performed with minimal downtime. Deployment in K8S fulfil these requirements by default. Read through the [use cases](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#use-case) 

### Definition File 

The only difference between Deployment and ReplicaSet definitions files is the `kind`

```
# deployment-definition.yaml 

apiVersion: apps/v1
kind: Deployment
metadata:
    name: myapp-deployment
    labels:
        app: myapp
spec:
    replicas: 5
    selector: 
        matchLabels:
            type: frontend
    template:
        # Pod definition
        metadata:
            name: sample-app
            labels:
                app: myapp
                type: frontend
        spec:
            containers:
                - name: nginx-container
                  image: nginx:1.14.2
```

### Commands

K8S Deployments is capable of performing **rolling update** only when the POD's image is updated. So for example, `kubectl set image deployment.v1.apps/<deployment-name>`. Make sure the labels are untouched. Status check can be performed with `kubectl rollout status deployment/<deployment-name>`

So, now if the version needs a **rollback** - `kubectl rollout undo deployment.v1.apps/<deployment-name>`. If to a specific version `kubectl rollout undo deployment.v1.apps/<deployment-name>  --to-revision=<image-version-number>`

Now, to scale number of PODs for a deployment, `kubectl scale deployment.v1.apps/<deployment-name> --replicas=10`

> **Note**: Do not manage ReplicateSet created from a Deployment. 

