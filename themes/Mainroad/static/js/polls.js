/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage

//getUserIP(function(ip){
 //   alert("Got IP! :" + ip);
//});

/*
function storePollOption  (staticmanAPI) {
var text = $('#DynamicValueAssignedHere').find('input[name="FirstName"]').val();
    var selectedOption = $('input[name=poll]:checked').val();
    console.log(selectedOption);
    $('#poll').append('<input type="hidden" name="fields[option]" value="blank"/>');
    $('#poll input[name="fields[option]"]').val(selectedOption); // set value
    console.log($('#poll input[name="fields[option]"]').val());
    var jqxhr = $.post(staticmanAPI, function(result) {
      alert(result);
    })
        .done(function() {
        alert( "second success" );
    })
        .fail(function() {
        alert( "error" );
    })
        .always(function() {
        alert( "finished" );
    }); // TODO: send data as well?

    //jqxhr.always(function() {
     // alert( "second finished" );
    //});
    console.log(jqxhr);
}
*/
/*
$("#poll").submit(function( event ) {
    // set value hidden field before submitting the poll form
    alert("Submit function called!");
    var selectedOption = $('input[name=poll]:checked').val();
    console.log(selectedOption);
    $(this).append('<input type="hidden" name="fields[option]" value="blank"/>');
    //$('#poll input[name="fields[option]"]').val(selectedOption); // set value
    console.log($('#poll input[name="fields[option]"]').val());
    event.preventDefault(); // dont do the POST request

});
*/
/*
// onsubmit tag at submit: "return pollSubmit()" doesnt't work
function pollSubmit() {
   alert("Submit function called!");
    var selectedOption = $('input[name=poll]:checked').val();
    console.log(selectedOption);
    $(this).append('<input type="hidden" name="fields[option]" value="blank"/>');
    //$('#poll input[name="fields[option]"]').val(selectedOption); // set value
    console.log($('#poll input[name="fields[option]"]').val());
}
*/
 

$(document).ready(function () {

    getUserIP(function(ip){
        //alert("Got ip: " + ip);
        $('#poll').find('input[name="fields[ipAddress]"]').val(ip);
        return true;
    });
    // NB: staticman call does not work when getting the IP like this
    

    $("#poll").on("submit", function(event){
        var selectedOption = $('input[name=poll]:checked').val();
        $('#poll input[name="fields[option]"]').val(selectedOption);
        //$('#poll').find('input[name="fields[IP]"]').val(json.ip);
        //$('#poll input[name="fields[IP]"]').val(IP);
        //$('#poll input[name="fields[ipAddress]"]').val(IP);


        //alert("Submit function called!");
        return true; // do the post request
    });
});

/*
$(function() { 
    // set IP for storing poll option once page is ready
    getUserIP(function(ip){
        //alert("Got ip: " + ip);
        $('#poll').find('input[name="fields[IP]"]').val(ip);
        //self['fields[IP]'].value = ip;
        //$('#poll input[name="fields[IP]"]').val(ip);
    });
});
*/
/*
$(function() { //shorthand document.ready function
 $("#poll").on("submit", function(event){
    //alert("Submit function called!");
    var selectedOption = $('input[name=poll]:checked').val();
    console.log(selectedOption);
    $('#poll input[name="fields[option]"]').val(selectedOption);
    return true; // do the post request
 });
});
*/
