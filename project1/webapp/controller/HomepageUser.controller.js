sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, MessageBox, Fragment) => {
    "use strict";

    return Controller.extend("project1.controller.homepageUser", {
        onInit() {
            console.log("onInit çalıştı");
            var oJSONData = {
                todayServices: [
                    {
                        id: 1,
                        title: "Klima Servisi",
                        customer: "Ahmet Yılmaz",
                        address: "İstanbul, Kadıköy, Moda Cd. No:23",
                        device: "Bosch Klima B500",
                        issue: "Soğutmuyor",
                        diagnosis: "Kompresör arızası"
                    },
                    {
                        id: 2,
                        title: "Klima Servisi",
                        customer: "Ahmet Yılmaz",
                        address: "İstanbul, Kadıköy, Moda Cd. No:23",
                        device: "Bosch Klima B500",
                        issue: "Soğutmuyor",
                        diagnosis: "Kompresör arızası"
                    }
                ],
                parts: [
        { id: 1, name: "Kompresör - Klima Bosch 2022", stock: 5 },
        { id: 2, name: "Fan Motoru - Bosch Klima", stock: 3 }
    ]
            };

            var oViewModel = new JSONModel(oJSONData);
            this.getView().setModel(oViewModel, "ViewModel");
        },

        onServicePress(oEvent) {
    var oSelectedItem = oEvent.getParameter("listItem");
    var oContext = oSelectedItem.getBindingContext("ViewModel");
    var oData = oContext.getObject();

    this._oSelectedService = oData;

    // Seçilen servisi ViewModel'e ekle
    var oViewModel = this.getView().getModel("ViewModel");
    oViewModel.setProperty("/selectedService", oData);

    if (!this._oDialog) {
        Fragment.load({
            name: "project1.view.fragment.ServiceDetailsDialog",
            controller: this
        }).then(function (oDialog) {
            this._oDialog = oDialog;
            this.getView().addDependent(this._oDialog);
            this._oDialog.open();
        }.bind(this));
    } else {
        this._oDialog.open();
    }
},


        onCompleteService() {
            MessageBox.confirm("Bu servisi tamamlandı olarak işaretlemek istiyor musunuz?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        var oViewModel = this.getView().getModel("ViewModel");
                        var aServices = oViewModel.getProperty("/todayServices");

                        var iIndex = aServices.findIndex(s => s.id === this._oSelectedService.id);
                        if (iIndex !== -1) {
                            aServices.splice(iIndex, 1);
                            oViewModel.setProperty("/todayServices", aServices);
                        }

                        MessageBox.success("Servis tamamlandı ve listeden silindi.");
                        this.onCloseDialog();
                    }
                }.bind(this) 
            });
        },

        onCloseDialog() {
            if (this._oDialog) {
                this._oDialog.close();
            }
        },
        
    });
});
