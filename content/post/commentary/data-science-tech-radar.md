---
title: "Introducing the Data Science Tech Radar"
lead: "Taking the right technological decisions is a cornerstone of successful projects. This tech radar, which is geared towards projects in the data science/AI sphere, can help you take the right decisions."
author: Matthias Döring
date: '2020-08-15'
description: "The data science/AI tech radar is a tool for selecting appropriate technologies when starting new projects."
slug: "data-science-ai-tech-radar"
downloadRmd: false
categories:
  - commentary
tags:
  - software engineering
thumbnail: "/post/commentary/tech_radar_avatar.png"
---
Radar visualizations for technological choices have been pioneered by [ThoughtWorks](https://www.thoughtworks.com/radar).
In the meantime, many organizations have created their own tech radars to map out which technologies should be considered
for use by members of the organization.

The German online fashion retailer [Zalando](https://en.zalando.de) has even made the [source code of their
tech radar](https://github.com/zalando/tech-radar) publicly available. Since technological decisions
for data science and AI projects are distinct from conventional applications, I decided to 
adapt Zalando's tech radar.

## What does the Tech Radar Show?

The [data science and AI tech radar](http://tech.datascienceblog.net) shows four sectors:

* **Data Management:** Technologies for storing/querying/processing data, particularly in the big data context.
* **Infrastructure:** Technologies for managing technical infrastructure (e.g. servers).
* **Frameworks:** Technologies that are useful for application development.
* **Languages:** Programming languages that are suitable for data science and AI projects.

Each sector is divided into four rings:

* **ADOPT:** Technologies that are useful in most contexts; very low risk.
* **TRIAL:** Technologies that are useful in some contexts; slightly more risky.
* **ASSESS:** Predominantly new technologies that are risikier because there is a lack of experience.
* **HOLD:** Technologies that should not be used in new projects. Usually because they have been supplanted by more recent technologies.

Each technology is represented as a dot in the visualization and its assignment into one of the four rings indicates
the assessment of the technology. You can click on any of the dots to obtain a description of the technology, which
indicates why a certain evaluation was made.

## Contribute to the Tech Radar

Currently, the tech radar largely reflects my own experiences with the technologies. My intention, however, is that the tech radar should incorporate the knowledge from the community.
So, if you think that any technology is missing or that it should be re-evaluated, please get in touch
with me, for example, by writing a comment!


