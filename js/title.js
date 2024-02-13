function updateTitle() {
  // show utc time with milliseconds
  var date = new Date();
  var time = date.toISOString().split('T')[1].split('.')[0];
  
  document.title = time;
}

// Update the title every second
setInterval(updateTitle, 1000);

// Call the function initially to set the title immediately
updateTitle();
