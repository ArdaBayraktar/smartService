sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment",
], function(Controller,JSONModel,Fragment) {
  "use strict";

  return Controller.extend("project1.controller.HomepageAdmin", {
    onInit: function () {

        var oJSONData = {
            todayServices : [
                { title: "Klima Bakımı", description: "Müşteri: Ali Veli" },
                { title: "Yağ Değişimi", description: "Müşteri: Ayşe Fatma" }
            ],
            pendingOrders: [
                    { title: "Fren Balatası Değişimi", status: "Beklemede" },
                    { title: "Lastik Rotasyonu", status: "Parça Bekleniyor" }
            ],
            technicians: [
                { id: 1, name: "Emre Yılmaz", specialty: "Klima Uzmanı", status: "Boşta", calendar: [] },
                { id: 2, name: "Mehmet Can", specialty: "Motor Uzmanı", status: "Meşgul", calendar: [] }
            ]
        }


        var oView = new JSONModel(oJSONData)
        this.getView().setModel(oView,"ViewModel")
    },

    onCreateService: function () {
      const oView = this.getView();

      if (!this.pDialog) {
        this.pDialog = Fragment.load({
          id: oView.getId(),
          name: "project1.view.fragment.NewServiceDialog",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this.pDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    onCloseDialog : function(){
      this.byId("newServiceDialog").close();
    },

    onSubmitServiceRequest : function(){
    const oDialog = this.byId("newServiceDialog");

    const sDeviceType = this.byId("inputDeviceType").getValue();
    const sTechnicianKey = this.byId("selectTechnician").getSelectedKey();
    const sDateTime = this.byId("inputDateTime").getValue();

    if (!sDeviceType || !sTechnicianKey || !sDateTime) {
        MessageToast.show("Lütfen tüm alanları doldurun.");
        return;
    }

    const oModel = this.getView().getModel("ViewModel");

    const oSelectedTechnician = oModel.getProperty("/technicians").find(t => t.id == sTechnicianKey);

    const oNewOrder = {
        title: sDeviceType + " Servisi",
        status: "Beklemede",
        technician: oSelectedTechnician.name,
        datetime: sDateTime
    };


    const aOrders = oModel.getProperty("/pendingOrders");
    aOrders.push(oNewOrder);
    oModel.setProperty("/pendingOrders", aOrders);


    const technicians = oModel.getProperty("/technicians");
    technicians.forEach(t => {
        if (t.id == sTechnicianKey) {
            t.calendar.push({
                job: oNewOrder.title,
                datetime: sDateTime
            });
            t.status = "Meşgul"; 
        }
    });
    oModel.setProperty("/technicians", technicians);

    MessageToast.show("Servis talebi oluşturuldu.");
    oDialog.close();
},
onDeletePendingOrder: function(oEvent) {
    const oModel = this.getView().getModel("ViewModel");
    const aOrders = oModel.getProperty("/pendingOrders");

    const sPath = oEvent.getParameter("listItem").getBindingContext("ViewModel").getPath();
    const iIndex = parseInt(sPath.split("/").pop());

    aOrders.splice(iIndex, 1);
    oModel.setProperty("/pendingOrders", aOrders);

    MessageToast.show("İş emri silindi.");
}




  });
});