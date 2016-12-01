# coOk!
Hybrid mobile app built in Ionic 
================================

**version 0.3.0** 

description
-----------

The application server exposes the REST API to get access to a MongoDB database of about 28000 recipes. The mobile application uses the API to register the application into the system and to get the recipes filtered with differents types of queries.
The web server is deployed with a simple client to permit the authentication and registration operations by the web users.
The web server is developed by Node.js version 4.6.1 and the mobile app is an hybrid application built by Cordova/Ionic 2 framework. 

Web server API
--------------

* [GET] /api/recipes?access_token=\<access-token\>
  case 200: [{
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": String,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": String,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mainIngredient": String,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"persons": Number,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": String,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ingredients": [String],
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"preparation": String,
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": String
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//other objects
  ]
  
  case 401: {
  	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"error": {
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Error",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"status": 401,
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": "Autorizzazione richiesta",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"statusCode": 401,
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": "AUTHORIZATION_REQUIRED",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stack": String
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
}

 
