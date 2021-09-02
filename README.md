# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Pharmenable KMS
* Version 1.0.0

### Where it will run? ###

* It will run on ``` localhost:5000 ```

### How to commit and push? ###

* First you need to format your code with ``` npm run format ```
* If you want to check more detail on format tool which we are using [Prettier](https://prettier.io/)
* Check with eslint that your code follow all the coding standars or not ``` npm run lint ```
* If lint error is auto fixable than you can run this command ``` npm run lint-fix```
* You can find more detail on eslint rules here [Eslint rules](https://eslint.org/docs/rules/)
* You won't be able to commit if you will have lint errors
* When everything is perfect add your code with ``` git add -A ```
* Add message to your code by following commitlint standards ``` git commit -m "type(scope?): subject" ```
* Here is an example of commit message ``` git commit -m "feat: user registration" ``` here is more example [commitlint](https://github.com/conventional-changelog/commitlint)

### Basic rules to follow when you code ###

* Your file should not be more than 1000 lines
* Your method/function should be below 100 lines
* Use proper meaniful name for variable, methods and classes
* Always devide your code into smaller components and make a common function when something is using more than 1 place
* Follow the comments standards, whenever you write anything complicated or add code from third party mentioned logic and links in comments
* Always do compact coding, lesser the lines higher the quality (but never complicate simple logic for this)

### Type casing rules for coding ###

* Folder names will be in camelCase
* File name will be in PascalCase (some general file like index, store, routes will be defined in small case only)
* Class name will be in PascalCase
* Function name will be camelCase
* Variable name will be camelCase

### Deployement ###
* Devops and CI/CD things will come here

