document.cookie = "jwt=simpleAuth";
$.post({
  url: '/initDB',
  success: console.log,
  error: console.log
});
