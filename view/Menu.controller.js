jQuery.sap.require("MSA.util.Formatter");
jQuery.sap.require("MSA.util.Controller");

MSA.util.Controller.extend("MSA.view.Menu",  {  
	onInit : function() {
	    
	},
	
    onManageTickets:function() {
        sap.ui.getCore().AppContext.NextView = "MSA.view.Master";
        sap.ui.getCore().AppContext.NextViewDetail = "MSA.view.Detail";
        sap.ui.getCore().AppContext.MenuDialog.close();
    },
    
    onManageTechnicians:function(){
        sap.ui.getCore().AppContext.NextView = "MSA.view.TechnicianMaster";
        sap.ui.getCore().AppContext.NextViewDetail = "MSA.view.TechnicianDetail";
        sap.ui.getCore().AppContext.MenuDialog.close();
    }

});  