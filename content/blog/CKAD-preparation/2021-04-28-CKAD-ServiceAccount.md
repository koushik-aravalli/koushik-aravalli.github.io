---
layout: post
title: CKAD Preparation - ServiceAccount
date: "2021-04-28"
description: ""
tags: ["kubernetes", "ckad"]
comments: true

---
<!-- Post Content -->

ServiceAccount are non personal (user) accounts which are/can be used by third party applications to authorize against the applications hosted within K8S. For example, consider the image required to create a container in the POD is from a private registry. In this case, start by creating a secret with registry credentials, create a ServiceAccount by including the `imagePullSecrets` with the created secret. Now, in the POD definition include ServiceAccount as mounted volume. 

Each ServiceAccount when created contains 3 keyvalue pairs: `token`, `ca.cert`, `namespace`. Out of which token is a secret that is mounted.

To create Service Account:

```
# serviceaccount definition

apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus-npa
secrets:
  - name: <name-of-secret>
imagePullSecrets:
  - name: <name-of-registry-secret>
```

```
kubectl create serviceaccount <name-of-service-account>
```

Within K8S `default` ServiceAccount is provide which is added to each deployed POD. To list the ServiceAccount mounted within a running POD, login into the POD using `exec` command and browse to `/var/run/secrets/kubernetes.io/serviceaccount`.

On the master node, the `Token Controller` maintains the lifecycle of the tokens within the ServiceAccounts. It checks and invalidates the token if either POD or ServiceAccount are deleted from K8S. On the worker node, the Kubelet is responsible for refreshing the token. The application within the POD is responsible for pulling the latest token.

Secret can be attached to an existing ServiceAccount from the Secret definition file:

```
apiVersion: v1
kind: Secret
metadata:
  name: new-registry-secret
  annotations:
    kubernetes.io/service-account.name: thridparty-app-npa
type: kubernetes.io/service-account-token
```

To add a ServiceAccount on a POD definition file:

```
# nginx-pod-definition.yaml

apiVersion: v1

kind: Pod

metadata:
    name: sample-app
    labels:
        app: api
        type: frontend

spec:
    serviceAccountName: <name-of-new-serviceaccount>
    containers:
        - name: nginx-container
          image: nginx
```

