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

        jQuery('#cartTable tbody').append("<tr><td>" + itemName + "</td><td>" + desc + "</td><td><input type=\"number\" id=\"quantityWanted\" value=\"1\" min=\"1\" max=\"" + quantity + "\"/></td></tr>"); 
    });

    $("#checkout").on("click", function(event){
        //Get table data and convert it into JSON
        //Code below was taken from http://johndyer.name/html-table-to-json/ and modified to meet the needs
        var table = $("#cartTable")[0].rows;
        var cart = []; 
        var headers = []; 
        for (var i = 0; i < table[0].cells.length; i++) {
            headers[i] = table[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,''); 
        } 
        for (var i = 1; i < table.length; i++) { 
            var tableRow = table[i]; 
            var rowData = {}; 
            for (var j = 0; j < tableRow.cells.length -1 ; j++) { 
                rowData[ headers[j] ] = tableRow.cells[j].innerHTML; 
            } 
            cart.push(rowData); 
        } 
        var quantityWanted = $("#cartTable > tbody > tr").find("#quantityWanted");
        for (var k = 0; k < quantityWanted.length; k++){
            cart[k]["checkoutquantity"] = quantityWanted[k].value;
        }

        //console.log(JSON.stringify(cart));
        jQuery.ajax({
            type: "POST",
            url: "/checkout",
            contentType: "application/json",
            data: JSON.stringify(cart),
            success: function(){
                alert("Successfully checked out items!");
            },
            error: function(err){
                alert("Unable to checkout!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
            }
        });
        
    });
});