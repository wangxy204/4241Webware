var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , qs = require('querystring')
  , port = 8080;



var content= [];

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
    break
    case '/index.html':
      sendFile(res, 'public/index.html')
    break
    case '/README.md':
      sendFile(res, 'README.md','text')
    break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
    break
	  case '/server_id':
	  res.end(mkID())
	  break
	  case '/requirePosts':
	  res.end(JSON.stringify(content))
	  break
	  case '/upload':
		add(req,res)
	  break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

function add(request, response){
	if (request.method == 'POST') {
    var body = '';
    request.on('data', function (data) {
        body += data;
        if (body.length > 1e6) { 
            request.connection.destroy();
        }
    });
    request.on('end', function () {

        var POST = qs.parse(body);
		content.push(JSON.parse(POST.postinfo));
		response.end();
	
	});
	
	}
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
function mkID(){
  var text = "";
  var possible = "0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  for( var i=0; i<9; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
