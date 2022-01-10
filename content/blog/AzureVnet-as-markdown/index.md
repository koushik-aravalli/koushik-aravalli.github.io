---
layout: post
title: Azure Network Solution as a Markdown
date: "2021-02-17"
description: ""
categories: [azure network documentation]
comments: true
---
<!-- Post Content -->

While managing large-scale implementations on cloud platforms, Network Solutions deployments are managed by the application teams themselves or a central team. Either way, core resources within a Network solution are Virtual Network with Subnets, Network Security Groups, Route Tables and VirtualNetwork Hubs. To have an overview of the deployed Network Solutions, user interface or control plane (API) provided by the service provider can help us out. **Now how about documenting the Network solution?** This post describes how to generate documentation of a Network Solution. 

**_[ARMVIZ](http://armviz.io/designer)_** is an awesome tool to have a graphical view generated based on the exported arm template. To generate details on top of the visualization, what if there is a `markdown` file generated that is attached to the documentation. **_[Here](https://nugetmusthaves.com/Tag/markdown)_** we can find top NuGet packages to embed within code to generate one. Now, since I am using C# and PowerShell to work with Azure Infrastructure provisioning, in this post I will go through how using **_[PSDOCS](https://github.com/BernieWhite/PSDocs)_** and how I achieved it. 

### Where to start

In Azure Networking Architecture, **_[Hub-Spoke](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli)_** is vastly adopted. Follow **_[basic deployment instructions](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli)_** of the architecture. 

![](../../assets2021-02-17-Azure-Hub-Spoke-Network-Solution.jpg)

### What data is required

All the data required to fill in the markdown needs to be populated in a hash table. Below are the details for a VirtualNetwork in general, it could be a Hub or Spoke.

1. Install PSDOCs PowerShell module

    ```
    $null = Install-PackageProvider -Name NuGet -Force -Scope CurrentUser
    Install-Module -Name PSDocs -RequiredVersion 0.6.3 -Scope CurrentUser -Force
    Import-Module PSDocs
    ```

1. Get VirtualNetwork Information

    ```
    $VirtualNetwork = Get-AzVirtualNetwork -Name $VirtualNetworkName
    $subscription = Get-AzSubscription -SubscriptionId $VirtualNetwork.Id.Split('/')[2]
    ```

1. Derive Subnets Information from the VirtualNetwork
    
    ```
    [PSCustomObject]@{
        subnetName    = $subnet.name
        addressSpace  = $subnet.AddressPrefix
        LoadBalancer  = $false
        DisableJITPIM = $false
    }
    ```

1. Get NSG Information linked to each Subnet and save all security rules into an ArrayList

    ```
    $nsg = Get-AzNetworkSecurityGroup -Name ($subnet.NetworksecurityGroup.Id.Split('/')[-1])

    Foreach ($securityRule in $nsg.SecurityRules) {
        $nsgRule = [PSCustomObject]@{
            Name           = $securityRule.Name
            Direction      = $securityRule.Direction
            Priority       = $securityRule.Priority
            Access         = $securityRule.Access
            'From address' = $securityRule.SourceAddressPrefix
            'To address'   = $securityRule.DestinationAddressPrefix
            'From port'    = $securityRule.SourcePortRange
            'To port'      = $securityRule.DestinationPortRange
        }
        $subnetObj.Nsg.SecurityRules.Add($nsgRule) | out-null
    }
    ```

1. If there are custom DNS Settings also gather that information. Also list all Private DNS Zones linked with the Virtual Network.

    ```
    $dns = @{
        "Name" = $dnsOption
    }
    ```

    ```
    $privateDns = Get-AzPrivateDnsZone
    $vnetLinkedPrivateDns = [System.Collections.ArrayList]@()
    foreach ($pdns in $privateDns) {
        $dnsVnetlink = Get-AzPrivateDnsVirtualNetworkLink -ResourceGroupName $pdns.ResourceGroupName -ZoneName $pdns.Name
        If($dnsVnetlink.VirtualNetworkId -eq $VirtualNetwork.Id){
            $vnetLinkedPrivateDns.Add($pdns.ResourceId)
        }
    }
    ```

### How to populate

PSDocs works by translating `*.doc.ps1` files into a markdown file. To generate a Markdown run the command

```
Invoke-PSDocument -Path <location of *.doc.ps1 file> -InputObject <data as Key-value pair or customObject> -OutputPath <location to save the generated markdown file> -Option <if needed additonal settings to support generation of markdown>;
```

For the above context of Hub-Spoke, a `BaseTemplate.doc.ps1` is created with sections *General information* and *Virtual Network*. 

![](../../assets2021-02-17-BaseTemplate.jpg)


*General information* contains Subscription, ResourceGroup and other information to identify ownership of the VirtualNetwork.

*VirtualNetwork* contains multiple sections e.g., `AddressSpace`, `DNS`, `Subnets`, `RouteTable`, `NSGs`, `Peering`. Either all data can be added in the same file or each section can be divided in a separate template. 

![](../../assets2021-02-17-BaseTemplate-VNET.jpg)

Upon generation of each subsection, all are merged in the BaseTemplate generated markdown. 

For example, using RouteTable data markdown is generated. The content of the markdown is copied back to the input object that will be used to generate VirtualNetwork section.

```
$READMERouteTableTemplateName = 'RouteTable.doc.ps1'
Invoke-PSDocument -Path ('{0}\SubTemplates\{1}' -f $TemplatePath, $READMERouteTableTemplateName) -InputObject $readmeObject -OutputPath $OutputPath -Option $options;

# Add content of the generated file as string. 
$readmeObject.RouteTableSection = (Get-Content -Path "$OutputPath/README.md" -Encoding UTF8 -Raw).Replace('# ', '## ')
```

## Sample files

That is it, now combining all the steps a Network Solution for a HUB or a SPOKE virtual network can be generated describing every detail in a single page.

Here is a sample for the 

- **_[HUB VNET](https://github.com/koushik-aravalli/development/blob/master/LetsTryDocumenting/Hub/README.md)_**
- **_[SPOKE VNET](https://github.com/koushik-aravalli/development/blob/master/LetsTryDocumenting/SpokeOne/README.md)_**


## Where to download source code

All scripts can be found **_[here](https://github.com/koushik-aravalli/development/tree/master/LetsTryDocumenting)_**