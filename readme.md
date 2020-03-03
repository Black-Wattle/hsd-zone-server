# Simple HSD Hosting

This is a simple application that will allow an HSD domain owner to manage their domain and also host simple websites.

### Features:

The application features the following:

- Authoritative DNS server
- Simple HTTP Webserver
- Automatic 2nd level domain hosting, ie **example**.test

## Getting started:

### Prerequisites:

- A linux server w/ dedicated IP
- NodeJS 10<
- NPM

### Required step for Ubuntu users:

This repo has been tested on a Ubuntu 18.04 server and **requires** small modifications to run on this distribution. This is due to the `system-resolved` process running on the default DNS port (53).

Using an editor change the `DNSStubListener` line in `/etc/systemd/resolved.conf` to the following:

```
DNSStubListener=no
```

Then restart the `system-resolved` process using the following command:

```
sudo systemctl restart systemd-resolved
```

To ensure that the port is free run the following command:

```
sudo lsof -i :53
```

### Install:

Once the server has port 53 free we can continue with the setup. Start by cloning the repo onto the server:

```
git clone git@github.com:black-wattle/hsd-zone-server.git
cd hsd-zone-server
npm i
```

Once the install has completed, using your favourite editor modify the `zonefile` in the directory by replacing all instances of `laboratory.` With your HSD domain name **followed by a** `.`

Once you've done this, replace the IP address `165.22.195.251` with your server's static IP address. 

Finally, open `index.js`and do the same: replace the one instance of `laboratory.` with your HSD domain name.

Now you should be able to start the server with:

```
node index.js
```

### Testing:

You'll be able to test the server's operation using the following:

**DNS Operation**

```
dig @<server ip> <HSD Domain> SOA
```

The response should contain the following:

```
;; ANSWER SECTION:
laboratory.             1800    IN      SOA     laboratory. hostmaster.laboratory. 2015091220 10800 3600 604800 1800
```

**Web Server**

Try loading the web server by pointing your browser to `http://localhost` . The server should return the page found in the `public/default` folder. 

## HSD Configuration

At this point we have a DNS server providing responses to requests and files being served up but we aren't resolvable when asking a HSD node. In order to make this happen we need to add the following records to our domain configuration:

```
Type:    NS 
Value:   ns1.laboratory. // Replace with your HSD name
---
Type:    GLUE4
name     ns1.laboratory. // Replace with your HSD name
address: 165.22.195.251  // Replace with your server IP
---
Type:    GLUE4
name:    laboratory.     // Replace with your HSD name
address: 165.22.195.251  // Replace with your server IP

```

Once you've submitted these to the network you will have to wait up to 32 confirmations for these to be added to the HSD master records list known as the Urkle Tree.

At that point you should be able to navigate to `http://hsd.<your domain>/` & `http://<your domain>` if you are using a HSD node are your DNS resolver! 

For an easy way to get a HSD resolver to test follow the "**DNS-over-HTTPS server**" section of [https://easyhandshake.com/](https://easyhandshake.com/).

Congratulations on your new domain space and website 🎉

## Adding New Websites

Now you have your domain space being actively served you may want to add subdomains like, `potato.laboratory` or `cat.laboratory`. 

In order to do this, all you need to do is add a new folder with your subdomain's name into `public/`.

```
- public
	--- default
	--- hsd
	--- <any subdomain you want>
```

Any files in that folder will be served at `http://<folder name>.<hsd name>`. 

However if you try to browse to a subdomain that has no files you will be served the files within the `public/default` folder.

## Author

lewi 🥔

[info@blackwattle.ad](mailto:info@blackwattle.ad)

`hs1qe2yqlqnrycg24uaw45gkefnqzwc9s0pxfer22l`





