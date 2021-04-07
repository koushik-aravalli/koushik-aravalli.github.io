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


ReplicationController Definition File 

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