/*#################################################################################
JavaScript file for Request HTML Page
Manpreet Bahl
Inventory Management System
#################################################################################*/

/*#################################################################################
The function below handles the code for packaging the form data from the client 
and sending it to the server
#################################################################################*/
$(document).ready(function(){
    //When the submit button is clicked, get the form data
    $("#submit").click(function(event){
        event.preventDefault();
        //Create a JSON object 
        var requestInfo = {
            itemName: $("#itemName").val(),
            itemQuantity: $("#itemQuantity").val(),
            custName: $("#custName").val(),
            custEmail: $("#custEmail").val(),
            otherInfo: $("#otherInfo").val()
        }

        //If any of the fields except other information field is empty, alert user
        if(requestInfo.itemName === ""){ //Item Name
            alert("Please insert an item name")
        }
        else if(requestInfo.itemQuantity === ""){ //Item Quantity
            alert("Please specify a quantity")
        }
        else if(requestInfo.custName === ""){ //Customer Name
            alert("Please enter your name")
        }
        else if(requestInfo.custEmail === ""){ //Customer Email
            alert("Please enter your email")
        }
        else {
            //Send AJAX POST request to the server
            $.ajax({
                type: "POST",
                url: "/request",
                data: requestInfo,
                success: function(){
                    alert("Your request has been submitted successfully!"); //Success message
                    $("#requestForm")[0].reset(); //Reset the form 
                },
                error: function(err){
                    //Error message
                    alert("Unable to place request!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
                }
            });
        }
    });
});
//#################################################################################