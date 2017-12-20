var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8999
  , qs = require('querystring')

// Add more movies! (For a technical challenge, use a file, or even an API!)
//var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange']
var movies = loadMovies();
	  
var searchName;
//result is the filtered movies
var result = movies;

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)
  
	
  switch( uri.pathname ) {
    // Note the new case handling search
	case '/getMovies':
	  res.end(movies.toString())
	break
    case '/search':
      handleSearch(res, uri)
    break
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    case '/':
      sendFile(res, 'index.html');
      break
    case '/index.html':
      sendFile(res, 'index.html');
    break
	case '/add':
      hAdd(req,res)
    break	
	case '/delete':
      hDel(req,res)
    break
	case '/sort':
      hSort(req,res)
    break
	case '/edit.html':
      sendFile(res, 'edit.html');
    break
    case '/style.css':
      sendFile(res, 'style.css', 'text/css')
    break
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript')
    break
	case '/README.md':
	  sendFile(res, 'README.md', 'text/markdown')
	break
	case '/movies.txt':
	  sendFile(res, 'movies.txt', 'text/txt')
	break
    default:
      res.end('404 not found')
  }

})

server.listen(process.env.PORT || port)
//server.listen(port)
console.log('listening on 8999')

// subroutines

// You'll be modifying this function
function handleSearch(res, uri) {
  /* var contentType = 'text/html'
  res.writeHead(200, {'Content-type': contentType}) */
  searchName = qs.parse(uri.query).search;
  if(searchName!=undefined){
	  result = movies.filter(similarName);
	  res.end(result.toString());
  }else {
    res.end('no query provided');
  }

}
function similarName(movieName){
	return movieName.toUpperCase().includes(searchName.toUpperCase());
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}

function convertSpacetoPlus(str){
	var newStr = "=";

	for(var i=0;i<str.length;i++){
		if(str[i] == " "){
			newStr+='+';
		}else{
			newStr+=str[i];
		}
	}
	return newStr;
}


function saveMovies(){
	fs.writeFileSync('movies.txt',movies.join("."));
}

function loadMovies(){
	var temp=fs.readFileSync('movies.txt', 'utf8')
      .toString()
      .trim()
      .split(".");
	  
/* 	  temp.forEach(function(m){
		  m.replace(/(\r\n|\n|\r)/gm,"");
	  }); */
	return temp;
}

function sortMovies(){
	movies=loadMovies();
	var sorted=movies.sort();
	movies=sorted;
}

function hAdd(request, response){
	if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
			
			if(movies.indexOf(POST.movieAdd)===-1){
					movies.push(POST.movieAdd);
					//sendEdit(response);
			}else{
					
			}
			saveMovies();
			response.end(movies.toString());
	
		});
	}
	
}

function hDel(request, response){
	if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
			
			var ind = movies.indexOf(POST.movieDelete);
				if(ind === -1){
					
			}else{
					movies.splice(ind,1);
			}
				
			saveMovies();
			response.end(movies.toString());
	
		});
	}
	
}

function hSort(request, response){
	if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
			sortMovies();
			saveMovies();
			//sendEdit(response);	
			response.end(movies.toString());
		});
		
	}
}
