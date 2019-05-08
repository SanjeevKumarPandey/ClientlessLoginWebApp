/************************************************************************************************

 * app.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
var uuid_filename = 'uuid.txt',
    login_page = 'mvpdLoginPage.html',
    deviceId;
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
    let pickerName = 'mvpdList';

    if($("#" + pickerName).length == 0) {
        //picker doesn't exist
        if (requestor_id && regcode) {
            var http = new XMLHttpRequest();
            var url = `${reggie_fqdn}${requestor_id}/regcode/${regcode}.json`;
            updateConsoleLogs("Fetching Registration Record & Loading Config: url"+url, 2);
            var params = JSON.stringify({
                'deviceId': deviceId,
                'User-Agent': url_hdr
            });
            http.open("GET", url, true);
            http.onloadend = function() {
                if (http.readyState == 4 && http.status == 200) {
                    let a = JSON.stringify(http.responseText);
                    updateConsoleLogs(a, 1);
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
    } else {
        console.log('picker already created');
    }
}

function getMVPD(requestor_id, sp_url) {
    var url = `${sp_url}adobe-services/config/${requestor_id}.json`;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            updateConsoleLogs(url+" "+"Status: <span style='color: green'>"+xmlhttp.status+" OK</span>", 3);
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
                            picker.append($('<button class="btn-rounded login-stuff" onclick="authenticate()" value="authenticate">Authenticate</button>'));
                            picker.append($('<button class="btn-rounded login-stuff" onclick="popupOpenClose(mvpdPicker)" value="cancel" style="background-color:tomato;">Cancel</button>'));
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
    updateConsoleLogs("Redirecting To Login Url: "+_url, 2);
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
        updateConsoleLogs("Checking Authentication: url"+url, 2);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onloadend = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var rt = xhr.responseText,
                    st = xhr.status;
                updateConsoleLogs("Authentication Successful:"+ st+" "+rt, 1);
            } else if (xhr.status===403) {
                updateConsoleLogs('Not Authenticated -'+ xhr.response, 0);
            } else {
                updateConsoleLogs(xhr.status, 3);
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

function updateConsoleLogs(feedback, type){
    let d = new Date();
    let timestamp = d.toLocaleString();
    switch(type) {
        case 0:
        //failure - full red
        feedback = `<span style="color: red">${feedback}</span>`;
        break;
        case 1:
        //pass - full green
        feedback = `<span style="color: green">${feedback}</span>`;
        break;
        case 2:
        //url - normal + blue http
        feedback = `${feedback.split('url')[0]} <span style="color: #2196F3">${feedback.split('url')[1]}</span>`;
        break;
        case 3:
        //custom - as is
        feedback = feedback;
        break;
        case 4:
        //ajax failure - normal + red
        feedback = `${feedback.split(':')[0]}: <span style="color: red">${feedback.split(':')[1]}</span>`;
    }
    document.getElementById('textbox').innerHTML += `<br>&nbsp;&nbsp;<strong>${timestamp}:</strong> ${feedback}`;
    localStorage['consoleLogs'] = document.getElementById('textbox').innerHTML;
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