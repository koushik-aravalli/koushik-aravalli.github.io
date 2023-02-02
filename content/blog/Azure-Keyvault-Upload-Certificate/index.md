---
layout: post
title: Upload PFX Certificate to Azure Keyvault
date: "2022-07-07"
description: "How to upload PFX Certificate to Azure keyvault"
tags: ["azure", "keyvault"]
comments: true
---
<!-- Post Content -->


This blogs lists the steps to upload an existing PFX certificate to Azure Keyvault

openssl pkcs12 -in "something.mycompany.com_p12.pfx" -out "something.pem" -nodes -password pass:"<certificate password>"

openssl x509 -in "something.pem" >> "something-export.pem"

openssl pkcs8 -topk8 -nocrypt -in "something.pem" >> "something-export.pem"

Import-AzKeyVaultCertificate -VaultName vault0 -Name something-cert -FilePath something-export.pem
