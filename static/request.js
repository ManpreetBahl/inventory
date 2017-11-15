//Function below obtained from http://www.developerdrive.com/2013/04/turning-a-form-element-into-json-and-submiting-it-via-jquery/
function formtoJSON(array){
    var json = {};
    
    $.each(array, function() {
        json[this.name] = this.value || '';
    });
    
    return json;
}

$(document).ready(function(){
    $("#submit").click(function(event){
        var requestJSON = formtoJSON($("form").serializeArray());
        console.log(requestJSON);
        $.ajax({
            type: "POST",
            url: "/request",
            dataType: "JSON",
            data: requestJSON,
            success: function(){
                alert("Your request has been submitted successfully!");
            },
            error: function(err){
                alert("Unable to place request!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
            }
        });
    });
});