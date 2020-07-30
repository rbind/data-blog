---
title: "How to Bypass Corporate Firewalls?"
lead: "Corporate firewalls often prevent access to anything outside the company intranet. However, if your company is offering a proxy for accessing external resources it's a matter of minutes to establish connectivity to the outside world."
author: Matthias Döring
date: '2020-07-30'
downloadRmd: false
description: "Learn how you can use cntlm to bypass a corporate firewall in order to access the internet."
thumbnail: "/post/other/firewall_avatar.png"
categories:
  - other
---
Companies usually have firewalls in place, which ensure that the internal network is protected. To access the outside world, all traffic must be routed
through a proxy. When you are using the standard operating system (typically Windows), you are automatically authenticated with this proxy.

However, when you are using a non-standard operating system (e.g. through a virtual machine running Linux), you are not automatically authenticated
with the company's proxy. The sad result: you won't be able to access the internet out of the box.

Luckily, there are tools that allow you to authenticate with the corporate proxy. In this post, I will show you
how to bypass the corporate firewall using cntlm, a [NTLM/NTLMv2 HTTP proxy](https://linux.die.net/man/1/cntlm) that can authenticate with the parent proxy
and forward all of your requests there.

## Download and install cntlm

cntlm is available for Windows, BSD, and Linux via [Sourceforge](https://sourceforge.net/projects/cntlm/). Consider your system's package manager for
installation options, for example, `sudo apt-get install cntlm -y`. The following instructions are for Unix systems.

## Basic cntlm configuration

Now, collect the following information:

- `$USER_NAME`: your Active Directory username.
- `$USER_DOMAIN`: the Active Directory domain. When you login to Windows, the domain should appear as `USER_DOMAIN\USER_NAME`.
- `$PROXY`: the company proxy to query. If you do not know this yet, ask around in your company. It should be documented somewhere.

Once you have all the data, open the cntlm configuration file located at `etc/cntlm.conf` and replace all of the
dollar-variables in the following snippet with your personal data:

```bash
Username	$USER_NAME
Domain		$USER_DOMAIN
Proxy		$PROXY
```

## Generate hashed passwords

We still have not entered any password for authentication. This is because entering a clear-text password would be a security risk.
Instead, we will use cntlm to generate a hashed password by running

```bash
cntlm -H -u $USER_NAME -d $USER_DOMAIN
```

After entering the password of your user account in the dialog,
cntlm will produce an output along the following lines:

```bash
PassLM          FCC6931111783755BDF802F2....
PassNT          C3E55110f44D69816318530E....
PassNTLMv2      912DB57BE638Df1B845C7.....
```

Copy the output with all of the passwords into `/etc/cntlm.conf`. 

To test whether cntlm works, run

```bash
cntlm -M http://google.com
```

## Run the cntlm daemon

To start the cntlm daemon, run:

```bash
sudo systemctl start cntlm
```

To enable cntlm on every boot, run:

```bash
sudo systemctl enable cntlm
```

## Configure cntlm as the default proxy

Even though cntlm is set up properly, you still won't be able to access the internet yet.
For example,

```bash
curl www.google.com
```

should not return a proper result because your system is not routing traffic through cntlm yet. To route all of your machine's requests to cntlm, enter the following values in your user's `.bashrc` file:

```bash
export http_proxy=http://127.0.0.1:3128
export https_proxy=$http_proxy
export HTTP_PROXY=$http_proxy
export HTTPS_PROXY=$http_proxy
export ftp_proxy=$http_proxy
export FTP_PROXY=$http_proxy
```

With this configuration, cntlm is set as the default proxy every time you open up a console.

To see if your setup works, run `source .bashrc` and then execute `curl www.google.com` again. You should now receive the URL data from Google.

Congratulations you can now access the internet!

## Don't forget to update your cntlm configuration when your password changes

A pitfall when using cntlm is that you must update the password in `cntlm.conf` every time
you change the password of your user account. So, remember, if your internet connectivity is gone one day, it's most likely
that you forgot to update `cntlm.conf`. Also remember to execute `sudo systemctl restart cntlm` when you modify the cntlm configuration.

