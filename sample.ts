/**
 * Sample TypeScript file
 * Created on: 2026-04-10
 * File format: .ts
 */

// Interface definition
interface Person {
  name: string;
  age: number;
  hobbies: string[];
}

// Function with type annotations
function greet(person: Person): string {
  return `Hello, ${person.name}! You are ${person.age} years old.`;
}

// Variable with type annotation
const user: Person = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'hiking']
};

// Generic function
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}

// Usage
const fruits: string[] = ['apple', 'banana', 'orange'];
const firstFruit = getFirstElement(fruits);

console.log(greet(user));
console.log('First fruit:', firstFruit);