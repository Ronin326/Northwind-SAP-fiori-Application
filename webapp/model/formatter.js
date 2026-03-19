sap.ui.define([], function() {
    "use strict";

    return {
        //Format OrderID Text
        formatOrderContact: function(OrderID, ContactName) {
            if (!ContactName || !OrderID) return "";

            // First 4 chars of the name
            var namePart = ContactName.substring(0, 4);

            // Convert OrderID to string
            var idStr = OrderID.toString();

            // Insert dash after the second number
            if (idStr.length > 2) {
                idStr = idStr.substring(0, 2) + "-" + idStr.substring(2);
            }

            return (namePart + idStr);
        },

        //Format SHort Form date
        formatDateShort: function(DateString) {
            if (!DateString) return "";

            //Extract Short Date form From string
            var ShortDateStr = DateString.toString().substring(4, 15)

            return ShortDateStr;
        },

        //Status of Order
        GetOrderStatus: function(RequiredDate, ShippedDate){
            var Status = "None";

            if (ShippedDate == ""){
                Status = "Processing"
            }
            else if (ShippedDate < RequiredDate){
                Status = "Shipped On Time"
            }
            else if (ShippedDate >= RequiredDate){
                Status = "Shipped Late"
            }

            return Status;
        }, 
        
        GetOrderStatusState: function(RequiredDate, ShippedDate){ 
            var status = "None"; 
            if (!ShippedDate) { 
                status = "Processing"; 
            } else if (ShippedDate < RequiredDate) { 
                status = "Shipped On Time"; 
            } else { 
                status = "Shipped Late"; 
            } 
            switch (status) { 
                case "Processing": return "Warning"; // yellow 
                case "Shipped On Time": return "Success"; // green 
                case "Shipped Late": return "Error"; // red 
                default: return "None"; 
            }
        },

        RandFormatter: function(Amount){
            var Amountstring = Amount.toString();
            return ("R " + Amountstring.slice(0, -2));
        },

        DiscountFormatter: function(Discount){
            var Output = (Discount*100).toString();
            return (Output + " %")
        },

        SubTotalFormatter: function(UnitPrice, Quantity, Discount){
            var Output = (UnitPrice * Quantity * (1-Discount)).toFixed(2)
            return ("R " + Output.toString())
        }
    };
});
