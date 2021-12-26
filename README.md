
![GDG logo](gdglogo.png)


# Welcome Day Platform 
## What is it ??
the Welcome Day Platform is a custom web-based collaborative workspace presented in the form of a 16-bit video game , based on <a href="https://workadventu.re/"> workadventure's</a>
platform

## What's new in GDG welcome day plateform ?

### custom characters

|charachter 1|charachter 2|charachter 3|charachter 4|
|:------------:|:------------:|:-------------:|:-------------:|
![charachter 1](./screens/1.png)|![charachter 2](./screens/5.png)|![charachter 3](./screens/3.png)|![charachter ](./screens/6.png)|



|Abla|Aymen|Brainy|Ouardia|
|:------------:|:------------:|:-------------:|:-------------:|
![abla](./screens/Aboul.png)|![aymen](./screens/Aymen.png)|![Sohaib](./screens/Sohaib.png)|![ouadrdia](./screens/Ouardia.png)|


### custom hoodies & T-shirts
|GDG T-shirt|WTM T-shirt|GDG hoodie|WTM hoodie|
|:------------:|:------------:|:-------------:|:-------------:|
![GDG T-shirt](./screens/t1.png)|![wtm T-shirt](./screens/t2.png)|![GDG hoodie](./screens/h1.png)|![WTM hoodie](./screens/h2.png)|


### camera & microphone permissions warning

|permissions|
|:------------:|
![permission](./screens/permission.jpg)|

### set the name's lengh to 50
|lenght|
|:------------:|
![permission](./screens/lenght.PNG)|

## Setting up a development environment

Install Docker.

Run:

```
cp .env.template .env
docker-compose up -d
```

The environment will start.

You should now be able to browse to http://play.workadventure.localhost/ and see the application.
You can view the dashboard at http://workadventure.localhost:8080/

Note: on some OSes, you will need to add this line to your `/etc/hosts` file:

**/etc/hosts**
```
127.0.0.1 workadventure.localhost
```

Note: If on the first run you get a page with "network error". Try to ``docker-compose stop`` , then ``docker-compose start``.
Note 2: If you are still getting "network error". Make sure you are authorizing the self-signed certificate by entering https://pusher.workadventure.localhost and accepting them.

### MacOS developers, your environment with Vagrant

If you are using MacOS, you can increase Docker performance using Vagrant. If you want more explanations, you can read [this medium article](https://medium.com/better-programming/vagrant-to-increase-docker-performance-with-macos-25b354b0c65c).

#### Prerequisites

- VirtualBox*	5.x	Latest version	https://www.virtualbox.org/wiki/Downloads
- Vagrant	2.2.7	Latest version	https://www.vagrantup.com/downloads.html

#### First steps

Create a config file `Vagrantfile` from `Vagrantfile.template`

```bash
cp Vagrantfile.template Vagrantfile
```

In `Vagrantfile`, update `VM_HOST_PATH` with the local project path of your machine.

```
#VM_HOST_PATH# => your local machine path to the project

```

(run `pwd` and copy the path in this variable)

To start your VM Vagrant, run:

```bash
Vagrant up
```

To connect to your VM, run:


```bash
Vagrant ssh
```

To start project environment, run

```bash
docker-compose up
```

You environment runs in you VM Vagrant. When you want stop your VM, you can run:

````bash
Vagrant halt
````

If you want to destroy, you can run

````bash
Vagrant destroy
````

#### Available commands

* `Vagrant up`: start your VM Vagrant.
* `Vagrant reload`: reload your VM Vagrant when you change Vagrantfile.
* `Vagrant ssh`: connect on your VM Vagrant.
* `Vagrant halt`: stop your VM Vagrant.
* `Vagrant destroy`: delete your VM Vagrant.

## Setting up a production environment

The way you set up your production environment will highly depend on your servers.
We provide a production ready `docker-compose` file that you can use as a good starting point in the [contrib/docker](https://github.com/thecodingmachine/workadventure/tree/master/contrib/docker) directory.
