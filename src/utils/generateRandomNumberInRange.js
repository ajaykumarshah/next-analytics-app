export const  generateRandomNumberInRange=(min, max)=> {
    min = Math.ceil(min); // Ensure min is an integer (inclusive)
    max = Math.floor(max); // Ensure max is an integer (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }