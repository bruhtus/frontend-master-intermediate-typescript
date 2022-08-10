# Frontend Master Intermediate Typescript

## Declaration Merging

Declaration merging is a phenomenon by which types and values can piggyback on
top of each other and they can be treated as a single name entity in our
source code.

Typescript allow us to stack multiple things into one identifier like this:
```typescript
interface Fruit {
  name: string;
  color: string;
  mass: number;
};

const Fruit = {
  name: 'banana',
  color: 'yellow',
  mass: 69,
};

export { Fruit };
```

> In this case, identifier is something that has a name and defined in a
> single place.

In the example above, we named the type interface and the const variable the
same thing. Both of them is independent until we export it to the outside
world. If we export both of them into the outside world, like the example
above, both `Fruit` is stacked on top of each other.

Other than type and variable, we can also stack namespace like this:
```typescript
class Fruit {
  static createBanana(): Fruit {
    return { name: "banana", color: "yellow", mass: 183 }
  }
}

// the namespace
namespace Fruit {
  function createFruit(): Fruit {
    // the type
    return Fruit.createBanana() // the class
  }
}

interface Fruit {
  name: string
  mass: number
  color: string
}

export { Fruit }
```

which result in three `Fruit` stacked into each other.

### What is Namespace?

An important aspect of typescript is, it needs to be able to describe existing
javascript libraries. Basically it is a type information that matches a
regular javascript code. Namespace is more about backwards compatibility and
not something we often find added to modern code base.

### Class

Class is a value and a type of the same name stacked on top of each other, and
depending on the context in which we use it, whether as a value or a type, we
are using it only one piece of it.

Example of class:
```typescript
class Fruit {
  name?: string
  mass?: number
  color?: string
  static createBanana(): Fruit {
    return { name: "banana", color: "yellow", mass: 183 }
  }
}
```

We can either use that class as a value like this:
```typescript
const valueTest = Fruit;
valueTest.createBanana();
```

or use that class as a type like this:
```typescript
const typeTest: Fruit = { name: 'banana' };
```

but, we don't have access to both of types and value at the same time.

## Modules

First, everything we are used to see around module import and export in ES
Module javascript world, also works for typescript.

Here is an example:
```javascript
import { strawberry, raspberry } from './berries'; // named imports.
import kiwi from './kiwi'; // default import.
export function makeFruitSalad() {} // named export.
export default class FruitBasket {} // default export.
export { lemon, lime } from './citrus'; // re-exports.
```

Re-export is when we passing another component of external module into current
module and then export them out as if they are a named exports from current
module.

In the example above, we passing `lemon` and `lime` which originate in `citrus` module into current module and then export them out.

Although it is uncommon in javascript world, it is possible to import an
entire module as namespace. Typescript also support this as well. Here is an
example:
```typescript
import * allBerries from './berries'; // namespace import.
allBerries.strawberry; // using the namespace.
allBerries.raspberry; // using the namespace.
export * from './berries'; // namespace re-export.
```

## Type Queries

Type queries allow us to obtain a type from a value. There are two keywords
related to type queries, which is:
- `keyof`
- `typeof`

### Keyof

Keyof allows us to obtain all of the properties keys from an interface or
object.

Here is an example:
```typescript
type DatePropertiesNames = keyof Date;
```

### Typeof

Typeof is a more direct type query in that we are literally saying, "we have a
value and we wish to get the type that describe this value".

Here is an example:
```typescript
async function main() {
  const apiResponse = await Promise.all([
    fetch('https://example.com'),
    Promise.resolve('titanium white'),
  ]);

  type ApiResponseType =  typeof apiResponse;
}
```

## Conditional Types

Conditional types are like ternary operator but for type information, in fact
conditional types use exactly the same syntax.

The format for conditional types would be something like this:
```typescript
condition ? ifTrue : ifFalse
```

Here is an example:
```typescript
class Grill {
  startGas() {}
  stopGas() {}
}

class Oven {
  setTemperature(degrees: number) {}
}

type CookingDevice<T> = T extends 'grill' ? Grill : Oven;

let device1: CookingDevice<'grill'>; // let device1: Grill
let device2: CookingDevice<'oven'>; // let device2: Oven
```

`extends` is the only tool we have, as typescript version 4.3, for expressing
conditions.

> We can think of `extends` like asking a question, "does everything on the
> left fit within the set on the right?".

> Be careful to not use conditional type too much because it is not simple for
> the type checker to evaluate and we can end up slowing down the speed of type
> checking.

## Extract and Exclude

Extract is used to obtain a subpart of a type that we are looking for.
Exclude is used to obtain a subpart of type that we want to leave behind.

Behind the scenes, extract and exclude use conditional type.

Here is an example of extract type:
```typescript
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

// just the type that is string.
type StringColors = Extract<FavoriteColors, string>;

// give whatever subpart of this type that as a property called red, whose
// type is number.
type ObjectColors = Extract<FavoriteColors, { red: number }>;

// this will have type never, because there is only a tuple number with length
// 3 and not 1.
type TupleColors = Extract<FavoriteColors, [number]>;
```

> If typescript did not find the subpart type that we are looking for, it will
> give us `never` type.

Here is an example of exclude:
```typescript
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

// just the type that is not string.
type NonStringColors = Exclude<FavoriteColors, string>;
```

## Inference with Conditional Type

Conditional type have a special tool called `infer` keyword which can be used
to extract some subpart of one type from another type.

**This `infer` keyword can only be used within the condition expression of a
conditional type**.

Here is an example:
```typescript
class FruitStand {
  constructtor(fruitNames: string[]) {}
}

// this use newable which specific to class constructor.
type ConstructorArg<C> = C extends {
  new (arg: infer A): any
}
  ? A
  : never

let fruits: ConstructorArg<typeof FruitStand>; // let fruits: string[]
```

## Indexed Access Types

The concept here is that we are going to grab a piece of type information from
another type using something that feels like a property key.

Here is an example:
```typescript
interface Car {
  make: string;
  model: string;
  year: number;
  color: {
    red: string;
    green: string;
    blue: string;
  };
}

// Car.color does not work here, we need to use square brackets and pass a
// string literal type.
let carColor: Car['color'];

// we can specify the object type like this.
let carColorRed: Car['color']['red'];

// we can also pass a union type and get a union type too.
let carProperty: Car['color' | 'year'];
```

## Mapped Types

Mapped types is kind of like `array.map()`, what we are about to see feels
sort of like looping behavior where we are iterating over all the keys of
something and we are producing a type for value.

Here is an example:
```typescript
type Fruit = {
  name: string;
  color: string;
  mass: number;
};

type Dict<T> = { [k: string]: T }; // index signature.

const fruitCatalog: Dict<Fruit> = {}

// despite it is an empty object, this will still have type Fruit because
// index signature does not really check the property key of a dictionary.
fruitCatalog.apple

// mapped type.
type MyRecord<KeyType extends string, ValueType> = {
  [FruitKey in KeyType]: ValueType
};

function printFruitCatalog(fruitCatalog: MyRecord) {
  fruitCatalog.cherry; // no error.
  fruitCatalog.apple; // no error.

  // Throw error
  // Property 'pineapple' does not exist on type 'MyRecord'.
  fruitCatalog.pineapple;
}
```

## Template Literal Types

Let's say we have something like this:
```typescript
type ArtFeatures = 'cabin' | 'tree' | 'sunset';

type Colors =
  | 'darkSienna'
  | 'sapGreen'
  | 'titaniumWhite'
  | 'prussianBlue';
```

We can do something like this:
```typescript
// the result would be:
// paintDarkSiennaCabin | paintDarkSiennaTree | paintDarkSiennaSunset | ...
type ArtMethodNames = `paint${Capitalize<Colors>}${Capitalize<ArtFeatures>}`
```

## Extra Notes

**Implement the non-abstract thing first and then pulling thing out to make it
parameterized**.

## References

- [Frontend master course](https://frontendmasters.com/courses/intermediate-typescript/).
- [Course website](https://www.typescript-training.com/course/intermediate-v1).
