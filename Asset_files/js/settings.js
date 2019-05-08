/************************************************************************************************

 * settings.js
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 5/3/19.
 
 ************************************************************************************************/
  
var _floatMenu = "#floatMenu";
var menuYloc = null; 
var __globalData__;
$(document).ready(function(){
   menuYloc = parseInt($(_floatMenu).css("top").substring(0,$(_floatMenu).css("top").indexOf("px")))
   $(window).scroll(function () { 
   let offset = menuYloc+$(document).scrollTop()+"px";
   $(_floatMenu).animate({top:offset},{duration:500,queue:false});
   });

   //appDataObject

  __globalData__ = {
    requestor : "",
    resource : "",
    deviceData: {
    deviceId: "",
    user_agent: ""
    },
    redirectUrl: "",
    provider: "",
    domain: "adobe.com"
    }
});   
 
 function toggleTheme(t) {
    if (t.is(':checked')) {
      $("#theme").html('DefaultUI');
      automation();
    //$('link[rel=stylesheet][href~="./Asset_files/css/debug.css"]').remove();
    // for(i=1; i < 17; i++){
    //     var th = '#t'+i;
    //     $(th).css('background-color', 'transparent');
    // }
    // $('body').css('background-color', 'none');
    $(".App-logo").attr('src', './Asset_files/img/active/pt.svg');
    } else {
    $("#theme").html('DebugUI');
    // $('.App-header').css('color', '#222');
    // $("#t1").css('background-color', 'peru');
    // $("#t2").css('background-color', 'yellowgreen');
    // $("#t3").css('background-color', 'navajowhite');
    // $("#t4").css('background-color', 'lightcoral');
    // $("#t5").css('background-color', 'lightsalmon');
    // $("#t6").css('background-color', 'gold');
    // $("#t7").css('background-color', 'orchid');
    // $("#t8").css('background-color', 'mediumaquamarine');
    // $("#t9").css('background-color', 'mediumvioletred');
    // $("#t10").css('background-color', 'red');
    // $("#t11").css('background-color', 'orangered');
    // $("#t12").css('background-color', 'orange');
    // $("#t13").css('background-color', 'slateblue');
    // $("#t14").css('background-color', 'peachpuff');
    // $("#t15").css('background-color', 'pink');
    // $("#t16").css('background-color', 'sandybrown');
    // $('head').append('<link rel="stylesheet" type="text/css" href="./Asset_files/css/debug.css">');
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
        // $('#instruction-title').css('background-color','transparent');
        // $('#instruction-title').css('color','inherit');
      } else {
        $('.instruction').css('display', 'block');
        // $('#instruction-title').css('background-color','gray');
        // $('#instruction-title').css('color','#edf1f2');
      }
    }
    
    // function testing(str){
    //   if (str!=undefined){
    //   document.getElementById('textbox').value += `${str.replace(/^\s+/, '').replace(/\s+$/, '')}`;
    //   } else (alert('You are not logged in!'))
    // }
    
    function setView(info) {
      $("#call").attr('html', info.split("URL")[1].split("/")[0]);
      $("reponse-header").attr("html", info.split("header")[1].split("header-end")[0]);
    }

    function resetapp() {
      localStorage.clear();
      $('.dangerZone').css('display', 'block');
      $('.dangerZone').html('App Reset Complete!');
      let to = setTimeout(function() {
        $('.dangerZone').css('display', 'none');
      }, 3000)
    }

    function clearConsole() {
      if(localStorage['consoleLogs']){
        localStorage['consoleLogs'] = localStorage['consoleLogs'].slice(1, 0);
        document.getElementById('textbox').innerHTML = localStorage['consoleLogs'];
      }
      $('.dangerZone').css('display', 'block');
      $('.dangerZone').html('Console Cleared Up!');
      let to = setTimeout(function() {
        $('.dangerZone').css('display', 'none');
      }, 3000)
    }