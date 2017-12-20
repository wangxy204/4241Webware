
if(typeof(Storage) !== "undefined") {
	if (localStorage.id) {
		alert("Good to see you again " + localStorage.id);
	}else {
		GetFromServer();		
	}
}
var userid = document.getElementById('name');
userid.innerText = "User ID: " + localStorage.id;
makelist();
function makelist(){
	var f = document.getElementById('floor');
	function reqListener () {
		var content = JSON.parse(this.responseText);
		if(content){
			content.map(function(v){
				f.innerHTML += "<div>ID "+v.userid+":"+v.upload;
				f.innerHTML += "</div>" + "<br>";

			});
		}
		
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", "/requirePosts");
	oReq.send();
}
function GetFromServer(){
	var id = "";
	function reqListener () {
	id = this.responseText;
	localStorage.setItem('id', id);
	alert("Welcome , seems you are new here\nThis is your id: " + localStorage.id);
	userid.innerText = "User ID: " + localStorage.id;
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", "/server_id");
	oReq.send();
}
function sendevent(){
	var input = document.getElementById('input');//
	var f = document.getElementById('floor');
	
	function reqListener () {
		f.innerHTML += "<div>ID "+localStorage.id+":"+input.value;
		f.innerHTML += "</div>" + "<br>";
	}
	
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("POST", "/upload");
	oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var postinfo = {"userid": localStorage.id,"upload": input.value};
	oReq.send("postinfo="+JSON.stringify(postinfo));	

}


