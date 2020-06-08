---
layout: default
title: Koushik's - Scribble
---
<p>This is a journey to focus, highlight and create a positive impact on not just work including ongoing activites </p>

<ul class="posts">

  {% for post in site.posts %}
    <li>
        <span>{{ post.date | date_to_string }}</span> <br/>
        &emsp<a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
    </li>
  {% endfor %}
    
</ul>
