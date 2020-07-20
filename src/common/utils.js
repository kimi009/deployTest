export default function formatDate(param) {
  let TimeArr = [];
  let startTime = param[0];
  let endTime = param[1];
  const date = new Date();
  let Y = date.getFullYear() + "";
  let M = date.getMonth() + 1 + "";
  let D = date.getDate() + "";
  let H = date.getHours();
  let Min = date.getMinutes();
  let S = date.getSeconds();
  let curTime = Y + "/" + M + "/" + D;
  let oDate1 = new Date(endTime);
  let oDate2 = new Date(curTime);
  if (oDate1.getTime() < oDate2.getTime()) {
    endTime = endTime + " 23:59:59";
  } else {
    endTime =
      endTime +
      " " +
      (H < 10 ? "0" + H : H) +
      ":" +
      (Min < 10 ? "0" + Min : Min) +
      ":" +
      (S < 10 ? "0" + S : S);
  }
  startTime =
    startTime +
    " " +
    (H < 10 ? "0" + H : H) +
    ":" +
    (Min < 10 ? "0" + Min : Min) +
    ":" +
    (S < 10 ? "0" + S : S);
  console.log(startTime,endTime);
  
  return TimeArr.push(startTime, endTime);
}
