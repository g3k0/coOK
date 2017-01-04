# coOk!
Hybrid mobile app built in Ionic 
================================

**version 0.3.1** 

description
-----------

The application server exposes the REST API to get access to a MongoDB database of about 28000 recipes. The mobile application uses the API to register the application into the system and to get the recipes filtered with differents types of queries.
The web server is deployed with a simple client to permit the authentication and registration operations by the web users.
The web server is developed by Node.js version 4.6.1 and the mobile app is an hybrid application built by Cordova/Ionic 2 framework. 

Web server API
--------------

* [GET] /api/recipes?access_token=\<access-token\>  
  case 200: [{  
       "name": String,  
       "type": String,  
       "mainIngredient": String,  
       "persons": Number,  
       "notes": String,  
       "ingredients": [String],  
       "preparation": String,  
       "id": String  
    },  
    //other objects  
  ]  
  
  case 401: {  
  	"error": {  
    "name": "Error",  
    "status": 401,  
    "message": "Autorizzazione richiesta",  
    "statusCode": 401,  
    "code": "AUTHORIZATION_REQUIRED",  
    "stack": String  
  }  
}  

* [GET] /api/appauth/register/:token  
  accetta: \<token\> String;  

  case 401: {  
    "error": {  
      "name": String,  
      "status": Number,  
      "message": String,  
      "statusCode": Number,  
      "stack": String  
    }  
  }  

  case 500: {  
    "error": {  
      "name": String,  
      "status": Number,  
      "message": String,  
      "statusCode": Number,  
      "stack": String  
    }  
  }  

  case 200: {  
    "results": String  
  }  

* [GET] /api/appauth/login/:appId  
accetta: \<appId\> String  

case 200: {  
  "results": String  
}  

case 404: {  
  "error": {  
    "name": String,  
    "status": Number,  
    "message": String,  
    "statusCode": Number,  
    "stack": String  
  }  
}  

case 500: {  
  "error": {  
    "name": String,  
    "status": Number,  
    "message": String,  
    "statusCode": Number,  
    "stack": String  
  }  
}  
