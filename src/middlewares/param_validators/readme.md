### How to write a param validator file:
1. Import the param validation lib in the file.
```
const paramValidator = require('../lib/param_validator').ParamValidator;
```
2. Check the `validate` method in main file and pass params accordingly
3. If any param required custom validation, then you can do it in the function defined for the specific route.
4. check the **admin.js** file in **param_validators** dir and write code for your router in the specified router file.

**Note**: If there is some validation which is not reusable in any scenario, then add the validation in the respective
function itself, </br>no need to modify the `/src/lib/param_validator.js`.

