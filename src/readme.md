 ***Update this readme if any new folder is added and add the required description for it***
#### This directory contains the following folders:
1. controllers
>Basically acts as helper for your routers(you don't have to write complex routers,</br>simply check for require params in routers and call the controller sending the req.body directly)
2. lib
>Contains common logics/methods used all over the codebase
3. middlewares
>Contains different middlewares for authentication, verification checks etc.
4. models
>Contains declaration of different tables/collections to be used
5. param_validators
>This file will contain param validation files for every endpoint, there will be one file each for every router</br>
and that file fill contain param validation for all routes.</br>
6. routers
>Contains declaration of all REST API endpoints.
7. services
>Contains complex business logics, that cannot be put into controllers.
