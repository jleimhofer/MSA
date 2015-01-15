jQuery.sap.require("STSA.util.Formatter");
jQuery.sap.require("STSA.util.Controller");

STSA.util.Controller.extend("STSA.view.Login",  {  
    actLogin: function () {  
        var oEntry = {};
        oEntry.Username = this.byId("inpLogin").getValue();
        oEntry.Password = CryptoJS.SHA1(this.byId("inpPWD").getValue().toUpperCase()).toString();
        // type 1 for technician login
        oEntry.Type = 1;
        oEntry.Valid = 0;
        oEntry.Id = 0;

        // use odata created method for authentication
        var oModel = this.getView().getModel();
        jQuery.sap.require("sap.ui.commons.MessageBox");
        oModel.create("/CredentialSet", oEntry, null, function(success){  
            var valid = success.Valid;
            if(valid)
            {
                sap.ui.getCore().AppContext.ValidUser = valid;
                sap.ui.getCore().AppContext.TechnicianId = success.Id;
                sap.ui.getCore().AppContext.LoginDialog.close();
            }
            else
            {
                sap.ui.commons.MessageBox.alert("Login failed!");
            }
        },  
        function(error){  
            sap.ui.commons.MessageBox.alert("Login failed! Check your credentials.");
        });  
    }
});  