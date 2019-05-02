/************************************************************************************************

 * settings.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
  
    function toggleTheme(t) {
    if (t.is(':checked')) {
      $("#theme").html('DefaultUI');
    $('link[rel=stylesheet][href~="./Asset_files/css/debug.css"]').remove();
    for(i=1; i < 17; i++){
        var th = '#t'+i;
        $(th).css('background-color', 'transparent');
    }
    $('body').css('background-color', 'none');
    $(".App-logo").attr('src', './Asset_files/img/active/pt.svg');
    } else {
    $("#theme").html('DebugUI');
    $('.App-header').css('color', '#222');
    $("#t1").css('background-color', 'peru');
    $("#t2").css('background-color', 'yellowgreen');
    $("#t3").css('background-color', 'navajowhite');
    $("#t4").css('background-color', 'lightcoral');
    $("#t5").css('background-color', 'lightsalmon');
    $("#t6").css('background-color', 'gold');
    $("#t7").css('background-color', 'orchid');
    $("#t8").css('background-color', 'mediumaquamarine');
    $("#t9").css('background-color', 'mediumvioletred');
    $("#t10").css('background-color', 'red');
    $("#t11").css('background-color', 'orangered');
    $("#t12").css('background-color', 'orange');
    $("#t13").css('background-color', 'slateblue');
    $("#t14").css('background-color', 'peachpuff');
    $("#t15").css('background-color', 'pink');
    $("#t16").css('background-color', 'sandybrown');
    $('head').append('<link rel="stylesheet" type="text/css" href="./Asset_files/css/debug.css">');
    $(".App-logo").attr('src', './Asset_files/img/active/bug.svg');
    /*$(".App-logo").css("animation", "none");*/
    }
    }
    
    function toggleKeyShow(t){
    if(t.is(':checked')){
    $('.keys').css('display', 'block');
    } else {
    $('.keys').css('display', 'none');
    }
    }

    function showInstrcutions(){
      if($('.instruction').css('display') == "block"){
        $('.instruction').css('display', 'none');
      } else {
        $('.instruction').css('display', 'block');
      }
    }
    
    // function testing(str){
    //   if (str!=undefined){
    //   document.getElementById('textbox').value += `${str.replace(/^\s+/, '').replace(/\s+$/, '')}`;
    //   } else (alert('You are not logged in!'))
    // }
    
    function setView(info){
      $("#call").attr('html', info.split("URL")[1].split("/")[0]);
      $("reponse-header").attr("html", info.split("header")[1].split("header-end")[0]);
    
    
    }