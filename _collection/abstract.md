---
title: "Abstract"
identifier: "abstract"
collection_list: true
layout: default
draft: false
slug: "abstract"
---

{% include shop/collections.html %}

{% assign products = site.data.products | where: "Tags", page.identifier | group_by: "Title" %}

{% include shop/product-list.html %}