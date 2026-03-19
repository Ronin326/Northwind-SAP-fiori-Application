sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project2/model/formatter"
], (Controller, formatter) => {
    "use strict";

    return Controller.extend("project2.controller.MainView", {
        formatter: formatter,
        onInit() {
        },

        onNavToSecond: function(oEvent) {
            // get the clicked row
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();

            // get the nav container and detail page
            var oNav = this.byId("navCont");
            var oDetailPage = this.byId("page2");

            // bind the detail page to the selected order
            oDetailPage.bindElement(oContext.getPath());

            // navigate to the detail page
            oNav.to(oDetailPage);
        },

        onNavBack: function() {
            var oNav = this.byId("navCont");
            oNav.back();
        },

        onOrderDetailsFinished: function(oEvent) {
            var oTable = oEvent.getSource();
            var aItems = oTable.getItems();
            var subtotal = 0;
            var discount = 0;
            var total = 0;

            aItems.forEach(function(oItem) {
                var data = oItem.getBindingContext().getObject();
                subtotal += data.UnitPrice * data.Quantity;
                discount += data.UnitPrice * data.Quantity * data.Discount;
                total += data.UnitPrice * data.Quantity * (1 - data.Discount);
            });

            // get the i18n bundle
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            // use bundle.getText("key") to get translated strings
            this.byId("orderSubTotalTitle").setText(
                oBundle.getText("orderSubtotal") + ": R " + subtotal.toFixed(2)
            );
            this.byId("orderDiscountTitle").setText(
                oBundle.getText("orderDiscount") + ": R " + discount.toFixed(2)
            );
            this.byId("orderTotalTitle").setText(
                oBundle.getText("orderTotal") + ": R " + total.toFixed(2)
            );
        },

        onSearch: function(oEvent) {
            console.log("Searching...");

            // detect source: Input vs MultiComboBox
            var sQuery = "";
            if (oEvent.getSource().isA("sap.m.Input")) {
                sQuery = oEvent.getParameter("newValue") || "";
            } else {
                // filter change → reuse current search input value
                sQuery = this.byId("searchInput").getValue() || "";
            }
            sQuery = sQuery.toLowerCase();

            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");

            // get selected filter fields
            var aSelectedKeys = this.byId("filterCombo").getSelectedKeys();

            if (!sQuery) {
                // clear filters and show all rows
                oBinding.filter([]);
                oTable.getItems().forEach(function(oItem) { oItem.setVisible(true); });
                return;
            }

            if (aSelectedKeys.length === 0) {
                // default: search across common fields
                aSelectedKeys = [
                    "OrderID",
                    "Customer/ContactName",
                    "Order_Details/Product/ProductName",
                    "OrderDate",
                    "RequiredDate"
                ];
            }

            var aServerFilters = [];

            aSelectedKeys.forEach(function(sKey) {
                if (["OrderID", "Order_Details/Product/ProductID", "OrderDate", "RequiredDate", "ShippedDate"].includes(sKey)) {
                    oTable.getItems().forEach(function(oItem) {
                        var data = oItem.getBindingContext().getObject();
                        var val = data[sKey] || "";
                        var strVal = val.toString().toLowerCase();

                        oItem.setVisible(strVal.indexOf(sQuery) !== -1);
                    });
                } else {
                    aServerFilters.push(new sap.ui.model.Filter(sKey, sap.ui.model.FilterOperator.Contains, sQuery));
                }
            });

            var oFinalFilter = aServerFilters.length > 0
                ? new sap.ui.model.Filter({ filters: aServerFilters, and: false })
                : [];

            oBinding.filter(oFinalFilter);
        },

        onRefresh: function() {
            this.byId("searchInput").setValue("");
            this.byId("filterCombo").setSelectedKeys([]);
            var oTable = this.byId("ordersTable");
            oTable.getBinding("items").filter([]); // clear filters
        },

        onLanguageChange: function(oEvent) {
            // safer: get selectedKey directly
            var sLang = oEvent.getParameter("selectedItem")
                ? oEvent.getParameter("selectedItem").getKey()
                : oEvent.getSource().getSelectedKey();  // fallback

            // Map to locale codes
            var sLocale = (sLang === "French") ? "fr" : "en";

            // Create new resource model with locale
            var oResourceModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "project2.i18n.i18n",
                bundleLocale: sLocale
            });

            this.getView().setModel(oResourceModel, "i18n");
        }

    });
});