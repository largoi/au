/*
 * Attaches a postMessage event listener to the current Window object
 */
"use strict";

if (window.addEventListener) {
    addEventListener("message", listener, false);
} else {
    attachEvent("onmessage", listener);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function listener(ev) {
/*    if (!endsWith(ev.origin, "bigpond.com")
        && !endsWith(ev.origin, "telstra.com")
        && !endsWith(ev.origin, "telstra.com.au")
        && ev.origin.indexOf("localhost")==-1)
        return;*/
    console.log("Message: " + ev.data);
    if (ev.data.indexOf("[iFrameSizer]")==0) {
        return;
    }
    var obj = JSON.parse(ev.data);
    switch(obj.type){
        case "close":
            if ($(".iframeFun").is(":visible")) {
                $('.iframeFun>a').click();
            }
            if ($(".iframeFpw").is(":visible")) {
                $('.iframeFpw>a').click();
            }
            break;
        case "newpage":
            window.location.href = obj.msg;
            break;
        case "popup":
            open(obj.msg, "_blank", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=500");
            break;
        case "tracking":
            if (s) {
                s.track('page', { pageName: obj.pageName });
            }
            break;
        default:
            break;
    }
}

function initialiseFun() {
    var element = null;
    var busid = null;
    element = $('.iframeFun iframe').get(0);
    busid = document.getElementById("businessid").value;
    if (element !== null) {
        // Get the window displayed in the iframe.
        var receiver = element.contentWindow;
        var dest = element.src;
        if (busid.length > 0) {
            receiver.postMessage('{"type":"initial", "msg" : "vars", "businessid" : "' + busid + '"}', dest);
        } else {
            receiver.postMessage('{"type":"origin", "msg" : ""}', dest);
        }
    }
}

function initialiseFpw() {
    var element = null;
    var uname = null;
    var busid = null;
    element = $('.iframeFpw iframe').get(0);
    uname = $("#username").val();
    busid = $("#businessid").val();
    if (element !== null) {
        // Get the window displayed in the iframe.
        var receiver = element.contentWindow;
        var dest = element.src;
        if ((uname.length > 0) || (busid.length > 0)) {
            receiver.postMessage('{"type":"initial", "msg" : "vars", "username" : "' + uname + '", "businessid" : "' + busid + '"}', dest);
        } else {
            receiver.postMessage('{"type":"origin", "msg" : ""}', dest);
        }
    }
}



(function($,W,D)
{
    var clCheck = {};



    $.validator.addMethod(
        "busregex",
        function(value, element) {
            if(value){
                return /^[tT][bB]\d{6}$/.test(value);
            } else{
                return true;
            }
        },
        "Please enter a valid Business ID"
    );


    clCheck.UTIL =
    {
        setupFormValidation: function() {
            //form validation rules
            function clearTooltips() {
                var unametip = $('form#cl-login').find('#unametip');
                if (unametip.is(':visible')) {
                    unametip.hide();
                }
                var busidtip = $('form#cl-login').find('#busidtip');
                if (busidtip.is(':visible')) {
                    busidtip.hide();
                }
                $('.loading-iframeFun, .loading-iframeFpw').hide();
            }
            $("#cl-login").validate({
                rules: {
                    username: "required",
                    password: "required",
                    businessid:"busregex"
                },
                messages: {
                    username: "Please enter your username",
                    password: "Please enter your password"
                },
                submitHandler: function(form) {
                    if(document.getElementById('rememberMe').checked){
                        document.cookie = "cmnusername=" + document.getElementById('username').value + "; ";
                    } else {
                        document.cookie = "cmnusername=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                    $('.cl-login-panel .btn.primary').addClass("loading").prop('disabled', true);
                    form.submit();
                },
                errorPlacement: function(error, element) {
                    $(error).insertAfter(element.parent());
                },
                invalidHandler: clearTooltips,
                highlight: function(element, errorClass, validClass) {
                    $(element.parentElement).addClass(errorClass);
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element.parentElement).removeClass(errorClass);
                },
                showErrors: function(errorMap, errorList) {
                    clearTooltips();
                    this.defaultShowErrors();
                }
            });
        }
    }

    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');

        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        if (trident > 0) {
            // IE 11 (or newer) => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        // other browser
        return false;
    }
    
    function serverReachable(url) {
        /*
         if (window.ie9!=undefined && window.ie9) {
         return ie9serverReachable(url);
         }
         */
        if (detectIE() == 8 || detectIE() == 9) {
            return true;
        }
        var reached = false;
        $.ajax({
            url: url,
            success: function () {
                reached = true;
            },
            error: function () {
                reached = false;
            },
            async: false
        });
        return reached;
    }

    function ie9serverReachable(url) {
        var reached = false;
        jQuery.support.cors = true;
        $.support.cors = true;
        $.ajax({
            type: "GET",
            url: url,
            success: function () {
                reached = true;
            },
            error: function (a,b,c,d) {
                var img = document.body.appendChild(document.createElement('img'));
                img.style.visibility='hidden';
                img.onload = function()
                {
                    reached = true;
                };
                img.onerror = function()
                {
                    reached = false;
                };
                img.src = 'https://myacct.telstra.com/forgotten/res-v12/global/img/telstra/logo-blue.png';
                var timeOut = 5*1000; //ms - waiting for max 5s to laoad
                var start = new Date().getTime();
                while(1) {
                    if(img.complete || img.naturalWidth || new Date().getTime()-start>timeOut) {
                        reached = true;
                        break;
                    }
                    setTimeout(function() {}, 500);
                }
            },
            async: false,
            crossDomain: true
        });
        return reached;
    }



    $(D).ready(function($) {
        clCheck.UTIL.setupFormValidation();;
        var fpwURL = window.fpwURL || "password/commonlogin" ;//https://id.telstra.com.au/forgotten/password/standalone
        var funURL = window.funURL || "username/popup#/recover-username-popup?goto=http://www.bigpond.com/";
        var fpwStandaloneURL = window.fpwStandaloneURL || "password/standalone";// https://id.telstra.com.au/forgotten/password/standalone;
        var funStandaloneURL = window.funStandaloneURL || "username/standalone";
        // If username stored from previous session preload with username
        var savedUsername = "";
        var cname="cmnusername=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = $.trim(ca[i]);
            if (c.indexOf(cname)!==-1){
                savedUsername=c.substring(cname.length,c.length);
                break;
            }
        }
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById("rememberMe").checked = true;
            document.getElementById('password').focus();
        } else {
            document.getElementById('username').value = "";
            document.getElementById('username').focus();
        }

        $("#submit").click(function(){
            $("#cl-login").submit();
        });

        var iFunLoadedFirstTime = false;
        $("#toggleFun").click(function (e) {
            e.preventDefault();
            if ($('html').hasClass('lte-ie8')) { // If IE8 or less redirect to standalone page
                window.location = funStandaloneURL ;
                return false;
            }
            $("#unametip").hide();
            $("#busidtip").hide();
            $("div.error").removeClass("error");
            $("label.error").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
            var element = $('.iframeFun iframe').get(0);
            $(element).load(function() {
                if (!iFunLoadedFirstTime) {
                    $('.iframeFpw').hide();
                    $('.loading-iframeFun').hide();
                    iFunLoadedFirstTime = true;
                    $('.iframeFun').slideDown(function() {
                        $('.iframeFun iframe').iFrameResize();
                    });
                }
            });
            if (!serverReachable(funURL)) {
                $('.loading-iframeFun').html("The remote server is down. Please try again later").show();
                return;
            }
            if (!iFunLoadedFirstTime) {
                element.src = funURL;
                $('.loading-iframeFun').html("Please wait ...").show();
                // Attach onLoad event to the new iFrame
                if (element.addEventListener) { // native event
                    element.addEventListener('load', initialiseFun, true);
                } else if (element.attachEvent) {  // IE - Old browsers
                    element.attachEvent('onload', initialiseFun);
                }
                return;
            }
            iframeFunHandler();
        });
        $('.iframeFun>a').click(function (e) {
            e.preventDefault();
            iframeFunHandler();
        });

        function iframeFunHandler() {
            $('.iframeFpw').hide();
            var iFun = $('.iframeFun iframe');
            if (iFun.is(":hidden")) {
                $('.iframeFun').slideDown(function() {
                    iFun.iFrameResize();
                });
            } else {
                $('.iframeFun').slideUp(function() {
                    iFun.attr('src', funURL); //reload iframe
                    iFun.iFrameResize();
                })
            }
        }

        var iFpwLoadedFirstTime = false;
        $("#toggleFpw").click(function (e) {
            e.preventDefault();
            if ($('html').hasClass('lte-ie8')) { // If IE8 or less redirect to standalone page
                window.location = fpwStandaloneURL ;
                return false;
            }
            $("#unametip").hide();
            $("#busidtip").hide();
            $("div.error").removeClass("error");
            $("label.error").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
            var element = $('.iframeFpw iframe').get(0);
            $(element).load(function() {
                if (!iFpwLoadedFirstTime) {
                    $('.iframeFun').hide();
                    $('.loading-iframeFpw').hide();
                    iFpwLoadedFirstTime = true;
                    $('.iframeFpw').slideDown(function() {
                        $('.iframeFpw iframe').iFrameResize();
                    });
                }
            });
            if (!serverReachable(fpwURL)) {
                $('.loading-iframeFpw').html("The remote server is down. Please try again later").show();
                return;
            }
            if (!iFpwLoadedFirstTime) {
                element.src = fpwURL;
                $('.loading-iframeFpw').html("Please wait ...").show();
                // Attach onLoad event to the new iFrame
                if (element.addEventListener) { // native event
                    element.addEventListener('load', initialiseFpw, true);
                } else if (element.attachEvent) {  // IE - Old browsers
                    element.attachEvent('onload', initialiseFpw);
                }
                return;
            }
            iframeFwpHandler();
        });
        $('.iframeFpw>a').click(function (e) {
            e.preventDefault();
            iframeFwpHandler();
        });

        function iframeFwpHandler() {
            $('.iframeFun').hide();
            var iFpw = $('.iframeFpw iframe');
            if (iFpw.is(":hidden")) {
                $('.iframeFpw').slideDown(function() {
                    initialiseFpw();
                    iFpw.iFrameResize();
                });
            } else {
                $('.iframeFpw').slideUp(function() {
                    iFpw.attr('src', fpwURL); //reload iframe
                    iFpw.iFrameResize();
                })
            }
        }

        $("#username").focus(function () {
            if ($('#username-error').size()==0 ||
                $('#username-error').is(':hidden')) {
                $("#unametip").show();
            }
            $("#busidtip").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
        });

        function showHideUsernameTip() {
            if ($('#username-error').size()==0 ||
                $('#username-error').is(':hidden')) {
                $("#unametip").show();
            }
            $("#busidtip").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
        }
        $("#username").bind ("focus input propertychange", disableBusID);
        $("#password").focus(function () {
            $("#unametip").hide();
            $("#busidtip").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
        });
        function showHideBusinessIDTip() {
            if ($('#businessid-error').size()==0 ||
                $('#businessid-error').is(':hidden')) {
                $("#busidtip").show();
            }
            $("#unametip").hide();
            $('.loading-iframeFun, .loading-iframeFpw').hide();
        }
        $("#businessid").on({ focus: showHideBusinessIDTip,
                              keyup: showHideBusinessIDTip
                            });
        $("#certLogin").click(function() {
            $("#cert").submit();
        });
        function disableBusID(event) {
            setTimeout(function () {
                showHideUsernameTip();
                if ($('#username').val().indexOf("@") > -1) {
                    $('#businessid').prop('disabled', true);
                } else {
                    $('#businessid').prop('disabled', false);
                }
            }, 100);

        }
        $("input").keyup(function(event){
            if (event.which === 13){
                event.preventDefault();
                $("#cl-login").submit();
            }
        });

        $(".tooltip-launch").click(function(e)
        {
            e.preventDefault();
            var thisTooltip = $(this).next(".popup")
            $(".popup").not(thisTooltip).hide();
            thisTooltip.toggle();
        });

        $('input, textarea').placeholder();
    });
})(jQuery, window, document);
