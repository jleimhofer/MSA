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
    },
    
    onShowReports:function(){
        var oChart = new sap.makit.Chart({
           height: "45%",
           width: "100%",
           type: "Pie",
           category: new sap.makit.Category({ column: "technicianCategory" }),
           values: [new sap.makit.Value({ expression: "assignedTickets", format: "number"})]
        });
        
        oChart.addColumn(new sap.makit.Column({name:"technicianCategory", value:"{Firstname} {Lastname}"}));         
        oChart.addColumn(new sap.makit.Column({name:"assignedTickets", value:"{NumAssigned}", type:"number"}));         
		oChart.setModel(this.getView().getModel());
		oChart.bindRows("/TechnicianViewSet");
		
		var oChart2 = new sap.makit.Chart({
           height: "45%",
           width: "100%",
           type: "Pie",
           category: new sap.makit.Category({ column: "technicianCategory" }),
           values: [new sap.makit.Value({ expression: "resolvedTickets", format: "number"})]
        });
        
        oChart2.addColumn(new sap.makit.Column({name:"technicianCategory", value:"{Firstname} {Lastname}"}));         
        oChart2.addColumn(new sap.makit.Column({name: "resolvedTickets", value:"{NumResolved}", type:"number"}));         
		oChart2.setModel(this.getView().getModel());
		oChart2.bindRows("/TechnicianViewSet");
				
		var oBtnClose = new sap.ui.commons.Button({
			text : "Close",
			press : function() {
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog({
			modal : true,
			buttons: [oBtnClose],
			content : [ new sap.m.Label({text:"Active Tickets"}), oChart, new sap.m.Label({text:"Resolved Tickets"}), oChart2],
			title: "Reports"
		});
		
		oDialog.setContentWidth("100%");
        oDialog.setContentHeight("100%");
		oDialog.open();
    }

});  