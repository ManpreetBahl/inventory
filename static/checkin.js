/*#################################################################################
JavaScript file for Checkin HTML Page
Manpreet Bahl
Inventory Management System
#################################################################################*/

/*#################################################################################
The function below toggles between displaying the checkin cart table or hiding it.
If there are no items in the checkin table, it hides the table. When an item is
added and the table is hidden, this function unhides it. The function also toggles
between disabling and renabling buttons based on if the check in table is being
displayed and hidden.
#################################################################################*/
function check() {
    //Hide checkin table and disable buttons if there's nothing in checkin table
    if( (jQuery("#checkinTable > tbody").children("tr").length) <= 0) {
        jQuery("#checkin").hide();
        jQuery("#checkinButton").prop('disabled', true);
        jQuery("#remove").prop('disabled', true);
    }
    else{
        //Show the checkin table and enable button
        jQuery("#checkin").show();
        jQuery("#checkinButton").prop('disabled', false);
        jQuery("#remove").prop('disabled', false);
    }
}
//#################################################################################

/*#################################################################################
# This function contains the code for the various buttons present on the HTML page
#################################################################################*/
//Code for clikc event was obtained from https://stackoverflow.com/questions/3458571/jquery-click-event-on-tr-elements-with-in-a-table-and-getting-td-element-v
$(document).ready(function(){
    jQuery("#checkin").hide();

    //When a table row is clicked in the inventory table, it is added to the checkin table.
    //If the item already exists, the checkin quantity is incremented by 1
    $("#inventoryTable > tbody > tr").on("click", ".clickable-row", function(event){        
        var id = $(this).attr("id"); //This line was found at https://stackoverflow.com/questions/1618209/jquery-how-to-get-the-value-of-id-attribute
        var itemName = $(this).find("#name > .tablesaw-cell-content").text().trim();
        var desc = $(this).find("#desc > .tablesaw-cell-content").text().trim();
        var quantity = $(this).find("#quantity > .tablesaw-cell-content").text().trim();

        //If the item exists in the checkin table, increment the quantity by 1
        var inTable = false;
        jQuery("#checkinTable tbody").find("tr").each(function(){
            var itemID = jQuery(this).attr("id");
            if(itemID === id){
                inTable = true;
                jQuery(this).find("#quantityWanted")[0].value = (parseInt(jQuery(this).find("#quantityWanted")[0].value,10) + 1).toString();
                return;
            }
        });

        //If the item does not exist, add the item to the table
        if(inTable === false){
            jQuery('#checkinTable tbody').append("<tr id=\"" + id + "\"><td><input type=\"checkbox\" id=\"checkbox\"></input></td><td>" + itemName + "</td><td>" + desc + "</td><td><input type=\"number\" id=\"quantityWanted\" value=\"1\" min=\"1\" max=\"" + quantity + "\"/></td></tr>"); 
        }
        check(); //Check to see if the checkin table should be still hidden or displayed
    });

    //When this button is clicked, it packages up the checkin table and sends a POST
    //request to the server for processing
    $("#checkinButton").on("click", function(event){
        //Get table data and convert it into JSON
        //Code below was taken from http://johndyer.name/html-table-to-json/ and modified to meet the needs
        var table = $("#checkinTable")[0].rows;
        var cart = []; 
        var headers = []; 
        for (var i = 0; i < table[0].cells.length; i++) {
            headers[i] = table[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,''); 
        } 
        headers[headers.length - 1] = 'itemID';
        for (var i = 1; i < table.length; i++) { 
            var tableRow = table[i];
            
            var rowData = {}; 
            for (var j = 1; j < tableRow.cells.length -1 ; j++) { 
                rowData[ headers[j] ] = tableRow.cells[j].innerHTML; 
            }
            rowData[headers[headers.length -1]] = tableRow.id; 
            cart.push(rowData); 
        } 
        var quantityWanted = $("#checkinTable > tbody > tr").find("#quantityWanted");
        for (var k = 0; k < quantityWanted.length; k++){
            cart[k]["checkinquantity"] = quantityWanted[k].value;
        }

        //Send AJAX POST request
        jQuery.ajax({
            type: "POST",
            url: "/checkin",
            contentType: "application/json",
            data: JSON.stringify(cart),
            success: function(){
                alert("Successfully checked in items!"); //Notify user that the transactions were successful
                location.reload(true); //Reload the page to show the updated inventory table
            },
            error: function(err){
                alert("Unable to checkin!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
            }
        });        
    });

    //When this button is clicked, it will remove all items that are checked in the 
    //checkin table. If removing an item results in a table with no rows, the table
    //is hidden due to the call to check function.
    $("#remove").on("click", function(event){
        $("#checkinTable tbody").find("tr").each(function(){
            if( $(this).find('#checkbox').is(":checked")){
                $(this).remove();
            }
        });
        check();
    });
});
//#################################################################################