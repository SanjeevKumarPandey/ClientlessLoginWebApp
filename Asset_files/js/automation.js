function automation(){
    displayForm();
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

function displayForm(){
    $('#formAutomation').css('display', 'block');
}

function handleFileSelect(evt) {
  var files = evt.target.files;
  var start = 0;
  var stop = parseInt(files[0].size-1);

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
    // Only process json files
if (!f.type.match('json.*')) {
  continue;
}

      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('listName').innerHTML = '<ul>' + output.join('') + '</ul>';

    var reader = new FileReader();

    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        document.getElementById('byte_content').textContent = evt.target.result;
        document.getElementById('byte_range').textContent = 
            ['Read bytes: ', start + 1, ' - ', stop + 1,
             ' of ', files.size, ' byte file'].join('');
      }
      assignValues(evt.target.result);
    };
    reader.readAsBinaryString(files[0]);
}
/*
{
  "requestor": "sample",
  "resource": "sample",
  "deviceData": {
  "deviceId": "sample",
  "user-agent": "sample"
  },
  "redirectUrl": "sample",
  "provider": "sample",
  "domain": "sample.com"
  }*/

  function assignValues(result) {
    // console.log(typeof(result));
    let __data__ = JSON.parse(result);
    //console.log(__data__.requestor, __data__.resource);
    //console.log(__data__.deviceData.deviceId, __data__.redirectUrl, __data__.provider);
    __globalData__.requestor = __data__.requestor;
    __globalData__.resource = __data__.resource;
    __globalData__.deviceData.deviceId = __data__.deviceData.deviceId;
    __globalData__.deviceData.user_agent = __data__.deviceData.user_agent;
    __globalData__.redirectUrl = __data__.redirectUrl;
    __globalData__.provider = __data__.provider;
    __globalData__.domain = __data__.domain;
    console.log(__globalData__);
  }