Author: Xinyuan Wang

Assignment 2

This is a filter list, you can type in the movie name in at the list on the webpage, keywords will be highlighted and " " for all the movies in the list

if you type movies that does not exist in the list, it will show nothing.

part of the server.js:


```
function getParams(query){
  var params = {};
  query
    .split('&')
    .forEach(function(param){
      var arr = param.split('=');
      params[arr[0]]=decodeURI(arr[1].replace('+', '%20'));
    });
  return params;
}
```

This is for split parameters

```
if(uri.query) {
    var params =  getParams(uri.query);
    var result = movies.filter(function(movie){
        return movie.toLowerCase().indexOf(params['search'].toLowerCase()) != -1;
    });

    console.log(result);
    // PROCESS THIS QUERY TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    console.log( uri.query )
    console.log(params)
    res.end( result.map(function(r){
      return r.replace(new RegExp('('+params['search']+')', 'ig'), '<span style="background-color: black; color:white">$1</span>');
    }).join('\n') )
  }
  ```
This is the main part of handle search, RegExp(), highlight the key word were used in this assignment, I consider them as the challange part.

