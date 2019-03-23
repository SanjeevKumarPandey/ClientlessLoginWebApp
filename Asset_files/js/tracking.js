/************************************************************************************************

 * tracking.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
$(document).ready(function(){
    var dt = new Date();
    tms = dt.toLocaleString();

//deviceInfo
console.log("Device: "+
navigator.platform,
navigator.userAgent,
navigator.vendor,
navigator.connection.effectiveType);



//geo
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(success);
// }

// function success(position) {
//     console.log('AccessTime: '+tms);
//     console.log('Latitude: ' + position.coords.latitude);
//     console.log('Longitude: ' + position.coords.longitude);
// }

//battery
// var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

// function logBattery(battery) {
//     console.log("Battery: "+battery.level*100 +"%");
//     console.log("Charging: "+battery.charging);
//     console.log(battery.dischargingTime);

//     battery.addEventListener('chargingchange', function() {
//         console.log('Battery chargingchange event: ' + battery.charging);
//     }, false);
// }

// if (navigator.getBattery) {
//     navigator.getBattery().then(logBattery);
// } else if (battery) {
//     logBattery(battery);
// }

//IP
var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({iceServers:[]});
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
    };
    
    rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });
    
    
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateDisplay(newAddr) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
        console.log(displayAddrs.join(" or perhaps ") || "n/a");
    }
    
    function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                var parts = line.split(' '),
                    addr = parts[2];
                updateDisplay(addr);
            }
        });
    }
})(); else {
    console.log("<code>ifconfig | grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>");
    console.log("In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.");
}

    
    });