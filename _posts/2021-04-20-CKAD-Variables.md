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

```
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

#### Secrets