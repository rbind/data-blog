---
title: "Implementing Polls Using Staticman"
author: Matthias Döring
date: '2018-11-16'
downloadRmd: false
description: "With Staticman it is possible to integrate user-generated content into static sites. Here, I demonstrate how Staticman can be used to implement polls into websites that are generated with Hugo. "
thumbnail: "/post/other/staticman_comments_avatar.png"
thumbnailsrc: "Figure: staticman.net"
categories:
  - other
tags:
  - Hugo
---
In a previous post, I have described [how to set up your own Staticman instance and use it to run a commenting system](/post/other/staticman_comments/). Since Staticman is not limited to bringing comments to static sites, I decided to implement polls with Staticman as well.

## Overview

In order to get polls working, the following steps need to be followed:

1. Adjust your Staticman configuration to include a configuration for polls
2. Create two subfolders in your data  folder: one for storing the votes and one for setting up the polls
3. Implement the Hugo template logic for the polls in your partials
4. Implement JavaScript/CSS to allow for participating in the poll and viewing the results

## Staticman configuration

Configuring Staticman for polls is relatively straight-forward. The most important parameters in the ```staticman.yml``` config file are the following:

* As ```path```, set the data folder for storing the poll votes.
* For ```allowedFields``` and ```requiredFields``` set the fields that should be associated with every vote:
    * path: the location on your website where the poll was accessed.
    * pollID: a unique identifier of the poll. This is used to associate votes with polls.
    * option: the selected poll option (i.e. the vote). This is stored to increment the vote count when generating the site.
    * ipAddress: the IP address of the voter. The IP address is stored to prevent the same user from voting multiple times.
* For ```transforms```, the IP address should be anonymized using md5.
* The ```moderation``` field can be set to ```false``` since moderation is not necessary for polls.

For further details, please take a look at my [Staticman configuration](https://github.com/rbind/data-blog/blob/master/staticman.yml).

## Folder creation

For polls, we want to set up two folders in the [website's data folder](https://gohugo.io/templates/data-templates/):

1. A folder containing the votes. We will call this folder ```polls``` in the following.
2. A folder for setting up the polls on your page. We will call this folder ```pollSetup``` in the following.

The ```polls``` folder is the folder where Hugo stores the individual votes, so we do not need to do anything except to create the folder.

The ```pollSetup``` folder, however, needs to contain the definitions of the polls that we would like to show on the page. So, how should a poll configuration look like? I am using ```toml``` files with the following variables:

An example configuration could look like [the following file](https://github.com/rbind/data-blog/blob/master/data/pollSetup/favorite_supervised_learning_algorithm.toml).
Note that if multiple polls have the attribute ```show_poll``` set to ```true```, an arbitrary poll from these will be shown in the sidebar. So, typically, you should make sure that at most one poll has this flag set to ```true```.

## Hugo template logic

To implement the logic for polls, I have created [a new partial template](https://github.com/rbind/data-blog/blob/master/themes/Mainroad/layouts/partials/widgets/poll.html). The following paragraphs describe the most important steps for collecting votes and visualizing them.

### Retrieving the appropriate setup file

The first step is to select the setup file that should be used for building the poll. We store the information about the poll. If an external poll ID was not specified, we select one of the polls that has ```show_poll``` set to ```true```. Otherwise, we select the poll that corresponds to the provided poll ID:

### Counting the number of votes

To count the number of votes, we iterate over all poll votes. We only consider those votes where the poll's ID matches the poll ID specified by the active poll. For these votes, we store the IP in a string and increment the number of votes for the selected option.

### Poll submission system

For the poll submission system, we need to set up a post form. Via the hidden fields inputs, the form specifies the parameters that are used for the polls, as defined in your Staticman configuration. There are two additional entries that I use:

* *knownIPs*: Stores a string of IPs that have already voted. This is needed for checking whether a user has already voted via JavaScript.
* *pollActive*: This field (string representing a boolean) indicates whether the poll is currently active.

Finally, the submit button is used to trigger the forms action, which is set to the Staticman API call for the polls context.

### Viewing the results

For viewing the poll results, the main tasks are the following:

1. Count the total number of votes.
2. Find the percentage of votes for each option by dividing by the total number of votes. Here, it is important to typecast to floats and round appropriately.
3. Show the results by indicating three things.
    * The poll option
    * A bar indicating the percentage of votes
    * The percentage itself
4. Display the total number of votes below the individual results.

## CSS and JavaScript

I [use this CSS for styling the polls](https://github.com/rbind/data-blog/blob/master/themes/Mainroad/static/css/poll.css). The task of the [JavaScript code](https://github.com/rbind/data-blog/blob/master/themes/Mainroad/static/js/polls.js) is twofold:

1. Decide whether a vote is possible.
2. Decide whether the poll options or the results should be shown.

## Inclusion of the poll partial

So, now that we have all the components together, we can just include the partial template for the polls in some part of the page. Enjoy the polls!

