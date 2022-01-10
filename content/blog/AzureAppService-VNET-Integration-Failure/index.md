---
layout: post
title: Azure App Service - VNET integration - Locks Subnet
date: "2020-12-17"
description: ""
categories: [azure appservice network]
comments: true
---
<!-- Post Content -->

<br/>

## Problem Statement

When working with Azure App Service and securing the traffic route into and out from the deployed app service, __[VNET integration feature](https://docs.microsoft.com/en-us/azure/app-service/web-sites-integrate-with-vnet)__ is at our rescue. Powerful feature  which enables organizations to create UDR (User Defined Routes) to route traffic into Azure Firewall or Virtual Appliance. Deployment of the feature is smooth and easy, but when the App Service is remove (undeployed) is requested Azure Resource Manager also tends to perform delete action on the Subnet to which the App Service is integrated with, resulting in the following error

 ![](../../assets2020-07-03-AzAppService-Subnet-SAL-Error.jpg)

<br/>

## Cause

As soon as AppService is deployed with VNEt integrated, there are two action that occur in the background. 
* __[Subnet Delegation](https://docs.microsoft.com/en-us/azure/virtual-network/subnet-delegation-overview)__, which enforces a Subnet to be dedicated to host resource of a specific type, here it is ```Microsoft.Web```
* ***Service Association Link***, this locks subnet with the Azure Resource Id. This is cause of the problem because the ResourceId is **_not_** a reference link but a static link.

***Out of experience this is managed by Azure Data Center. Locks on Subnets are recycled on a scheduled period.***

<br/>

## Solution Approaches

- Typically, providing full access is DevOps team typically restricted in almost all organizations. But if you have Subscription level access and have enough rights to delete Virtual Network, then check Resource locks on the Virtual Network to which the App Service is linked to. Remove the locks and retry undeploy. If that does not work well, proceed with the next step. 

- Get the Azure Resource Id of the Service Association Link that is on the Subnet. Force remove it from the subnet object.
Since having delete role is a privilege of a non personal account (Service Principal), using Azure DevOps's Azure PowerShell Task, create inline script with the following

```
Get-AzContext 

Select-AzSubscription -Name $(SubscriptionName)

# Get Virtual Network 
$vnet = Get-AzVirtualNetwork -Name $(VirtualNetworkName)

# Filter for Subnet associated with AppServicePlan
$appservice_integrated_subnet = $vnet.Subnets | Where-Object -FilterScript {$_.Name -eq $(Subnetname)}

# Get Service Association Link ResourceID
$salId = get-azresource -Id $appservice_integrated_subnet.ServiceAssociationLinks.Id

# Check if Azure Resource Exists for the Link
$linkedAzureResource=get-azresource -Id $appservice_integrated_subnet.ServiceAssociationLinks.Link

# If linked resource is null, remove the Service Association Link
# Note: This will result in a failure: Some resources failed to be deleted
# ignore the error, the Link will be removed within 2/3 hours
Remove-AzResource -ResourceId $salId

```
