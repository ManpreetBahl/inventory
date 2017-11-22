function check() {
    if( (jQuery("#checkinTable > tbody").children("tr").length) <= 0) {
        jQuery("#checkin").hide();
        jQuery("#checkinButton").prop('disabled', true);
        jQuery("#remove").prop('disabled', true);
    }
    else{
        jQuery("#checkin").show();
        jQuery("#checkinButton").prop('disabled', false);
        jQuery("#remove").prop('disabled', false);
    }
}

//Code was obtained from https://stackoverflow.com/questions/3458571/jquery-click-event-on-tr-elements-with-in-a-table-and-getting-td-element-v
$(document).ready(function(){
    jQuery("#checkin").hide();

    $("#inventoryTable > tbody > tr").on("click", ".clickable-row", function(event){        
        var id = $(this).attr("id"); //This line was found at https://stackoverflow.com/questions/1618209/jquery-how-to-get-the-value-of-id-attribute
        var itemName = $(this).find("#name > .tablesaw-cell-content").text().trim();
        var desc = $(this).find("#desc > .tablesaw-cell-content").text().trim();
        var quantity = $(this).find("#quantity > .tablesaw-cell-content").text().trim();

        var inTable = false;
        jQuery("#checkinTable tbody").find("tr").each(function(){
            var itemID = jQuery(this).attr("itemID");
            if(itemID === id){
                inTable = true;
                jQuery(this).find("#quantityWanted")[0].value = (parseInt(jQuery(this).find("#quantityWanted")[0].value,10) + 1).toString();
                return;
            }
        });

        if(inTable === false){
            jQuery('#checkinTable tbody').append("<tr id=\"" + id + "\"><td><input type=\"checkbox\" id=\"checkbox\"></input></td><td>" + itemName + "</td><td>" + desc + "</td><td><input type=\"number\" id=\"quantityWanted\" value=\"1\" min=\"1\" max=\"" + quantity + "\"/></td></tr>"); 
        }
        check();
    });

    $("#checkinButton").on("click", function(event){
        //Get table data and convert it into JSON
        //Code below was taken from http://johndyer.name/html-table-to-json/ and modified to meet the needs
        var table = $("#checkinTable")[0].rows;
        //console.log(table);
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

        jQuery.ajax({
            type: "POST",
            url: "/checkin",
            contentType: "application/json",
            data: JSON.stringify(cart),
            success: function(){
                alert("Successfully checked in items!");
                location.reload(true);
            },
            error: function(err){
                alert("Unable to checkin!\n" + "Status: " + err.status + "\nError Message: " + err.statusText);
            }
        });        
    });

    $("#remove").on("click", function(event){
        $("#checkinTable tbody").find("tr").each(function(){
            if( $(this).find('#checkbox').is(":checked")){
                $(this).remove();
            }
        });
        check();
    });
});