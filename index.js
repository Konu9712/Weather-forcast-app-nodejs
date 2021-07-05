const http = require("http");
const fs = require("fs");
var calc = require("./calc.js")

var requests = require("requests");


const homeFile  = fs.readFileSync("index.html", "utf-8");

replaceVal = (tempVal,orgVal) =>{
    var temperature = tempVal.replace("{%tempval%}", calc.divide(orgVal.main.temp,10).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", calc.divide(orgVal.main.temp_min,10).toFixed(2));
    temperature = temperature.replace("{%tempmax%}",calc.divide(orgVal.main.temp_max,10).toFixed(2));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    
    console.log( calc.divide(orgVal.main.temp,10).toFixed(2));
    return temperature;
    
}

const server = http.createServer((req, res) => {

    if(req.url =="/"){
       requests(
           "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid={process.env.APPID}"
           )
           .on("data", (chunk) => {
               const objdata = JSON.parse(chunk);
              const arrData = [objdata]
            
            const realTimeData = arrData.map((val) =>replaceVal(homeFile,val))
            .join("");
          res.write(realTimeData);
        

            }) 
            .on("end",  (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
            console.log("end");
            });
    }
});

server.listen(8000, "127.0.0.1");