$(document).ready(function(){
    $("#submit").click(function(event){
        event.preventDefault();
        var requestInfo = {
            itemName: $("#itemName").val(),
            itemQuantity: $("#itemQuantity").val(),
            custName: $("#custName").val(),
            custEmail: $("#custEmail").val(),
            otherInfo: $("#otherInfo").val()
        }

        if(requestInfo.itemName === ""){
            alert("Please insert an item name")
        }
        else if(requestInfo.itemQuantity === ""){
            alert("Please specify a quantity")
        }
        else if(requestInfo.custName === ""){
            alert("Please enter your name")
        }
        else if(requestInfo.custEmail === ""){
            alert("Please enter your email")
        }
        else {
            $.ajax({
                type: "POST",
                url: "/request",
                data: requestInfo,
                success: function(){
                    alert("Your request has been submitted successfully!");
                    $("#requestForm")[0].reset();
                },
                error: function(err){
                    alert("Unable to place request!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
                }
            });
        }
    });
});