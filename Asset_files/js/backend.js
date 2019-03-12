/************************************************************************************************

 * backend.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/

var PUBKEY, PRIVKEY, RESOURCE, REQUESTOR, deviceId, url_hdr, reggie_fqdn, sp_fqdn, sp_url, domain, tempPassMSO;

$(document).ready(function(){
$('#textbox').attr('readonly', true);
var dt = new Date();
tms = dt.toLocaleString();
var feedbackConsole = $("#textbox");
var feedbackText = "";

$("#reg_btn").click(function(){
$.ajax({
  method: "POST",
  url: "cgi-bin/regcode.py",
  data: {"PUBLIC_KEY" : PUBKEY, "PRIV_KEY": PRIVKEY, "REQID": REQUESTOR, "DEVID": deviceId, "UA": url_hdr, "REG_FQDN": reggie_fqdn},
  dataType: "text",
success: function(result){
  var data__=JSON.stringify(result);
  feedbackText = '\n'+tms+': '+result.replace(/^\s+/, '').replace(/\s+$/, '');
  feedbackConsole.val(feedbackConsole.val() + feedbackText);
  //document.getElementsByTagName('fieldset').innerHTML += `<p>${tms}: ${result}</p>`;
  var d = ((data__.split('Regcode: ')[1]).split('device_info')[0]).slice(0, 7);
  $("#regcode").val($.trim(d));
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
    feedbackText = '\n'+tms+': '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
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
        feedbackText = '\n'+tms+': '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
        feedbackConsole.val(feedbackConsole.val() + feedbackText);
    }
    }); 
	} else {
        feedbackText = '\n'+tms+': Error Obtaining FreePreview -TempPass Provider ID is blank';
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
                feedbackText = '\n'+tms+': '+ result.replace(/^\s+/, '').replace(/\s+$/, '');
                feedbackConsole.val(feedbackConsole.val() + feedbackText);
            }
        
        }); 
    });
});

function paramSet() {
    envSet();
    var di = document.getElementById('Device-Id').value;
    if (di != "") {
        deviceId = di;
    } else {
        deviceId = "dummy";
    }
    var ua = document.getElementById('User-Agent').value;
    if (ua != "") {
        url_hdr = ua;
    } else {
        url_hdr = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)";
    }
    var pbk = document.getElementById('PUBLIC_KEY').value;
    if (pbk != "") {
        PUBKEY = pbk;
    } else {
        PUBKEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    }
    var prk = document.getElementById('PRIV_KEY').value;
    if (prk != "") {
        PRIVKEY = prk;
    } else {
        PRIVKEY = 'XXXXXXXXXXXXXXX';
    }
    REQUESTOR = document.getElementById('REQID').value;
    document.getElementById('reg_btn').style.display = 'inline-block';
}

function authorize() {
    envSet();
    var pbk2 = document.getElementById('PUBLIC_KEY').value;
    if (pbk2 != "") {
        PUBKEY = pbk2;
    } else {
        PUBKEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    }
    var prk2 = document.getElementById('PRIV_KEY').value;
    if (prk2 != "") {
        PRIVKEY = prk2;
    } else {
        PRIVKEY = 'XXXXXXXXXXXXXXXXXXXX';
    }
    var r2 = document.getElementById('RESID').value;
    if (r2 != "") {
        RESOURCE =r2;
    } else {
        RESOURCE = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>';
    }
    REQUESTOR = document.getElementById('REQIDZ').value; //REQIDZ - from AUTHZ Pane
    var di2 = document.getElementById('Device-Id').value;
    if (di2 != "") {
        deviceId = di2;
    } else {
        deviceId = "dummy";
    }
    var ua2 = document.getElementById('User-Agent').value;
    if (ua2 != "") {
        url_hdr = ua2;
    } else {
        url_hdr = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)";
    }
}

function tempPass() {
    envSet();
    var pbk3 = document.getElementById('PUBLIC_KEY').value;
    if (pbk3 != "") {
        PUBKEY = pbk3;
    } else {
        PUBKEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    }
    var prk3 = document.getElementById('PRIV_KEY').value;
    if (prk3 != "") {
        PRIVKEY = prk3;
    } else {
        PRIVKEY = 'XXXXXXXXXXXXX';
    }
    var r3 = document.getElementById('RESIDF').value;
    if (r3 != "") {
        RESOURCE =r3;
    } else {
        RESOURCE = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>';
    }
    REQUESTOR = document.getElementById('REQID').value; //REQID - from REGCODE Pane
    var di3 = document.getElementById('Device-Id').value;
    if (di3 != "") {
        deviceId = di3;
    } else {
        deviceId = "dummy";
    }
    var ua3 = document.getElementById('User-Agent').value;
    if (ua3 != "") {
        url_hdr = ua3;
    } else {
        url_hdr = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)";
    }
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
    var pbk_lo = document.getElementById('PUBLIC_KEY').value;
    if (pbk_lo != "") {
        PUBKEY = pbk_lo;
    } else {
        PUBKEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX';
    }
    var prk_lo = document.getElementById('PRIV_KEY').value;
    if (prk_lo != "") {
        PRIVKEY = prk_lo;
    } else {
        PRIVKEY = 'XXXXXXXXXXXX';
    }
    var r_lo = document.getElementById('RESID').value;
    if (r_lo != "") {
        RESOURCE =r_lo;
    } else {
        RESOURCE = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>';
    }
    REQUESTOR = document.getElementById('REQID').value; //REQID - from REGCODE Pane
    var di_lo = document.getElementById('Device-Id').value;
    if (di_lo != "") {
        deviceId = di_lo;
    } else {
        deviceId = "dummy";
    }
    var ua_lo = document.getElementById('User-Agent').value;
    if (ua_lo != "") {
        url_hdr = ua_lo;
    } else {
        url_hdr = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)";
    }
}

function envSet(){
    var env_status2 = document.getElementById('unauths').innerText;
    console.log('[backend.js]:'+env_status2);
    if (env_status2 === "true") {
        reggie_fqdn = 'http://api.auth.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth.adobe.com/api/v1/";
        sp_url = "https://sp.auth.adobe.com/";
        document.getElementById('env').innerHTML = 'PROD';
        console.log('SD is on PROD: '+reggie_fqdn+sp_fqdn+sp_url);
    } else if (env_status2 === "false"){
        reggie_fqdn = 'http://api.auth-staging.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth-staging.adobe.com/api/v1/";
        sp_url = "https://sp.auth-staging.adobe.com/";
        document.getElementById('env').innerHTML = 'STAGE';
        console.log('SD is on STAGE: '+reggie_fqdn+sp_fqdn+sp_url);
    }
}

$("#entitlement_lock").on('click', function(){
    $('#thumbnail').css('display', 'none');
})