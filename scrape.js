const scrape = require('scrapeit'),
      select = require('soupselect').select,
      request = require('request'),
      exec = require('child_process').exec;

const webpageUrl = "https://classes.cornell.edu/browse/roster/FA16/class/ENGRD/2700";

const labels = [
    "Class Section DIS 203",
    "Class Section DIS 205",
    "Class Section DIS 206"
];

function writeToOutfile(str) {
    var execStr = "echo \"" + str + "\" >> out.txt";
    exec(execStr, function(err, stdout, stderr){
        if (err) {
            console.log(err);
        }
    });
}

function sendmsg(msg) {
    var options = {
        method: 'POST',
        url: 'http://textbelt.com/text',
        headers: 
        {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: { number: '2404609301', message: msg }
    };
    request(options, (err, res, body) => {
        if (err) {
            console.log("error requesting");
        } else {
            console.log(body);
        }
    });
}

var sent = false;
function foundOpen() {
    if (sent) return;
    sent = true;
    sendmsg("Found section for 2700");
}

function sendUpdate() {
    var msg = "Update: Still Nothing";
    if (sent) {
        msg = "Update: Found class.";
    }
    sendmsg(msg);
}

function startScraping() {
    scrape(webpageUrl, function(err, o, dom) {
        console.log("scraping");
        o(".section").forEach(p => {
            var label = p.attribs['aria-label'];
            if (labels.indexOf(label) == -1) {
                return;
            }
            
            var elem = select(p, "li span i.fa-circle");
            if (elem.length > 0) {
                console.log("open", label);
                foundOpen();
            } else {
                console.log("closed", label);
                //closed
            }
        });
        console.log("done scrape");
    });
}

//every 10 seconds
//startScraping();
//setInterval(startScraping, 60000);

const ONE_HOUR = 60 * 60 * 1000;
//setInterval(sendUpdate, ONE_HOUR);

console.log("scrape.js inactive");
