---
layout: post
title: Understanding Azure Kubernetes Service with AAD
---
<!-- Post Content -->

When working with AKS that is setup as part of Landing zone, there are quite a few topics to understand from the perspective of 
- Team who is setting up the AKS Landing Zone who represent a product manufacturer
- Team who will work with the AKS Landing Zone, who represent a product user

To get general understanding of AKS Landing Zone ***[refer Azure documentation](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/aks/enterprise-scale-landing-zone#deploy-enterprise-scale-for-aks)***

Secure Baseline Architecture of AKS stands on 6 pillars:
- *Identity*
- Networking
- Cluster compute
- Secure data flow
- Business Continuity
- Operations

Each of the topics cover vast regions of Azure implementations in depth, but this article describes a part of *Identity* that the teams working with the AKS landing zone.

## Types of access

_Kubernetes native RBAC_

Kubernetes by provides RBAC to regulate access to its nodes and its resources based on type of roles and their bindings to a scope of created users/groups. Checkout the [manifest](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#restrictions-on-role-binding-creation-or-update). Challenge here is that, at an *Enterprise* mirroring the entire Active Directory(AD) into the K8S is not realistic. Team setting up the LandingZone should be provided with list of all developers from the Team who works with the AKS landing zone.

Similar to Service Accounts behaviour, which are K8S api generatable objects, administrators of the cluster have ability to request CA certificate signed by the Cluster for a user. Therefore, each user can have a certificate with their account name as common name on the certificate. At this point assuming there are certificates for all required personnel, different [Authorization Strategies](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#authentication-strategies) can be applied to manage the users. Challenge here is that, at an *Enterprise*, additional overhead of maintaining/governing AD within K8S along with the existing AD infrastructure. Landing zone provisioing team 

_Integrating Kubernetes RBAC with AzureAD_

As mentioned above, it is possible to create accessibility for the users based on CA certificate signed by the Cluster. While executing this, identifying limited group of users with granualar access is an option. In the scope of Enterprise scale landing zone, possibility is AKS can be created the RBAC limited to the security group (who are the devops team members) of the Subscription. 

Again the same challenge of governance and synchronizing between group members and certificate regeneration and resigning should be done by the Team who is provisioing the landing zone for every onboarding or retiring of developers of team who works with the Landing zone. 

_Built-In AzureAD RBAC_

Lets first list what are the built-in roles that Azure provides for AKS:
- Azure Kubernetes Service Cluster Admin Role
- Azure Kubernetes Service Cluster User Role
- Azure Kubernetes Service Contributor Role
- *Azure Kubernetes Service RBAC Admin*
- *Azure Kubernetes Service RBAC Cluster Admin*
- *Azure Kubernetes Service RBAC Reader*
- *Azure Kubernetes Service RBAC Writer*

Admin and Cluster Admin roles are limited to the Operators within the team, could be entire team as well but in a Production environment that is limited. Typically we notice the Landing zone provisioning team member being part of these roles. The Service Principals linked to the CI/CD accounts of the team working with the AKS cluster, to deploy their applications, are given Writer permissions and the team members themselves are provided with Reader roles. This approach is in line with the centralization of Active Directory, in with (Azure) cloud native approach, governance and security of applications (Service Principal) and users being regulated at one place, and single inferface with Azure 

Based on the above analysis, AKS with AAD Built-in roles is a preffered approach for many enterprises starting with Landing zones on AKS.

Until now, the analysis is at AKS cluster level, now thinking a step further at the application level which is the second part of the AKS baseline architecture Identity is AAD for Workloads. That will be something for the next post.