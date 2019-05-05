function automation(){
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('enctype', 'multipart/form-data');
    form.setAttribute('id', 'formAutomation');
    // form.setAttribute('download', 'xmlData.txt');
    // form.href = makeTextFile(textbox.value);
    document.body.appendChild(form);
    var input = document.createElement('input');
    input.setAttribute('id', 'jsonfile');
    input.setAttribute('type', 'file');
    input.setAttribute('value', 'i');
    document.getElementById('formAutomation').appendChild(input);

    var btn = document.createElement('button');
    btn.setAttribute('id', 'submitbtn');
    btn.setAttribute('type', 'button');
    btn.setAttribute('innerHTML', 'Upload JSON');
    document.body.appendChild(btn);

    displayForm();
}

function displayForm(){
    $('#formAutomation').css('display', 'block');
}

$(document).ready(function(){
    $("#submitbtn").click(function(){
        var myfile = $("#jsonfile")[0].files[0];
        var json = Papa.parse(myfile, 
            {
            header: true, 
            skipEmptyLines: true,
            complete: function(results) {
                var _data = JSON.stringify(results.data); //<-- Result is obtained here
                console.log(_data);
      //Now, write your own custom code to get the data in desired JSON Format
      //DEFAULT -
      //console.log("Dataframe:", JSON.stringify(results.data)); 
      //console.log("Column names:", results.meta.fields);
      //console.log("Errors:", results.errors);

                try {
                //var obj = JSON.parse(_data); // parsing string into JSON 

      //CUSTOMIZED - 
                /*var _LDAP, i, j, res, f, email;	
                for(i=0; i<obj.length; i++){
                 f = JSON.stringify(obj[i]);
                 j = obj[i].LDAP;
                 h = JSON.stringify(j);
                 email = h+':'+f;
                 document.getElementById('textbox').innerHTML += email+',';
                }*/
      move();
      document.getElementById('textbox').innerHTML += _data;
                var textFile = null,
                  makeTextFile = function (text) {
                var data = new Blob([text], {type: 'text/plain'});

                // while replacing a previously generated file, manually revoking the object-URL to avoid memory leaks.
                if (textFile !== null) {
                  window.URL.revokeObjectURL(textFile);
                }

                textFile = window.URL.createObjectURL(data);

                // returns a URL to be used as a href
                return textFile;
                  };

                var create = document.getElementById('create'),
                textbox = document.getElementById('textbox');

                  create.addEventListener('click', function () {
                var link = document.createElement('a');
                link.setAttribute('download', 'jsonData.json');
                link.href = makeTextFile(textbox.value);
                document.body.appendChild(link);

                // wait for the link to be added to the document
                window.requestAnimationFrame(function () {
                  var event = new MouseEvent('click');
                  link.dispatchEvent(event);
                  document.body.removeChild(link);
                });

                  }, false);

                } catch (ex) {
                console.error(ex);
                }
            }
            
        });
        
    });
    
});


var app= {

inialize: "Initialized",

clientInfo: navigator.userAgent,

database: "DB currently null: As of "+Date(),

config:{
  version: 1.0,
  AppName: "PapaLoader",
  License: "Restricted"

}
//Kaitlan Collins - White House Corrspondent
};

var t = setTimeout(function(){
console.log(app.config.AppName+" "+app.config.version+" "+app.inialize);
console.log(app.clientInfo);
}, 3000);

function move() {
    var elem = document.getElementById("myBar");   
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }
    }