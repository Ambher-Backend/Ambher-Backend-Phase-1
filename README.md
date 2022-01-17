## Ambher-Backend-Phase-1


### Steps to run the server at your local
1. Run `npm i`
> This will setup node modules at your system.
2. In the root directory of the project execute `npm run dev`
> This will start the server at `Port-5000`.


#### Requirement
1. Node.js.
2. npm package manager.
3. Port-**5000** should be free.


#### Coding Guidelines
1. Always get your code **reviewed** before merging it into the **master** branch.
2. Always create a new branch for a task, **never** commit directly into **master** branch.
> New branch can be created using: `git checkout -b <New Branch Name>`
3. Always use **camel-casing** for variable naming and **upper camel-casing**(preferred) for function, class naming.
```
const FooBar = () => {} // Upper Camel-casing for functions
const fooBar = 5; // Lower camel-casing for variables.
```
4. Use under-score casing/snake casing for file/folder namings.
5. Make use of `let` and `const` only. Use of `var` is prohibited.
6. Make use of arrow functions wherever possible(use `function` keyboard when extremely required).
7. Use tab size of **2**.
8. Always format your code and use semi-colons.
9. Always enclose your router definition in a try catch block and always use async-await.
```
router.post('/', middleware, async(req, res) => {
    try{
        ...
    }catch(err){
        ...
    }
})
```
10. Always break your code into smaller chunks to avoid complexity.
11. Always comment your code wherever required(where you feel, it might be difficult for someone else to understand).


*** Code will be deployed on a bi-weekly cycle on Fridays after the hosting configurations are all set***
