---
layout: post
title: CKAD Preparation - Development Environment
---
<!-- Post Content -->

So it is time to jump into Kubernetes Application Development. Target is set, hope to build a series of posts as I prepare for Kubernetes Application Developer Certification.

### Learning guide pinpoint

With few recommendation from friends, colleagues, and references gather following material:
 - Udemy course by [KodeKloud](https://www.udemy.com/course/certified-kubernetes-application-developer/)
 - [Tech With Nana](https://www.youtube.com/channel/UCdngmbVKX1Tgre699-XLlUA)

 ### Setup environment to install Minikube

 To get started, I want to make sure my work is saves outside my laptop. So, I already have Azure Subscription, I am going to make use of it.

 #### Generate keys to access virtual machine
 - To access the Ubuntu sever from my windows machine, have windows terminal installed to make use of _[SSH](https://docs.microsoft.com/en-us/windows/terminal/tutorials/ssh)_
 - Create keys (optional), open windows terminal at user level using `ssh-keygen`, generate public and private keys. 

 ![](/assets/2021-04-01-sshkeygen.jpg)

 #### Create Ubuntu VM 

 - Spin up Canonical.UbuntuServer in Azure
    - Make sure 3 series is selected size, because Virtualization is supported. Select D3 series: `Standard D2s v3 (2 vcpus, 8 GiB memory)`
    - Make sure to have `ssh` port open, so that the VM can be access
    - Have auto shutdown to minimize costs

 Here is the [deployment template](https://github.com/koushik-aravalli/development/blob/master/CKAD/Environment/azure-ubuntu-template.json)

 #### Connect to VM

  - Now the VM is ready, to connect from local machine, in this case windows machine, the private key is saved to `.ssh\id_rsa\` folder. It could as well be `.ssh\azureadmin\` as in my case I have work with multiple keys.

  ```
  C:\Users\Koushik\.ssh\azureadmin>ssh -i id_rsa azureuser@<virtual machine pip>
  ```

 ![](/assets/2021-04-01-connect-to-vm.jpg)


#### Enable Virtualization on Azure VM

_Why: Minikube, that we will use for development, can run with and without virtualMachine driver. In this case we have a Azure VM, and we let minkikube use this as a host. And let minikube create virtualMachine inside this AzureVM._

 - During VM creation, `Standard D2s v3 (2 vcpus, 8 GiB memory)` Size is selected. Check virtualization on the server using commands
    ```
    lscpu | grep -i virtual
    ```
Output:
    ```
    Virtualization:      VT-x
    Virtualization type: full
    ```

#### Install Hypervisor

- Install VirtualBox within the VM

    ```
    sudo apt install virtualbox virtualbox-ext-pack
    ```

#### Install Minikube

Follow the steps below to install `minikube` and `kubectl`

```
## Download binaries
 curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

## Copy to local bin
sudo cp minikube-linux-amd64 /usr/local/bin/minikube

## Set execution permissions to minikube
sudo chmod 755 /usr/local/bin/minikube

## Check Minikube 
minikube version

```

#### Check and Install kubectl

Kubectl is already part of the Minikube but incase it is not

```
## Download binaries
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

## Make it executable
chmod +x ./kubectl

## Copy to local bin
sudo mv ./kubectl /usr/local/bin/kubectl

## Check kubectl
kubectl version

```

### Start Minikube

Run the command to start minikube

```
minikube start
```

Output:

 ![](/assets/2021-04-01-minikubestart.jpg)

#### Shutdown or Restart VM - Handle Minikube

As the AzureVM is stopped and restarted after deallocation, in the backend the host at the Azure datacenter resets the _Virtualization_ settings. Therefore command to start the minikube will result in **Exiting due to PROVIDER_VIRTUALBOX_NOT_RUNNING: signal: killed**. So rerun the virtualization command as [above](#Enable-Virtualization-on-Azure-VM)