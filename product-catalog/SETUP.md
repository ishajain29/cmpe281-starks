## Application Server Configuration
---
* Create t2.mirco Ubuntu 16.04 instance.
* Install JDK 8 with following commands:
	* sudo add-apt-repository ppa:webupd8team/java
	* sudo apt-get update
	* sudo apt-get install oracle-java8-installer
* Setup apache-tomcat 8.0.46 on the instance
* Open port 8080 in the security group to access Application server.
* Deploy application WAR file on the Tomcat.
