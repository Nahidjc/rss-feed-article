let students = [
  {
    fname: "Rohan",
    lname: "Dalal",
    age: 19,
  },

  {
    fname: "Zain",
    lname: "Ahmed",
    age: 17,
  },

  {
    fname: "Anadi",
    lname: "Malhotra",
    age: 19,
  },
];

// function compare_lname(a, b) {
//   if (a.age > b.age) {
//     return -1;
//   }
//   if (a.age < b.age) {
//     return 1;
//   }
//   return 0;
// }

// students.sort(compare_lname);
// console.log(students);
students.sort((a, b) => {
  return b.age - a.age;
});
console.log(students.slice(0, 1));
