var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080
  , marked = require('marked')
// Add more movies! (For a technical challenge, use a file, or even an API!)
//var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange']
var movies = fs.readFileSync('movies.txt', 'utf8') //it reads file now
    .toString()
    .trim()
    .split("\n");


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

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url);

  switch( uri.pathname ) {
    // Note the new case handling search
    case '/search':
      handleSearch(res, uri);

      break
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    case '/':
      sendIndex(res)
      break
    case '/index.html':
      sendIndex(res)
      break
    case '/style.css':
      sendFile(res, 'style.css', 'text/css');
      break
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript');
      break
    case '/README.md':
      sendFile(res, 'README.md', 'text/html', true);
      break;
    default:
      res.end('404 not found')
  }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// subroutines



// You'll be modifying this function
//===================================================================
function handleSearch(res, uri) {
  var contentType = 'text/html'
  res.writeHead(200, {'Content-type': contentType})
  // var input = document.getElementByName("search");
  if(uri.query) {
    var params =  getParams(uri.query);
    var result = movies.filter(function(movie){
        return movie.toLowerCase().indexOf(params['search'].toLowerCase()) != -1;

    });
    if(result.length > 0){
      res.end( result.map(function(r){
        return r.replace(new RegExp('('+params['search']+')', 'ig'), '<span style="background-color: black; color:white">$1</span>');
      }).join('\n') )
    }
    else {
        res.end('no such movie found')
    }

    console.log(result);
    // PROCESS THIS QUERY TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    console.log(uri.query)
    console.log(params)
  }
   else {
    res.end('no query provided')
  }
}


//===================================================================
// Note: consider this your "index.html" for this assignment
function sendIndex(res) {
  var contentType = 'text/html'
    , html = ''

  html = html + '<html>';

  html = html + '<head>';

  html = html +  '<link href=\"http://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">';
  html += '<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css\">';
  html += '<link rel=\"stylesheet\" href=\"style.css\">';
  html += '<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>';
  html += '<script src=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/js/materialize.min.js\"></script>';
          
 

  // You could add a CSS and/or js call here...
  html = html + '</head>';
 
  html = html + '<body class="container">';
  html = html + '<div class="row" >';
  html = html + '<div class="col offset-s2 s8">';
  html = html + '<h1 align="center">Movie Search!</h1>';

  // Here's where we build the form YOU HAVE STUFF TO CHANGE HERE
 // ========================


  html = html + '<form class="col s12" action="search" method="get" >'
  html = html +'<div class=\"row\"><div class=\"input-field col s12\"><input name = \"search\" id=\"search\" type=\"text\" class=\"validate\"><label for=\"search\">Search</label></div></div>'
  // html = html + '<div class="input-field col s6"><input id="last_name" type="text" class="validate"><label for="last_name">Last Name</label></div>'
  // html = html + '<input type="text" name="search" />'
  html = html + '<div align="center"><button class="btn waves-effect waves-light" type="submit" >search<i class="material-icons right">search</i></button></div>'
  html = html + '<a href="README.md">README</a>'
  html = html + '</form>'

  html = html + '<ul align="center" class="collection">'
  // Note: the next line is fairly complex. 
  // You don't need to understand it to complete the assignment,
  // but the `map` function and `join` functions are VERY useful for working
  // with arrays, so I encourage you to tinker with the line below
  // and read up on the functions it uses.
  //
  // For a challenge, try rewriting this function to take the filtered movies list as a parameter, to avoid changing to a page that lists only movies.
  html = html + movies.map(function(d) { return '<li class="collection-item">'+d+'</li>' }).join(' ')
  html = html + '</ul>';
  html = html + '</div>';
  html = html + '</div>';
  html = html + '</body>';
  html = html + '</html>';
  
  res.writeHead(200, {'Content-type': contentType})
  res.end(html, 'utf-8')
}

function sendFile(res, filename, contentType, isMarkdown) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
      if(isMarkdown)
      res.end("<link rel=\"stylesheet\" href=\"style.css\">"+marked(content.toString()), 'utf-8');
     else res.end(content, 'utf-8');
  })
}
