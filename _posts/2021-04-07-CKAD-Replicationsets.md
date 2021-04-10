---
layout: post
title: CKAD Preparation - ReplicationSets
---
<!-- Post Content -->

Controllers (yes multiple) keep track of all the activities and monitors each of them to respond accordingly in case of change of behavior. All the controllers run inside `kube-control-manager` which act as reflexes in the cluster. 

### Replication Controller

To prevent users from loosing connection to a running pod that crashes. So either by creating a replicate of existing POD or by redeploying the crashed POD. This nature therefore helps in addressing High Availability, Load Balancing and Scaling.

Replication Controller is one of the Master node components that spans across all nodes in the cluster.

### Definition file

Start with the base definition keywords: 

|`apiVersion`| `kind`| `metadata`| `spec`|
|-|-|-|-|
|v1|**ReplicationController**|`name`<br/>`labels`| `template` &rarr; pod-definition <br/> `replicas` &rarr; integer|

**Note** The pods created using ReplicationController definition is from its name ***not from*** the metadata under spec &rarr; template &rarr; metadata


### Replica Set

Replica Set is a new recommended way of working as it originates from Replication Controller. 

Additional feature of a ReplicaSet is managing Pods those are not part the current replica set. Use the `selector` tag in the definition file under `spec` section to add other pods. 

|`apiVersion`| `kind`| `metadata`| `spec`|
|-|-|-|-|
|apps/v1|**ReplicaSet**|`name`<br/>`labels`| `template` &rarr; pod-definition <br/> `replicas` &rarr; integer <br/> `selector`|

## Learning with example

Consider, within a K8S cluster there are already PODs, labeled `login-api`, running even before there exists a ReplicaSet. Now when a replicaSet, named `authentication-rs`, is created with template corresponding to same container image, as the running POD but labeled `authentication-api` on the selector.

### POD from ReplicaSet Perspective

The definition file for the ReplicaSet contains template of POD and selector fields. Based on this information, a replicaSet instance keep track of pods. In above scenario by default, the `authentication-rs` keeps track of _only_ the PODs labeled  `authentication-api` to make sure desired number of these PODs are running but not the PODs labeled `login-api`. By using the command `kubectl describe replicaset authentication-rs`, the Events sections will list all the PODs which are being tracked by the replicaSet. 

### ReplicaSet from POD perspective

The pods deployed from the replicaSet can be identified by the names, as the start with the replicaSet name. In the above scenario, the pods names turnup something similar to `authentication-rs-ab1c2d`. Another option to find the details are by using the command `kubectl describe pod authentication-rs-ab1c2d`. The Events sections will list all the POD details, one of which will be `Controlled By:  ReplicaSet/authentication-rs`

### Definition Files

Following below are sample Definition files to create a ReplicationController and a ReplicaSet

#### ReplicationController Definition File 

```
# replicationController-definition.yaml 

apiVersion: v1
kind: ReplicationController
metadata:
    name: myapp-rc
    labels:
        app: myapp
        type: frontend
spec:
    template:
        # Pod definition
        metadata:
            name: sample-app
            labels:
                app: api
                type: frontend
        spec:
            containers:
                - name: nginx-container
                  image: nginx

    replicas: 5
```

#### ReplicaSet Definition File 

```
# replicaSet-definition.yaml 

apiVersion: apps/v1
kind: ReplicationController
metadata:
    name: myapp-rc
    labels:
        app: myapp
        type: frontend
spec:
    template:
        # Pod definition
        metadata:
            name: sample-app
            labels:
                app: api
                type: frontend
        spec:
            containers:
                - name: nginx-container
                  image: nginx

    replicas: 5
    selector: 
        matchlabels:
            type: frontend
```

### Commands

- To fix existing erroneous ReplicaSet

```
kubectl edit replicaset <name-of-replicaset>
```

- Scale up or down pods in the replica sets:

```
## Option 1
kubectl scale --replicas <number> rs/<name-of-replicaset>

## Option 2
kubectl scale replicaset --replicas=<number> <name-of-replicaset>
```

### Debugging issue

- A erroneous ReplicaSet can still create PODs but in error state. 
To fix the issue there are two options:
 - _Option 1_: Delete the ReplicaSet &rarr; Fix the YAML &rarr; Apply updated file to create new ReplicaSet
 - _Option 2_: Using `kubectl edit` fix the YAML &rarr; Delete all the PODs which were created erroneously 
