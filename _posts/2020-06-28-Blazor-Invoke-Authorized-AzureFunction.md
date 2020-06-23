---
layout: post
title: Azure Function (v3) with Blazor Webassembly
---
<!-- Post Content -->
           
## Working with Azure Functions as typical API

When Azure functions were launched in January 2017, it was fascinating to see how easy it is to copy bits of of code. Honestly, I used it for testing code behavior rather than utilizing it to the most. And during the same year in June, talking to the Product team at Integrate 2017, some fantastic use cases were unveiled lighting up few bulbs in my head.

While enterprises chase the dream to APIfy all their products, cloud service providers speedup the innovations.

## V3 of Azure Function: What does it mean?

It is almost a day in day out work to write, publish and deploy APIs as developers and architects (yes they do write code). .NET Core is a norm, if you do not believe it look in the [stackoverflow's statistics](https://insights.stackoverflow.com/survey/2019#technology-_-other-frameworks-libraries-and-tools). 

Now combine the awesomeness of Azure Function with the .NET core, not new that happened in V2 version. Oh is it Dependency Injection? nope that still is possible in V2. 

There are implementations where an WebApp(ASP.NET) would emit events that triggered an Azure Function. So we now are working with TypeScript or JavaScript in combination of C# to divide a line between Server-Side and Client-Side. Ofcourse Blazor, it transforms .NET developers to full stack. 

We can now (since September 2019) run __ServerSide computing on serverless Azure Function__, alongside Blazor being client-side. 

## Enough scribbling... code please
If you jumped here, you have not missed anything about awesomeness of .NET core and Azure Function.

So where do we start

### How is the development environment
* Windows 10

* .NET Core SDK Version
  - Open terminal, if you have not downloaded the new [Windows Terminal - GUI way](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?rtc=1&activetab=pivot:overviewtab) or [Window Terminal - Developers way](https://github.com/microsoft/terminal/releases)
    ```
    dotnet --version
    ```
    If you dont have it install, [get it](https://dotnet.microsoft.com/download).

* [VS Code](https://code.visualstudio.com/download)

* [Function-CLI](https://github.com/Azure/azure-functions-core-tools/releases) - Select 3.xx.yyy

* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest) (Optional, in case you want to deploy)

* Blazor is part of .NET package. It does not mean that the templates are all available (Unless VisualStudio helped in downloading them!)

  - If you get the following error, templates are missing and need to be downloaded
  ```
  Couldn't find an installed template that matches the input, searching online for one that does...
  ```

  - Download Templates - Checkout latest in [Nuget](https://www.nuget.org/packages/Microsoft.AspNetCore.Components.WebAssembly.Templates/)
    ```
    dotnet new --install Microsoft.AspNetCore.Components.WebAssembly.Templates::3.2.0
    ```
    _Note: The combination of .NET version and Blazor is important, .NET version 3.1.100 + 3.2.0 will result in following error:_
    ```
    The "ResolveBlazorRuntimeDependencies" task failed unexpectedly
    ```

  - Create sample Blazor WebAssembly app
    ```
    mkdir Blazor
    dotnet new blazorwasm -o Blazor/Sample-blazor-webassembly
    dotnet build Blazor/Sample-blazor-webassembly/Sample-blazor-webassembly.csproj
    dotnet run --project Blazor/Sample-blazor-webassembly/Sample-blazor-webassembly.csproj
    ```
    
  - Blazor Serverside
    ```
    dotnet new blazorserver -o Blazor/Sample-blazor-server
    dotnet build Blazor/Sample-blazor-server/Sample-blazor-server.csproj
    dotnet run --project Blazor/Sample-blazor-server/Sample-blazor-server.csproj
    ```

    Both the above should endup with sample webpage:
    ![](/assets/blazor-sample.jpg)

## Where is the connection to Azure Function here

