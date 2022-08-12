interface FruitProperty {
  name: string;
  color: string;
  mass: number;
}

type MyFruit = {
  [FruitKey in 'apple' | 'cherry']?: FruitProperty;
};

function fruitCatalog(fruit?: MyFruit): FruitProperty | '' {
  if (fruit) {
    if (fruit.apple) return fruit.apple;
    if (fruit.cherry) return fruit.cherry;
  }
  return '';
}

const myApple: FruitProperty = {
  name: 'malang apple',
  color: 'green',
  mass: 69,
};

const myCherry: FruitProperty = {
  name: 'cherry',
  color: 'red',
  mass: 6,
};

console.log(fruitCatalog({ cherry: myCherry }));
console.log(fruitCatalog());

type MyFruitGeneric<Keys extends 'apple' | 'cherry'> = {
  [fruitKey in Keys]?: FruitProperty;
};

function fruitCatalogGeneric(
  fruit?: MyFruitGeneric<'apple' | 'cherry'>
): FruitProperty | '' {
  if (fruit) {
    if (fruit.apple) return fruit.apple;
    if (fruit.cherry) return fruit.cherry;
  }
  return '';
}

console.log(fruitCatalogGeneric({ apple: myApple }));

// similar to built-in Partial<> in typescript.
type MyFruitGenericVerbose<Fruit, Keys extends keyof Fruit> = {
  // apple?: FruitProperty
  [Parameters in Keys]?: Fruit[Keys];
};

type Fruits<Property extends FruitProperty> = {
  apple: Property;
  cherry: Property;
  banana: Property;
};

function fruitCatalogGenericVerbose(
  fruit?: MyFruitGenericVerbose<
    Fruits<FruitProperty>,
    keyof Fruits<FruitProperty>
  >
): Partial<Fruits<FruitProperty>> | '' {
  if (fruit) {
    return fruit;
  }
  return '';
}

const myBanana: FruitProperty = {
  name: 'banana',
  color: 'yellow',
  mass: 69420,
};

console.log(fruitCatalogGenericVerbose({ cherry: myCherry, banana: myBanana }));
