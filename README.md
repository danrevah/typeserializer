# TypeSerializer

[![Build Status](https://travis-ci.org/danrevah/typeserializer.svg?branch=master)](https://travis-ci.org/danrevah/typeserializer)

> Serializer designed to make prettier code while using exclusion strategies on objects.  

## Table of contents

 - [Installation](#installation)
 - [Strategies](#strategies)
    - [Manual Exclude](#manual-exclude)
    - [Exclude All](#exclude-all)
    - [Groups](#groups)
 - [Express Integration](#express-integration)
 
## Installation

Install using npm: 

```
 $ npm install typeserializer --save
```

If you're using Express you can also use an additional decorator, to make your controllers look nicer.
Go to the [Express Integration](#express-integration) section.

### Strategies

#### Manual Exclude
 
 While using the manual exclude you only need to decorate the class with the `@TypeSerializer` annotation.
 Now, every property will be INCLUDED in the response, unless you manually `@Exclude` them with the annotation.
 
 
```typescript
 import {TypeSerializer, Exclude} from 'typeserializer';

 @TypeSerializer()
 class SomeObject {
 
   foo = 'foo';
   
   @Exclude()
   bar = 'bar';
 }
 
 const obj = new SomeObject();
 console.log(obj); // prints: '{ foo: 'foo' }'
````

#### Exclude All
 
 While using the `all` as the exclusion strategy it excludes all properties except for the ones who marked as `@Exposed()`.
 
```typescript
 import {TypeSerializer, Expose, ExclusionStrategies} from 'typeserializer';

 @TypeSerializer(ExclusionStrategies.All)
 class SomeObject {
 
   foo = 'foo';
   
   @Expose()
   bar = 'bar';
 }
 
 const obj = new SomeObject();
 console.log(obj); // prints: '{ bar: 'bar' }'
````

#### Groups
 
 You can expose different properties by using the `@Groups` annotation.
 
```typescript
 import {TypeSerializer, Expose, ExclusionStrategies, Groups, serialize} from 'typeserializer';

 @TypeSerializer(ExclusionStrategies.All)
 class User {
 
   @Expose()
   @Groups(['user-account'])
   username = 'Dan';
 
   @Expose()
   @Groups(['user-details'])
   age = 28;
 
   password = 'foo';
 }
 
 const user = new User();
 console.log(user); // prints: '{ username: 'Dan', age: 28 }'
 
 console.log(serialize(user, ['user-account'])); // prints: '{ username: 'Dan' }'
 console.log(serialize(user, ['user-details'])); // prints: '{ age: 28 }'
 console.log(serialize(user, ['user-account', 'user-details'])); // prints: '{ username: 'Dan', age: 28 }'
````

#### Express Integration
 
It's suggested to use the annotation `@TypeSerializerResponse` while working with Express.
 
 1. Add a middleware BEFORE the routes:
 
```typescript
    import {TypeSerializerMiddleware} from 'typeserializer';
    
    // ... 
    
    app.use(TypeSerializerMiddleware());
```

 2. Example of usage:
 
`user.entity.ts:`

```typescript
 import {TypeSerializer, Expose, ExclusionStrategies, Groups, serialize} from 'typeserializer';

 // Defining an object
 
 @TypeSerializer(ExclusionStrategies.All)
 class User {
 
   @Expose()
   @Groups(['user-account'])
   username = 'Dan';
 
   @Expose()
   @Groups(['user-details'])
   age = 28;
 
   password = 'foo';
 }
```


`user.ctrl.ts:`

**IMPORTANT**: you should use `tsJson` instead of `json` in order to use TypeSerializer.
 
```typescript
import {TypeSerializerResponse} from 'typeserializer';

class UserCtrl {
 
   @TypeSerializerResponse(['user-account'])
   static getAccountDetails(req, res) {
     const user = new User();
     return res.status(418).tsJson(a); // prints: '{ username: 'Dan' }'
   }
 }
 
 const express = require('express');
 const router = express.Router();
 
 router.get('/user/account', UserCtrl.getAccountDetails);
```
