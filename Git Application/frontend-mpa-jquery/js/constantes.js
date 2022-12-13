const SERVER_URL = 'http://localhost:5000'
const API_URL = SERVER_URL + '/api'
const STATIC_URL = SERVER_URL + '/static'


function getQueryStringParameters(url) {

    var urlParams={},
    match,
    additional = /\+/g, // Regex for replacing additional symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) 
             { return decodeURIComponent(s.replace(additional, " ")); },
    query;
    if (url){
       if(url.split("?").length>0){
       query = url.split("?")[1];
    }
    }else{
       url = window.location.href;
       query = window.location.search.substring(1);
    }
    while (match = search.exec(query)){
      urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
}