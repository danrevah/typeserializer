# TypeSerializer

<p align="center">
<br/>
<a href="https://www.npmjs.com/package/typeserializer"><img src="https://img.shields.io/npm/v/typeserializer.svg?style=flat-square" alt="npm"></a>
<a href="https://travis-ci.org/danrevah/typeserializer"><img src="https://travis-ci.org/danrevah/typeserializer.svg?branch=master" alt="Build Status"></a>
<a href='https://coveralls.io/github/danrevah/typeserializer'><img src='https://coveralls.io/repos/github/danrevah/typeserializer/badge.svg' alt='Coverage Status' /></a>
<a href="https://github.com/danrevah/typeserializer/blob/master/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT licensed"></a>
<br/><br/>
TypeSerializer, designed to make prettier code while using exclusion strategies on objects. 
<br/><br/>
</p> 

## Table of contents

 - [Installation](#installation)
 - [Strategies](#strategies)
    - [Name](#name)
    - [Manual Exclude](#manual-exclude)
    - [Exclude All](#exclude-all)
    - [Groups](#groups)
    - [Deep Objects](#deep-objects)
    - [Version](#version)
    - [Dynamic Exclusion](#dynamic-exclusion)
    - [Deserializer](#deserializer)
    - [Custom Deserializer](#custom-deserializer)
    - [Custom Serializer](#custom-serializer)

## Installation

Install using npm: 

```
 $ npm install typeserializer --save
```

### Strategies

#### Name

Changing name of a selected property is supported by using the `@Name` decorator.

```typescript
 import {serialize, Name} from 'typeserializer';

 class SomeObject {
 
   foo = 'foo';
   
   @Name('two')
   bar = 'bar';
 }
 
 const obj = new SomeObject();
 console.log(serialize(obj)); // prints: '{ two: 'bar' }'
````


#### Manual Exclude
 
 While using the default manual exclude you only need to decorate the properties you like to exclude with `@Exclude`.
 This will cause the property to be EXCLUDED from the response.
 
 
```typescript
 import {serialize, Exclude} from 'typeserializer';

 class SomeObject {
 
   foo = 'foo';
   
   @Exclude()
   bar = 'bar';
 }
 
 const obj = new SomeObject();
 console.log(serialize(obj)); // prints: '{ foo: 'foo' }'
````

#### Exclude All
 
 Using `all` as the exclusion strategy will exclude all properties except for those marked as `@Expose()`.
 
```typescript
 import {serialize, Expose, Strategy, ExclusionPolicy} from 'typeserializer';

 @Strategy(ExclusionPolicy.ALL)
 class SomeObject {
 
   foo = 'foo';
   
   @Expose()
   bar = 'bar';
 }
 
 const obj = new SomeObject();
 console.log(serialize(obj)); // prints: '{ bar: 'bar' }'
````

#### Groups
 
 You can expose different properties by using the `@Groups` annotation.
 
```typescript
 import {Strategy, Expose, ExclusionPolicy, Groups, serialize} from 'typeserializer';

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
````

### Deep Objects

TypeSerializer can also serialize deep objects. 

```typescript
 import {Strategy, Expose, ExclusionPolicy, Groups, serialize} from 'typeserializer';

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
 import {Strategy, Expose, ExclusionPolicy, serialize, Before, After} from 'typeserializer';

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

#### Dynamic Exclusion

If you would like to use a dynamic approach as an exclusion strategy, you can also make use of the dynamic exclusion capability.

```typescript
import {Strategy, Expose, ExclusionPolicy, serialize} from 'typeserializer';

 function validator(object: any, propertyKey: string) {
   return propertyKey === 'prop';
 }
 
@Strategy(ExclusionPolicy.ALL)
 class Foo {
 
   @Expose(validator)
   prop = 'prop';
 
   @Expose(validator)
   prop2 = 'prop2';
 
   @Expose(validator)
   prop3 = 'prop3';
 }
 
 const foo = new Foo();
 console.log(serialize(foo)); // prints: '{ prop: 'prop: }'
``` 

#### Deserializer

TypeSerializer also contains a `deserialize()` method, to deserialize JSON to objects.

This will require adding a `@Type` annotation to the 'complex' type properties including `Date`.  

```typescript
import {deserialize, Type} from 'typeserializer';

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
import {Deserializer, deserialize} from 'typeserializer';

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
import {Serializer, serialize} from 'typeserializer';

class Bar {
  @Serializer((m: Moment): any => m.format('LLLL'))
  date: Moment;
}

const bar: Bar = serialize(fixture, Bar);

console.log(foo.getDate()); // '21-12-2012'


``` 
