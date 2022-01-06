---
layout: post
title: Create Self Sign cert with Root using OpenSSL
---
<!-- Post Content -->

3 steps to create certificate which also has common name on it. Here are the steps:

1. Create Certificate Key: `openssl genpkey -out lts-appgw.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048`

1. Create Certificate Server Root (csr): `openssl req -new -key lts-appgw.key -out lts-appgw.csr`

> Note: Input fields will have common name to be added on the root

1. Generate Self-Signed certificate (cer) from the root: `openssl x509 -req -days 365 -in lts-appgw.csr -signkey lts-appgw.key -out lts-appgw.crt`


To create pfx for the cer file: 

`openssl pkcs12 -inkey lts-appgw.key -in lts-appgw.crt -export -out lts-appgw.pfx`

> Note: This prompts for password