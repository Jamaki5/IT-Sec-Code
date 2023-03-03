const sleep = (time) => {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {}
  return new Promise((r, _) => r());
};

exports.sleep = sleep;
