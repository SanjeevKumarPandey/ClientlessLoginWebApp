/************************************************************************************************

 * backend.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/

var PUBKEY, PRIVKEY, RESOURCE, REQUESTOR, deviceId, url_hdr, reggie_fqdn, sp_fqdn, sp_url, domain, tempPassMSO;

$(document).ready(function(){
$('#textbox').attr('readonly', true);
if(localStorage['_reg'] !== undefined) $("#regcode").val(localStorage['_reg']);
var dt = new Date();
tms = dt.toLocaleString();
var feedbackConsole = $("#textbox");
var feedbackText = "";
document.getElementById('redirectUrl').value = "http%3A%2F%2Fadobe.com%3A5500%2FLoginWebApp%2FRedirectComplete.html";

$("#reg_btn").click(function(){
$.ajax({
  method: "POST",
  url: "cgi-bin/regcode.py",
  data: {"PUBLIC_KEY" : PUBKEY, "PRIV_KEY": PRIVKEY, "REQID": REQUESTOR, "DEVID": deviceId, "UA": url_hdr, "REG_FQDN": reggie_fqdn},
  dataType: "text",
success: function(result){
  var data__=JSON.stringify(result);
  feedbackText = '\n<strong>'+tms+':</strong> '+result.replace(/^\s+/, '').replace(/\s+$/, '');
  feedbackConsole.val(feedbackConsole.val() + feedbackText);
  var d = ((data__.split('Regcode: ')[1]).split('device_info')[0]).slice(0, 7);
  $("#regcode").val($.trim(d));
  localStorage['_reg'] = $.trim(d);
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = "30px Arial";
  ctx.fillText(d,10,50);
}

}); });

$("#authz_btn").click(function(){
$.ajax({
method: "POST",
url: "cgi-bin/theApp.py",
data: {"PUBLIC_KEY" : PUBKEY, "PRIV_KEY": PRIVKEY, "REQID": REQUESTOR, "DEVID": deviceId, "UA": url_hdr, "RESID": RESOURCE, "REG_FQDN": reggie_fqdn, "SP_FQDN": sp_fqdn },
dataType: "text",
success: function(result){
    feedbackText = '\n<strong>'+tms+':</strong> '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
    feedbackConsole.val(feedbackConsole.val() + feedbackText);
}

}); });

$("#freepreview_btn").click(function(){
	if(tempPassMSO != undefined){
    $.ajax({
        method: "POST",
        url: "cgi-bin/freepreview.py",
        data: {"PUBLIC_KEY" : PUBKEY, "PRIV_KEY": PRIVKEY, "REQID": REQUESTOR, "DEVID": deviceId, "UA": url_hdr, "RESIDF": RESOURCE, "domain": domain, "SP_FQDN": sp_fqdn, "TEMPPASS_MVPD": tempPassMSO},
        dataType: "text",
    success: function(result){
        feedbackText = '\n<strong>'+tms+':</strong> '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
        feedbackConsole.val(feedbackConsole.val() + feedbackText);
    }
    }); 
	} else {
        feedbackText = '\n<strong>'+tms+':</strong> Error Obtaining FreePreview -TempPass Provider ID is blank';
        feedbackConsole.val(feedbackConsole.val() + feedbackText);
	}
    });

    $("#logout_btn").click(function(){
        $.ajax({
            method: "POST",
            url: "cgi-bin/logout.py",
            data: {"PUBLIC_KEY" : PUBKEY, "PRIV_KEY": PRIVKEY, "REQID": REQUESTOR, "DEVID": deviceId, "UA": url_hdr, "RESID": RESOURCE, "SP_FQDN": sp_fqdn},
            dataType: "text",
            success: function(result){
                var dt2 = new Date();
                tms = dt2.toLocaleString();
                feedbackText = '\n<strong>'+tms+':</strong> '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
                feedbackConsole.val(feedbackConsole.val() + feedbackText);
            }
        
        }); 
    });
});

function paramSet() {
    envSet();
    deviceInfo();
    REQUESTOR = document.getElementById('REQID').value;
    if(REQUESTOR){
        document.getElementById('reg_btn').style.display = 'inline-block';
    } else {
        let y = document.getElementById('unauthe');
        y.style.display = 'block';
        y.innerHTML = 'Missing Requestor ID!';
        setTimeout(function() {y.style.display = 'none';}, 3000)
    }
}

function authorize() {
    envSet();
    deviceInfo();
    var r2 = document.getElementById('RESID').value;
    if (r2 != "") {
        RESOURCE =r2;
    } else {
        RESOURCE = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>';
    }
    REQUESTOR = document.getElementById('REQIDZ').value; //REQIDZ - from AUTHZ Pane
}

function tempPass() {
    envSet();
    deviceInfo();
    var r3 = document.getElementById('RESIDF').value;
    if (r3 != "") {
        RESOURCE =r3;
    } else {
        RESOURCE = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>';
    }
    REQUESTOR = document.getElementById('REQIDTP').value;
    var domain_ = document.getElementById('domain').value;
    if (domain_ != "") {
        domain = domain_;
    } else {
        domain = "adobe.com";
    }
	var tempPass_ = document.getElementById('TMPPASS_MVPD').value;
	if (tempPass_ != "") {
        tempPassMSO = tempPass_;
    } else {
        alert('Please Enter TempPass MVPD');
    }
}

function logout() {
    envSet();
    deviceInfo();
    RESOURCE = document.getElementById('RESIDLO').value;
    REQUESTOR = document.getElementById('REQIDLO').value;
}

function envSet(){
    var env_status2 = document.getElementById('stageProdEnvSet').innerText;
    console.log('[backend.js]:'+env_status2);
    if (env_status2 === "true") {
        reggie_fqdn = 'http://api.auth.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth.adobe.com/api/v1/";
        sp_url = "https://sp.auth.adobe.com/";
        document.getElementById('env').innerHTML = 'PROD';
        updateConsoleLogs("[Smart Device Is On PRODUCTION]" );
    } else if (env_status2 === "false"){
        reggie_fqdn = 'http://api.auth-staging.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth-staging.adobe.com/api/v1/";
        sp_url = "https://sp.auth-staging.adobe.com/";
        document.getElementById('env').innerHTML = 'STAGE';
        updateConsoleLogs("[Smart Device Is On STAGE]" );
    }
}

$(document).ready(function () {
    if(localStorage['DeviceId'] == undefined) localStorage['DeviceId'] = "sampleDeviceID";
    if(localStorage['UserAgent'] == undefined) localStorage['UserAgent'] = "Roku/DVP";
    document.getElementById('Device-Id').value = localStorage['DeviceId'];
    document.getElementById('User-Agent').value = localStorage['UserAgent'];
    document.getElementById('PUBLIC_KEY').value = localStorage['_consumer'];
    document.getElementById('PRIV_KEY').value = localStorage['_secret'];
    
});

function deviceInfo(){
    let di = document.getElementById('Device-Id').value;
    if (di != "") {
        deviceId = di;
        localStorage['DeviceId'] = deviceId;
    } else {
        updateConsoleLogs("Please enter a deviceId before proceeding");
    }
    let ua = document.getElementById('User-Agent').value;
    if (ua != "") {
        url_hdr = ua;
        localStorage['UserAgent'] = url_hdr;
    }

    let pbk = document.getElementById('PUBLIC_KEY').value;
    if (pbk != "" && pbk !== undefined && pbk != "undefined") {
        PUBKEY = pbk;
        localStorage['_consumer'] = PUBKEY;
    } else {
        updateConsoleLogs("Please enter the public key");
    }
    let prk = document.getElementById('PRIV_KEY').value;
    if (prk != "" && prk !== undefined && prk != "undefined") {
        PRIVKEY = prk;
        localStorage['_secret'] = PRIVKEY;
    } else {
        updateConsoleLogs("Please enter the private key");
    }
}

$("#entitlement_lock").on('click', function(){
    $('#thumbnail').css('display', 'none');
})