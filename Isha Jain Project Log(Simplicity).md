This Wiki page contains information about how team implemented Extreme Programming(XP) value Simplicity during each week.

### Simplicity according to Extreme Programming (XP)
Simplicity is one of the core values of Extreme Programming. It focuses on-
* Using the simplest possible design to get the job done. 
* Delivering the simplest functionality that meets business needs. 
* Designing the simplest software that supports the needed functionality. 
* Building for today and not for tomorrow. 
* Writing code that is easy to read, understand, maintain and modify. 

## Week-1
Following the simplicity principle, my approach towards the project should be to make the whole development and integration process simple. Like before developing any functionality, I will gather all requirements and then will choose the most simple approach to develop it. Try to avoid additional functionalities that are not needed. Reduce the algorithm complexities, like preferring O(log n) over O(n). While testing also I will only consider testing just the required functionalities. In this way, we will minimize any unnecessary extra effort of development and testing. 
In the first week of our project, we need to finalize the project topic, and decide upon all the important and necessary features. I have gone through all probable features as mentioned in document, and then I sorted them based on simplicity. After that I explained those topics and probable challenges to the team.

## Week-2
This week, we have started building the base for the web application. But before that we need to divide the application in micro services, so that we can start building the basic services. And I suggested that we should focus on the basic features for now and try to keep it as simple as possible and later on if required we can add on more features to it.
One of my project mate suggested to start with the front end template first but I advised to build the base first so that we can add the front-end later as per our requirements. I have also given small hands on session for using Github via bash and gui to make github commit and update simple.

## Week-3
During this week, we have started building the basic database stucture and for that to keep the project simple and manageable we decided upon some common grounds and structure for our databases. And following the REST api principles we have also decided to use the same format for the URLs. Most importantly, we have planned to make a common page containing all the requests and responses for the web servecies we are building.
Currently I am working on the user sessions and to begin with I have started with the user login part, so to keep it simple I have decided to add the base mininum requirements for signing up. One of my teammate wanted to implement product quantity feature in the application but. as it will complicate the things more and we have decided to keep this feature for later, if time permits then we can implement it as it is not the need of the hour.

## Week-4
This week we have started building the basic web services. Hence I suggested all of the team member to build a simple connection oriented service to understand the basics and to maintain a log of all the requests and responses for a particular service which can be later used by other team members. They also planned to have a direct connectivity among the other server's databases, but to keep it simple I proposed to built the apis and do the communication, so that all the data can be shared in simple json format.For simplicity we will use a NoSQL dbs for storing all the data.

## Week-5
In this week we tried to complete our remaining web services and figuring out how to put our databases on cloud and creating clusters. So for creating the shared cart, my teammates were planning to implement two methods: one by sharing a link to the cart and other by adding the members directly, by using their usernames. But for the simplicity sake I suggested to implement only one out of the two methods as it might take long to implement both.
Then I also asked them to finalize a template for front end, so that we can start making changes to the front end according to our web services, such that in later phases of development it will be easy for us. Because integrating all the code at the end will be more troublesome and will take more time.

## Week-6
This week was a bit troublesome for me as for the sake of simplicity I changed my whole project from cassandra to mongodb. In cassandra I was facing some troubles while setting the cluster on cloud on the free tier, so I decided to save some time as I was stuck and all my other teammates are working on mongodb. I took their help and changed some code and was able to setup my new database. My teammates were also planning to implement some multi-tenancy in our project but I suggested them to leave that part as it is not a hard requirement and it unnessesarily increases complexity. 

## week-7
In this week we tried to figure out the feasible way to create a cluster and show partition tolerance. Earlier we planned to built 4 nodes each but as it was making it more complex, so I suggested to keep i simple by just making three nodes, because our main aim is to show partition tolerance and anyways we won't be having 1000's of users accessing our website at the same time. So, replacating nodes doesn't make much sense. We created a shared folder in which our front end template is placed so that we can all have the latest updated version of it and add our code to it.  
