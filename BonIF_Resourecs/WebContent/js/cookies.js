//쿠키 저장 메소드
function setCookie (name,value,expiredays){
  var exdate = new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  
  var cookie = null;
  cookie = document.cookie;
  cookie = name+"="+escape(value)+((expiredays==null)?"":";expires="+exdate.toGMTString());
  cookie.Path = "/";
  document.cookie = cookie;
}

//쿠키 불러오기 메소드
function getCookie (cookie_name){
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
  if (results) {
      return ( unescape ( results[2] ) );
  } else {
      return null;
  }
} 

//쿠키 삭제 메소드
function delete_cookie (cookie_name) {
  var cookie_date = new Date ( );  // current date & time
  cookie_date.setTime ( cookie_date.getTime() - 1 );
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}