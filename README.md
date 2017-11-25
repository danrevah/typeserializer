# TypeSerializer

> Serializer designed to make prettier code while using exclusion strategies on objects.

## Table of contents

 - [Installation](#installation)
 - [Contributing](#contributing)
 - [Changelog](CHANGELOG.md)
 - [Strategies](#strategies)
    - [Manual Exclude](#manual-exclude)
    - [Exclude All](#exclude-all)
    - [Groups](#groups)
 - [Express Integration](#express-integration)
 
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
 import {TypeSerializer, Expose} from 'typeserializer';

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
 import {TypeSerializer, Expose, Groups, serialize} from 'typeserializer';

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
 
 It's not a must to use with Express if you use it as explained earlier, but if you would like to use it with an annotation instead.
 
 1. Add a middleware BEFORE the routes:
 
```typescript
    import {TypeSerializerMiddleware} from 'typeserializer';
    
    // ... 
    
    app.use(TypeSerializerMiddleware());
```

 2. Example of usage:
 
user.entity.ts:

```typescript
 import {TypeSerializer, Expose, Groups, serialize} from 'typeserializer';

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


user.ctrl.ts:

*IMPORTANT*: you should use `tsJson` instead of `json` in order to use TypeSerializer.
 
```typescript
import {TypeSerializerResponse} from 'typeserializer';

class UserCtrl {
 
   @TypeSerializerResponse(['user-account'])
   static getAccountDetails(req, res) {
     const user = new User();
     return res.status(418).tsJson(a); // it's possible to use `status` or other methods  that was used in combination with `json` before.
   }
 }
 
 const express = require('express');
 const router = express.Router();
 
 router.get('/user/account', UserCtrl.getAccountDetails);
```
