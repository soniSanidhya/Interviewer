const abc = () => {
  const a = def();
  const b = fde();
  return { a, b };
};

const def = () => {
  return "abc";
};

const fde = () => {
  return "cde";
};

const { a, b } = abc();
console.log(b);
