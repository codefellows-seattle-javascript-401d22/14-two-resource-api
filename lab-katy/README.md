#Installation
Download this repo.
From your terminal, cd into the repo directory. Run npm i to install all the necessary dependencies to run this app.
To start your server, either run the command </npm run start> or </node server.js>

#Endpoints
 
 GET requests:
 //with a valid list id:
 localhost:3000/api/list/:listId

 POST requests:
 //lists can be created by entering a name with the below route
 localhost:3000/api/list

 //weed can be created by entering a weed type and strain to the below route
 localhost:3000/api/list/:listId/weed
 
  
 