/************************************************************************************************

 * app.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
var uuid_filename = 'uuid.txt',
    login_page = 'mvpdLoginPage.html',
    deviceId, ts;
var reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/",
sp_fqdn = "http://api.auth.adobe.com/api/v1/",
sp_url = "https://sp.auth.adobe.com/",
url_hdr = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)";
var redirect_url = "";
var mvpdList = [];
var REQUESTOR = "", REGCODE = null, mso = 'Cablevision', picker, mvpds;
var counter = false;

function getDeviceID (){
    let di_app = document.getElementById('Device-Id').value;
    if (di_app != "") {
        deviceId = di_app;
    } else {
        deviceId = "dummy";
    }
}

function regRecord(requestor_id, regcode) {
    getDeviceID();
    if (requestor_id && regcode) {
        var http = new XMLHttpRequest();
        var url = `${reggie_fqdn}${requestor_id}/regcode/${regcode}.json`;
        updateConsoleLogs("Fetching Registration Record & Loading Config: "+url);
        var params = JSON.stringify({
            'deviceId': deviceId,
            'User-Agent': url_hdr
        });
        http.open("GET", url, true);
        http.onloadend = function() {
            if (http.readyState == 4 && http.status == 200) {
                let a = JSON.stringify(http.responseText);
                updateConsoleLogs("<span style='color: green'>"+a+"</span>");
                getMVPD(document.getElementById('requestor').value, sp_url);
            } else {
                let a = JSON.stringify(http.responseText);
                updateConsoleLogs("<span style='color: red'>"+a+"</span>");
            }
        }
        http.send(params);
    } else {
        var y = document.getElementById('unauthe');
        y.style.display = 'block';
        y.innerHTML = 'This will throw SC 404. \nEnter RequestorID and Regcode.';
        var to = setTimeout(function() {
            y.style.display = 'none';
        }, 3000)
    }
}

function getMVPD(requestor_id, sp_url) {
    var url = `${sp_url}adobe-services/config/${requestor_id}.json`;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            updateConsoleLogs(url);
            updateConsoleLogs("<span style='color: green'>"+xmlhttp.responseText+"</span>");
            try {
                var x = $.parseXML(xmlhttp.responseText);
                mvpds = $(x).find('mvpd');
                picker = $('#mvpdPicker');
                var providersMenu = $('<select id="mvpdList" multiple></select>');

                var promise = new Promise(function(resolve, reject) {
                    $.each(mvpds, function(k, v) {
                        var mvpdID = $(v).find("id").text();
                        var mvpdName = $(v).find("displayName").text();
                        providersMenu.append($('<option></option>', {
                            value: mvpdID
                        }).text(mvpdName));
                        /*mvpdList.push(mvpds[v].childNodes[0].textContent);*/
                        mvpdList.push($(v).find("id").text());
                        /*return mvpdList;*/
                        counter = true;
                    });

                    if (counter) {

                        function createPicker() {
                            picker.append(providersMenu);
                            picker.append($('<br/>'));
                            picker.append($('<input data-toggle="tooltip" data-placement="bottom" title="GET /api/v1/authenticate?reg_code={regcode}&requestor_id={requestor}&domain_name={requestor.com}&noflash=true&mso_id={provider}&redirect_url={redirectUrl}" type="button" class="login-stuff" onclick="authenticate()" value="authenticate" style="width:auto; background-color:#3700B3;" />'));
                            picker.append($('<input type="button" class="login-stuff" onclick="cancelPicker()" value="cancel" style="width:auto; background-color:tomato;" />'));
                            counter = false;
                        };

                        resolve(createPicker());

                    } else {
                        reject(Error("It broke"));
                    }
                });

                var askMe = function() {
                    promise
                        .then(function(fulfilled) {
                            /*console.log(fulfilled);*/
                        })
                        .catch(function(error) {
                            console.log(error.message);
                        });
                };

                askMe();

            } catch (ex) {
                console.log('Error');
            }

        }
    }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}

function login(_url) {

    window.location.replace(_url);
}

function authenticate() {
    mso = document.getElementById('mvpdList').value;
    REQUESTOR = document.getElementById('requestor').value;
    REGCODE = document.getElementById('regcode').value;
    var rdr_url = document.getElementById('redirectUrl').value;
    if (rdr_url != "") {
        redirect_url = rdr_url;
    } else {
        redirect_url = "http%3A%2F%2Fadobe.com%3A8080%2FClientlessSampleApp%2FRedirectComplete.html";
    }
    
    var url = `${sp_fqdn}authenticate?reg_code=${REGCODE}&requestor_id=${REQUESTOR}&domain_name=adobe.com&noflash=true&no_iframe=true&mso_id=${mso}&redirect_url=${redirect_url}`;
    login(url);
}


function checkauthn(req, regC) {
    getDeviceID();
    if (req && regC) {
        var url = `${sp_fqdn}checkauthn/${regC}.json?requestor=${req}&deviceId=${deviceId}`;
        updateConsoleLogs("Checking Authentication: "+url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onloadend = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var rt = xhr.responseText,
                    st = xhr.status;
                let feedback = `<span style="color: green">Authentication SUCCESSFUL: ${st}${rt}</span>`;
                updateConsoleLogs(feedback);
            } else if (xhr.status===403) {
                let feedback = `<span style="color: red">NOT AUTHENTICATED - ${xhr.response}</span>`;
                updateConsoleLogs(feedback);
            } else {
                updateConsoleLogs(xhr.status);
            }
        }
        //xhr.open('GET', url, true);
        xhr.send();
    } else {
        var y = document.getElementById('unauthe');
        y.style.display = 'block';
        y.innerHTML = '404! Enter RequestorID and Regcode.';
        var to = setTimeout(function() {
            y.style.display = 'none';
        }, 3000)
    }
}

function updateConsoleLogs(feedback){
    let d = new Date();
    let timestamp = d.toLocaleString();
    document.getElementById('textbox').innerHTML += `<br><strong>${timestamp}:</strong> ${feedback}`;
}

function boxDisable(t) {
    if (t.is(':checked')) {
        reggie_fqdn = 'http://api.auth.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth.adobe.com/api/v1/";
        sp_url = "https://sp.auth.adobe.com/";
        document.getElementById('env').innerHTML = 'PROD';
        document.getElementById('stageProdEnvSet').innerText = "true";
        updateConsoleLogs("[APPLICATION SET TO PRODUCTION]" );
    } else {
        reggie_fqdn = 'http://api.auth-staging.adobe.com/reggie/v1/';
        sp_fqdn = "http://api.auth-staging.adobe.com/api/v1/";
        sp_url = "https://sp.auth-staging.adobe.com/";
        document.getElementById('env').innerHTML = 'STAGE';
        document.getElementById('stageProdEnvSet').innerText = "false";
        updateConsoleLogs("[APPLICATION SET TO STAGE]" );
    }
}