// Function for pretty format date
module.exports =  date => {
  let newDate = new Date(date);
  return newDate.toDateString().slice(4);
}