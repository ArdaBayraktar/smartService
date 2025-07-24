sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], (Controller,JSONModel,MessageBox) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            var oJSONData = {
                txt : "Welcome",
                login : [{
                    username : "admin",
                    passwd : 123
                },
            { username : "user", passwd : 456 }
        ]

                
            }

            var oView = new JSONModel(oJSONData)
            this.getView().setModel(oView,"ViewModel")
        },
        onLoginPress : function(){
            var username = this.getView().byId("username").getValue();
            var passwd = this.getView().byId("password").getValue();
            var users = this.getView().getModel("ViewModel").getProperty("/login");
                
            console.log("username:", username);
            console.log("passwd:", passwd);
            console.log("users:", users);
                
            var found = users.find(user => user.username === username && user.passwd == passwd);
                
            if (found) {
        sap.m.MessageBox.success("Giriş başarılı!");

        if (username === "admin") {
            this.getOwnerComponent().getRouter().navTo("home"); 
        } else if (username === "user") {
            this.getOwnerComponent().getRouter().navTo("homeUser"); 
        }

    } else {
        sap.m.MessageBox.error("Kullanıcı adı veya şifre hatalı.");
    }


        }
    });
});