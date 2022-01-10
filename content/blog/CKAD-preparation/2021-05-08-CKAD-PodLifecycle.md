---
layout: post
title: CKAD Preparation - Pod Life cycle
date: "2021-05-08"
description: ""
categories: [kubernetes ckad]
comments: true
---
<!-- Post Content -->

### Lifecycle of a Pod

Every Pod, has a status which is reached after meeting certain conditions. The Status of a pod gives information about the current stage of the Pod in its lifecycle.

There are 4 possible states that a Pod can attain

- Pending: When the API-Services on the control plane of the K8S receives a create command, after successful evaluation Scheduler searches for Node where the Pod can be placed. Until the scheduler finds a location, POD stays in this state. If scheduler cannot find where to place, the Pod remain in Pending state. To understand why it is not placed, use `kubectl describe <podname>` 

- ContainerCreating: After the Pod is scheduled to be placed on a Node and placed within, all the dependencies like the Images are pulled, configurations (configMap, Secrets, ServiceAccounts) are all gathered. Until commands and arguments are evaluated and exectued successfully, Pod state remain unchanged. 

- Running: Once all the containers in the Pod are successful and ready to be servered, until termination it remains in this state

- Deleting: This state of the Pod happens due to either kubectl delete or Node Eviction or Node Taints are applied. 

At any point of time, using `kubectl describe` behavior of a Pod can be understood. In the output of this command, notice that there is a section Conditions. 

### Probing for Readiness 

To get a Pod to a Running state, four conditions are met - `PodScheduled`, `Initialized`, `ContainersReady` and `Ready`. Each of these are bolean values. 

A Pod could contain container(s) which are light weight, like running bash script, which could start in milliseconds or heavy weight, like running a monolith webservice, which could take time to be ready to accept requests. In the later case, although the state of the Pod can show as `Running` and the condition `Ready` is true, K8S assumes that even the application is Ready to accept requests. This is becuase there is no link between the condition and actual state of the application within the container. 

Hence, there will be instances where application is still preparing while the requests rush in. To bridge this gap, with good understanding of the application, a probe test can be created within the application to respond if the applicaiton is infact ready to accept requests. 

There are 3 ways to have a probe test within the Pod - `HTTP` or `TCP` or `Execute Command`. All there can be combined with interval The result of this endup being giving handle on `Readiness` of the Pod. 

### Probing for Liveness

After deploying a Pod with a readiness probe, actual state of the application is known to K8S. Now when the application is ready to serve the requests but if it doesnt respond with a successful result, then application is still not considered to be live for the customers. Hence, there is also a need for a full check of a response as well to have the state as Ready. Similar to Readiness Probe, Pod state can be maintained accurate based on the applicaiton within's liveliness. One of the `HTTP` or `TCP` or `Execute Command` can be used to test the liveliness of a Pod.

