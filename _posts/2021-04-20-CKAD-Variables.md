---
layout: post
title: CKAD Preparation - Variables
---
<!-- Post Content -->

Injecting Data into a Container is a frequent requirement. That is apps running as a container may need settings for connecting to databases, endpoints of other external apps, passwords or certificates to manage sensitive data and many more. To handle this K8S provides 3 ways to manage these variables. 

* [Environment](/Environment)
* [ConfigMaps](/ConfigMaps)
* [Secret](/Secrets)

#### Environment

Variables declared in the POD definition file are saved in keyvalue pair.

```
## POD definition file with Environment variables

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        env:
        - name: DATABASE_NAME
          value: Company_Project_mysqldb
        - name: DATABASE_ADMIN
          value: mysqlAdmin
```

#### ConfigMaps

For an applications that require multiple pod definition files, managing Environment Variables in each files becomes difficult to manage. Therefore, with a config file the environment variables are all managed at single location and it can be referenced across multiple definition files.

ConfigMaps can be injected into a POD definition file either as ***Environment Variable*** or ***Single Environment Variable*** or ***Volume***

```
## filename: web-configmap.yaml
## define configmap: web-config

apiVersion: v1
kind: ConfigMap
metadata:
    name: web-config
    lables:
        key1: value1
        key2: value2
data:
    DATABASE_NAME: Company_Project_mysqldb
    DATABASE_ADMIN: mysqlAdmin
```

Using the command `kubectl create -f web-configmap.yaml`

***Environment Variable***

```
## reference configmap in defintion

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        envFrom:
        - configMapRef: 
              name: web-config
``` 

***Single Environment Variable***

```
## reference configmap in defintion

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        env:
        - name: db_name # variable used within the pod
          valueFrom:
            configMapRef:
              name: web-config
              key: DATABASE_NAME # data key defined within configmap
``` 

***Volume Variable***

```
## reference configmap in defintion

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        volume:
        - name: web-config-volume
          configMap:
              name: web-config
``` 

#### Secrets

Similar to a ConfigMap, Secrets are also defined as key-value pairs. The distinction remains at the value that is put in. The value is a base64 encoded string. Although it is not really safe to save as base64 encoded, atleast this minimizes the risk of accidental display of actual values. 

Secrets are saved in etcd at the master node and are propagated to the nodes only when the pod needs it. kubelet on the node is responsible for the lifecycle management of the local copy of secrets within the node.

Again 3 ways to refer secrets in POD definition file after being created. 

```
# secrets file definition: webapp-secret.yaml

apiVersion: v1
kind: Secret
metadata:
  name: webapp-secret
data:
  DB_HOST: Q29tcGFueV9Qcm9qZWN0X215c3FsZGI= ## base64 encoded Company_Project_mysqldb
  DB_ADMIN: cm9vdA== ## base64 encoded root
  DB_PASSWORD: UEAkJHcwcmQ= ## base64 encoded P@$$w0rd
```


Inject into a POD as ***Environment Variable***

```
## reference configmap in defintion

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        envFrom:
        - secretRef: 
              name: webapp-secret
``` 

Inject into a POD as ***Volume Variable***

```
## reference configmap in defintion

apiVersion: v1
kind: Pod
metadata:
    name: web
    lables:
        key1: value1
specs:
    containers:
      - name: nginx-webapp
        image: nginx
        ports:
          - containerPort: 8080
        volume:
        - name: webapp-secret-volume
          secret:
              name: webapp-secret
``` 
