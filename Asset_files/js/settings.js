/************************************************************************************************

 * settings.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
  
    function toggleTheme(t) {
    if (t.is(':checked')) {
      $("#theme").html('DEFAULT');
    $('.App-header').css('background-color', '#6200EE');
    $('.App-header').css('color', 'white');
    $('link[rel=stylesheet][href~="./Asset_files/css/debug.css"]').remove();
    for(i=1; i < 17; i++){
        var th = '#t'+i;
        $(th).css('background-color', 'transparent');
    }
    $('body').css('background-color', 'transparent');
    $(".App-logo").attr('src', './Asset_files/img/ptlogo.png');
    } else {
    $("#theme").html('DEBUGMODE');
    $('.App-header').css('background-color', 'black');
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
    $(".App-logo").attr('src', './Asset_files/img/svg/bug.svg');
    /*$(".App-logo").css("animation", "none");*/
    }
    }
    
    function toggleKeyShow(t){
    if(t.is(':checked')){
    $('#PUBLIC_KEY').css('display', 'block');
    $('#PRIV_KEY').css('display', 'block');
    } else {
    $('#PUBLIC_KEY').css('display', 'none');
    $('#PRIV_KEY').css('display', 'none');
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