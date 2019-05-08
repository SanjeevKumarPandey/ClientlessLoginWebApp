/************************************************************************************************

 * download.js
 * Project HULK
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/

try {
    var textFile = null,
                      makeTextFile = function (text) {
                    var data = new Blob([text], {type: 'text/plain'});

                    /*Manually revoke the object-URL to avoid memory leaks while previous file is replaced*/
                    if (textFile !== null) {
                      window.URL.revokeObjectURL(textFile);
                    }

                    textFile = window.URL.createObjectURL(data);

                    /* This returned url is being used as a href*/
                    return textFile;
                      };

                    var create = document.getElementById('create'),
                    textbox = document.getElementById('textbox');

                      create.addEventListener('click', function () {
                    var link = document.createElement('a');
                    link.setAttribute('download', 'xmlData.txt');
                    link.href = makeTextFile(textbox.textContent);
                    document.body.appendChild(link);

                    /* wait for the link to be added to the document*/
                    window.requestAnimationFrame(function () {
                      var event = new MouseEvent('click');
                      link.dispatchEvent(event);
                      document.body.removeChild(link);
                    });

                      }, false);

    } catch (ex) {
                    console.error(ex);
    }