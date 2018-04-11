onmessage = function (baseTime)
{
  const time1 = performance.now();
  let time2;
  let difference;
  setInterval(() =>
  {
    time2 = performance.now();
    difference = baseTime.data + (time2 - time1);
    postMessage(difference);
  }, 20);
};
