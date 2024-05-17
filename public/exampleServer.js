var http = require("http");
var fs = require("fs");

function send404Message(response) {
    response.writeHead(404, { "Content-Type": "text/plan" });
    response.write("404 에러...");
    response.end();
}

function onRequest(request, response) {
    if (request.method == "GET" && request.url == "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("./index.html").pipe(response);
    } else {
        send404Message(response);
    }
}

http.createServer(onRequest).listen(8080);
console.log("Server Create!!");
