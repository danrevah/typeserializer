# TypeSerializer

<p align="center">
<br/><br/>
Serializer / deserializer of javascript objects
<br/>
This Project is a fork of [danrevah/typeserializer](https://github.com/danrevah/typeserializer)
<br/><br/>
</p> 

## Table of contents

 - [Installation](#installation)
 - [Decorators](#decorators)
    - [Exclude](#exclude)
    - [Expose](#expose)
    - [Name](#name)
    - [Groups](#groups)
    - [Version](#version)
    - [Type](#type)
 - [Deep Objects](#deep-objects)
 - [Custom Deserializer](#custom-deserializer)
 - [Custom Serializer](#custom-serializer)

## Installation

1. Install using npm: 

```
 $ npm install typeserializer --save
```

2. You also need to install reflect-metadata shim:

```
 $ npm install reflect-metadata --save
```

3. Import `reflect-metadata` in a global place of your app (for ex. index.ts):

```typescript
import 'reflect-metadata';
```

### Decorators

#### Exclude
 
* Note that if a class member does not has a default value then it may not be deserialized. Although basic testing shows that it works, it might not work in some usecase.

 While using the default manual exclude you only need to decorate the properties you like to exclude with `@Exclude`.
 This will cause the property to be EXCLUDED from the response.
 
 
```typescript
 import {serialize, Exclude} from '@rubix-code/typeserializer';

 class User {
 
   name = 'dan';
   
   @Exclude()
   password = '123456';
 }
 
 const user = new User();
 console.log(serialize(user)); // prints: '{ name: 'dan' }'
```

#### Expose
 
 Using `all` as the exclusion strategy will exclude all properties except for those marked as `@Expose()`.

 Even `private` and `protected` members can be exposed and used for serialization.
 (This feature is not available in the fork source)
* Note that not all decorators will work with private members. Please file an issue if you do.
 
```typescript
 import {serialize, Expose, Strategy, ExclusionPolicy} from '@rubix-code/typeserializer';

 @Strategy(ExclusionPolicy.ALL) // <-- This is Required!
 class User {
   @Expose()
   private name = 'dan';
   
   password = '123456';
 }
 
 const user = new User();
 console.log(serialize(user)); // prints: '{ name: 'dan' }'
```

#### Expose - Dynamic Exclusion

If you would like to use a dynamic approach as an exclusion strategy, you can also make use of the dynamic exclusion capability.

```typescript
import {Strategy, Expose, ExclusionPolicy, serialize} from '@rubix-code/typeserializer';

 function validator(object: any, propertyKey: string) {
   return object[propertyKey] > 5;
 }
 
@Strategy(ExclusionPolicy.ALL)
 class Foo {
 
   @Expose(validator)
   prop = 1;
 
   @Expose(validator)
   prop2 = 10;
 
   @Expose(validator)
   prop3 = 8;
 }
 
 const foo = new Foo();
 console.log(serialize(foo)); // prints: '{ prop2: 10, prop3: 8 }'
``` 

#### Name

Changing name of a selected property is supported by using the `@Name` decorator.

```typescript
 import {serialize, Name} from '@rubix-code/typeserializer';

 class User {
 
   @Name('name')
   myName = 'dan';
   
 }
 
 const user = new User();
 console.log(serialize(user)); // prints: '{ name: 'dan' }'
```

#### Groups
 
 You can expose different properties by using the `@Groups` annotation.
 
```typescript
 import {Strategy, Expose, ExclusionPolicy, Groups, serialize} from '@rubix-code/typeserializer';

 @Strategy(ExclusionPolicy.ALL)
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
 console.log(serialize(user)); // prints: '{ username: 'Dan', age: 28 }'
 console.log(serialize(user, ['user-account'])); // prints: '{ username: 'Dan' }'
 console.log(serialize(user, ['user-details'])); // prints: '{ age: 28 }'
 console.log(serialize(user, ['user-account', 'user-details'])); // prints: '{ username: 'Dan', age: 28 }'
```

### Deep Objects

TypeSerializer can also serialize objects deeply.

```typescript
 import {Strategy, Expose, ExclusionPolicy, Groups, serialize} from '@rubix-code/typeserializer';

@Strategy(ExclusionPolicy.ALL)
class UserDetails {

  @Expose()
  @Groups(['name'])
  firstName = 'Dan';

  @Expose()
  @Groups(['name'])
  lastName = 'Revah';

  @Expose()
  @Groups(['other'])
  age = 28; 
}

@Strategy(ExclusionPolicy.ALL)
 class User {
 
   @Expose()
   @Groups(['user-account'])
   username = 'Dan';
 
   @Expose()
   @Groups(['user-details'])
   details = new UserDetails();
 
   password = 'foo';
 }
 
 const user = new User();
 console.log(serialize(user, ['user-details'])); // prints: { details: { firstName: 'Dan', lastName: 'Revah', age: 28 } }
 console.log(serialize(user, ['user-details', 'name'])); // prints: { details: { firstName: 'Dan', lastName: 'Revah' } }
 console.log(serialize(user, ['user-details', 'other'])); // prints: { details: { age: 28 } }
```

#### Version

You can also serialize a property by version number with @Before & @After.

```typescript
 import {Strategy, Expose, ExclusionPolicy, serialize, Before, After} from '@rubix-code/typeserializer';

@Strategy(ExclusionPolicy.ALL)
 class UserDetails {
 
   @Expose()
   @Before('1.2.0')
   firstName = 'Dan';
 
   @Expose()
   @Before('1.2.0')
   lastName = 'Revah';
 
   @Expose()
   @After('1.2.0')
   fullName = 'Dan Revah';
 }
 
 const user = new UserDetails();
 console.log(serialize(user)); // prints: '{ firstName: 'Dan', lastName: 'Revah', fullName: 'Dan Revah' }'
 
 console.log(serialize(user, [], '0.4.2')); // prints: '{ firstName: 'Dan', lastName: 'Revah' }'
 console.log(serialize(user, [], '1.1.9')); // prints: '{ firstName: 'Dan', lastName: 'Revah' }'
 
 console.log(serialize(user, [], '1.2.0')); // prints: '{ fullName: 'Dan Revah' }'
 console.log(serialize(user, [], '1.3.0')); // prints: '{ fullName: 'Dan Revah' }'
```

#### Type

TypeSerializer also contains a `deserialize()` method, to deserialize JSON to objects.

Since TypeScript doesn't transpiles types, it is a requirement to add `@Type` annotation for the 'complex' type properties, including JavaScript's `Date`.  

This is very useful when you are getting a JSON string, and you know it's of a certain type.


```typescript
import {deserialize, Type} from '@rubix-code/typeserializer';

const fixtureSimple =
  '{"firstName":"Dan","lastName":"Revah","age":28,"isHere":true,"birthDate":"2018-07-15T05:35:03.000Z"}';
  
const fixtureChild = `{"child":${fixtureSimple}}`;
const fixtureChildren = `{"children":[${fixtureSimple}, ${fixtureSimple}]}`;

class Simple {
  firstName: string;
  lastName: string;
  age: number;
  isHere: boolean;

  @Type(Date)
  birthDate: Date;
  
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class SimpleChild {
  @Type(Simple) 
  child: Simple;
}

class SimpleChildArr {
  @Type([Simple])  // You must wrap with '[]' when defining an array of a type.
  children: Simple[];
}

const simple: Simple = deserialize(fixtureSimple, Simple);

 console.log(simple); // Simple { firstName: "Dan", ... }
 console.log(simple.getFullName()); // Now you can even use class methods! -> Prints 'Dan Revah'. 
 

 console.log(deserialize(fixtureChild, SimpleChild)); // SimpleChild { child: Simple { firstName: "Dan", ... } }
 console.log(deserialize(fixtureChildren, SimpleChildArr)); // SimpleChildArr { children: [Simple { ... }, Simple { ... }] }

``` 

#### Custom Deserializer

It's also possible to use a custom deserializer, in-case you have any 'special' types you want to handle.

For example you could deserialize *to* a Moment instance using the `@Deserializer()` annotation.

```typescript
import {Deserializer, deserialize} from '@rubix-code/typeserializer';

const fixture = '{"date":"2012-12-21T00:00:00"}';

class Foo {
  @Deserializer((m: string): any => Moment(m))
  date: Moment;
  
  getDate() {
    return this.date.format('DD-MM-YYYY');  
  }
  
}

const foo: Foo = deserialize(fixture, Foo);

console.log(foo.getDate()); // '21-12-2012'
``` 

#### Custom Serializer

It's also possible to use a custom serializer, in-case you have any 'special' types you want to handle.

For example you could serialize *from* a Moment instance using the `@Serializer()` annotation.

```typescript
import {Serializer, serialize} from '@rubix-code/typeserializer';

class Bar {
  @Serializer((m: Moment): any => m.format('DD-MM-YYYY'))
  date: Moment;
}

const bar: Bar = new Bar();

bar.date = Moment('2012-12-21T00:00:00');

console.log(serialize(bar)); // {"date":"21-12-2012"}
``` 

And ofcourse this can be combined with the previous custom Deserializer:
```typescript
import {Serializer, serialize} from '@rubix-code/typeserializer';

class Bar {
  @Deserializer((m: string): any => Moment(m))
  @Serializer((m: Moment): any => m.format('DD-MM-YYYY'))
  date: Moment;
}

const bar: Bar = new Bar();
bar.date = Moment('2012-12-21T00:00:00');
const json = serialize(bar);
console.log(json); // {"date":"21-12-2012"}

const bar2: Bar = deserialize(json, Bar);
console.log(bar2.getDate()); // '21-12-2012'

``` 
