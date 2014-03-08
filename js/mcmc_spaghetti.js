importScripts("jstat.min.js");

self.addEventListener("message", function (e) {
  data = [];
  var x = 0;
  for (i = 0; i < 10000000; i++) {
    x += jStat.poisson.sample(4);
  }
  x = 0;
  for (i = 0; i < 10; i++) {
    data.push([x, jStat.poisson.sample(4)]);
    x += 1;
  }
  self.postMessage(data);
});


