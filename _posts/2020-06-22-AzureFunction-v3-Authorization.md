---
layout: post
title: Azure Function (v3) with Authorization - Turnkey approach
---
<!-- Post Content -->


## Working with Azure Functions as typical API

When Azure functions were launched in January 2017, it was fascinating to see how easy it is to copy bits of of code. Honestly, I used it for testing code behavior rather than utilizing it to the most. And during the same year in June, talking to the Product team at Integrate 2017, some fantastic use cases were unveiled lighting up few bulbs in my head.

While enterprises chase the dream to APIfy all their products, cloud service providers speedup the innovations.

## Problem Statement
The APIs are defined and published across organization to be consumed by Authorized groups. Although App Service Authentication can be managed within Azure (Portal/PS/CLI), the challenge is to have authorization set. How are these tackled to minimize the risk of cross teams breaching into private data sets.

Here is the illustration of what we are trying to solve
![](/assets/Authroized-AzFunction.jpg)

## Turn Key solution
Within [Azure docs](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to), highlights the usage of Turn-Key approach to address the Authorization issue. 

Here is the prerequisite:

1. Create an Azure FunctionApp and Add Authentication by registering it in the AzureAD

1. Assume there are two Azure AD groups, if not create, and multiple users or ServicePrincipal in each group

1. Select one of the two ADGroup members are only allowed to consume the FunctionApp API

1. As FunctionApp is invoked, request header 'Authorization' should be added with Bearer token

1. Before calling the Function within the FunctionApp, invoke a service within the pipeline to perform authorization

### Within Authorization Service - high level overview of the process

1. Read and capture the incoming request header token

1. Read and capture, user context

1. Get claims for the incoming user context, e.g. ObjectId, TenantId, Name

1. Using GraphAPI, GET AD Group memberships linked to the ObjectId

1. Check if the selected ADGroup which is allowed to consume the Function is part of the ObjectId membership list.


## V3 of Azure Function: What does it mean?

It is almost a day in day out work to write, publish and deploy APIs as developers and architects (yes they do write code). .NET Core is a norm, if you do not believe it look in the [stackoverflow's statistics](https://insights.stackoverflow.com/survey/2019#technology-_-other-frameworks-libraries-and-tools). 

Azure Function with the .NET core starting from V2 version supports Dependency Injection. And V3, launched in September 2019, is implemented with .NET 3.1 

## Enough scribbling... code please
If you jumped here, you have not missed anything about awesomeness of .NET core and Azure Function.

So where do we start...

### For the prerequisites
[Azure Docs](https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad) provides details on how to create Authentication on an App Service. 

In this example Azure Function 'its-authenticated' is deployed in 'pass-workload' resource group.

#### Check delegated SPN
After this step, from azure cloud shell get the dedicated service principal of the FunctionApp

```
  az webapp auth show --name 'its-authenticated' --resource-group 'paas-workload'
```

From the response, get clientId.

#### Create AAD Group

- AAD group who are allowed to consume Functions within Azure FunctionApp
  ```
    az ad group create --display-name DevOpsTeamOne --mail-nickname devopsteam-one
  ```

- AAD group who are not allowed to consume Functions within Azure FunctionApp
  ```
    az ad group create --display-name DevOpsTeamTwo --mail-nickname devopsteam-two
  ```

#### Add member to AAD Group
- Add clientId (SPN) of the FunctionApp to the authorized AAD group
  ```
    az ad group member add --group DevOpsTeamOne --member-id $client_id
  ```

- Add _sampleuser_ to the unauthorized AAD group
  ```
    az ad group member add --group DevOpsTeamTwo --member-id ${objectid_of_user}
  ```

#### Get access-token for a user
- Login as the ServicePrincipal [client_secret value is part of the command](check-delegated-spn)
- Run az cli command to get the token
  ```
    az account get-access-token
  ```

#### Decode token
To check if the token belongs to the expected Tenant and is a valid user. You can also decode the token using [jwt.io](https://jwt.io/#encoded-jwt) and check manually

Here is the sample code to get details using Azure AD GraphApi:

```
  string aadObjectUrl = $"https://graph.windows.net/{TenantId}/directoryObjects/{incommingClientObjectId}?api-version=1.6";
  using (var aadObjectResponse = await _client.GetAsync(aadObjectUrl))
  {
      string objectContent = await aadObjectResponse.Content.ReadAsStringAsync();
      aadObjectResponse.EnsureSuccessStatusCode();

      dynamic aadObject = JsonConvert.DeserializeObject(objectContent);
      if (aadObject.ObjectType == "ServicePrincipal")
      {
          principalDataRsp.DisplayName = $"{aadObject.DisplayName} ({aadObject.AppId})";
      }

      _log.LogInformation($"Called by '{principalDataRsp.DisplayName}' with object id '{principalDataRsp.ObjectId}' and tenant id '{principalDataRsp.TenantId}'.");

  }
```
  _Note: httpclient is initialized with default authorization headers as the incoming accesstoken._

  ```
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
  ```
#### Get Group Memberships of the current user context

Again using AzureAD graph API get all group membership that the user context has. 

  ```
    string memberGroupsUrl = $"https://graph.windows.net/{TenantId}/directoryObjects/{incommingClientObjectId}/getMemberGroups?api-version=1.6";
    HttpContent postContent = new StringContent("{ \"securityEnabledOnly\": true }", Encoding.UTF8, "application/json");
    using (var membersGroupResponse = await _client.PostAsync(memberGroupsUrl, postContent))
    {
        membersGroupResponse.EnsureSuccessStatusCode();

        string membersGroupContent = await membersGroupResponse.Content.ReadAsStringAsync();

        JsonDocument json = JsonDocument.Parse(membersGroupContent);
        JsonElement valueElement = json.RootElement.GetProperty("value");
        bool authorizedGroupFound = false;
        int numberOfGroups = valueElement.GetArrayLength();
        _log.LogInformation($"Found {numberOfGroups} groups of which the service principal '{principalDataRsp.DisplayName}' is a member.");

    }
   ```
#### Finally check if the list has valid Authorized group
    
    Use Linq or normal conditional loop
    ```
      foreach (JsonElement arrayElement in valueElement.EnumerateArray())
      {
          if (arrayElement.GetString() == AuthorizedGroupObjectId)
          {
              authorizedGroupFound = true;
              break;
          }
      }
    ```


That's it.. ;) ... Hope that give a starting point.. Here is the [repo](https://github.com/koushik-aravalli/functionapp-dotnetcore) for reference