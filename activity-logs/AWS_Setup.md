## Configuration for Application Server on AWS

* Launch an Ubuntu Server 16.04 LTS instance 
* For the above, create a security group with HTTP/HTTPS ports inbound traffic from anywhere and SSH port only from admin's system IP.
* Attach a security key pair to it with permissions to only the owner.
* After following the steps, launch the instance.
* Connect to the instance using the ssh command and run the following commands to install the required packages to run the nodejs application:
   * git clone the repository with the application into the instance
   * sudo apt-get update
   * sudo apt-get install npm
   * npm install
   * sudo apt-get install nodejs-legacy
* node app.js
