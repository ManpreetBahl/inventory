//Code was obtained from https://stackoverflow.com/questions/3458571/jquery-click-event-on-tr-elements-with-in-a-table-and-getting-td-element-v
$(document).ready(function(){
    jQuery("#cart").hide();

    $("#checkoutTable > tbody > tr").on("click", ".clickable-row", function(event){
        if( $("#cartTable > tbody").children("tr").length >= 0) {
            jQuery("#cart").show();
            jQuery("#checkout").prop('disabled', false);
        }
        else{
            jQuery("#cart").hide();
            jQuery("#checkout").prop('disabled', true);
        }
       
        var itemName = $(this).find("#name > .tablesaw-cell-content").text().trim();
        var desc = $(this).find("#desc > .tablesaw-cell-content").text().trim();
        var quantity = $(this).find("#quantity > .tablesaw-cell-content").text().trim();

        jQuery('#cartTable tbody').append("<tr><td>" + itemName + "</td><td>" + desc + "</td><td id=\"quantityWanted\"><input type=\"number\" value=\"1\" min=\"1\" max=\"" + quantity + "\"/></td></tr>"); 
    });

    $("#checkout").on("click", function(event){

        /*
        jQuery.ajax({
            type: "POST",
            url: "/checkout",
            data: JSON.stringify(myRows),
            success: function(){
                alert("Your request has been submitted successfully!");
            },
            error: function(err){
                alert("Unable to place request!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
            }
        });
        */
    });
});