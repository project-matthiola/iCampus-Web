export const GmtToStr = time => {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minite = date.getMinutes();
  let second = date.getSeconds();

  if(month < 10){
    month = "0" + month;
  }
  if(day < 10){
    day = "0" + day;
  }
  if(hour < 10){
    hour = "0" + hour;
  }
  if(minite < 10){
    minite = "0" + minite;
  }
  if(second < 10){
    second = "0" + second;
  }

  let result = year + '-' + month + '-' + day + ' ' +
               hour + ':' + minite + ':' + second;

  return result;
};

export const StrToGmt = time => {
  let GMT = new Date(time);
  return GMT;
};

Array.prototype.remove = function(obj){
  for(var i =0;i <this.length;i++){
    var temp = this[i];
    if(!isNaN(obj)){
      temp=i;
    }
    if(temp == obj){
      for(var j = i;j <this.length;j++){
        this[j]=this[j+1];
      }
      this.length = this.length-1;
    }
  }
} ;

