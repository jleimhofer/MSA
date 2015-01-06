jQuery.sap.require("STSA.util.Formatter");
jQuery.sap.require("STSA.util.Controller");

STSA.util.Controller.extend("STSA.view.Detail", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if(sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},

	onMasterLoaded :  function (sChannel, sEvent, oData) {
		if(oData.oListItem){
			this.bindView(oData.oListItem.getBindingContext().getPath());
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
		}
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function () {

			// when detail navigation occurs, update the binding context
			if (oParameters.name !== "detail") { 
				return;
			}

			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

		}, this));
	},

	bindView : function (sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if(!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified actually was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},

	showEmptyView : function () {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "STSA.view.NotFound",
			targetViewType : "XML"
		});
	},

	fireDetailChanged : function (sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", { sEntityPath : sEntityPath });
		
		// show status buttons according to current status
        var bindingContext = this.getView().getBindingContext();
		var status = bindingContext.getProperty("Status");
		var startProgressVisible = true;
		var resolveVisible = true;
		if(status === "IN PROGRESS")
		{
		    startProgressVisible = false;
		}
		else if(status === "RESOLVED")
		{
		    startProgressVisible = false;
		    resolveVisible = false;
	        this.getView().byId("resolved").setVisible(true);
	        this.getView().byId("created").setVisible(false);
		}

		this.getView().byId("startProgress").setVisible(startProgressVisible);
		this.getView().byId("resolve").setVisible(resolveVisible);
		
		var ticketId = this.getView().getModel().getProperty(sEntityPath + "/TicketId");
		// update list binding
		// filter comments by current ticket
		this.getView().byId("commentList").getBinding("items").filter([new sap.ui.model.Filter("TicketId", sap.ui.model.FilterOperator.EQ, ticketId)]);
	},

	fireDetailNotFound : function () {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},
	
	onSelect : function(oEvent) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		// this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},
	
	onAddComment    : function() {
	    // fill new record
        var bindingContext = this.getView().getBindingContext();
		var ticketId = bindingContext.getProperty("TicketId");
		var mandt = bindingContext.getProperty("Mandt");
        var content = this.getView().byId("newComment").getValue();
        // don't allow empty comments
        if(content === "")
        {
            sap.ui.commons.MessageBox.alert("Please speficy a comment content!");
            return;
        }

	    var oEntry = {};
        oEntry.CommentId = 0;
        oEntry.Content = content;
        oEntry.TicketId = ticketId;
        oEntry.Deleted = 0;
        oEntry.Mandt = mandt;

        // create new record        
        var oModel = this.getView().getModel();
        jQuery.sap.require("sap.ui.commons.MessageBox");
        oModel.create("/CommentSet", oEntry, null, function(){
            sap.ui.commons.MessageBox.alert("Comment successfully created!");
        },function(){
            sap.ui.commons.MessageBox.alert("Error occured!");
        });
        
        this.getView().byId("newComment").setValue("");
        this.getView().byId("newComment").setPlaceholder("New Comment ...");
	},
	
	onStartProgress:function() {
	    // fill new record
        var bindingContext = this.getView().getBindingContext();
		var ticketId = bindingContext.getProperty("TicketId");
        var mandt = bindingContext.getProperty("Mandt");
        var machineId = bindingContext.getProperty("MachineId");
        var technicianId = bindingContext.getProperty("TechnicianId");
        var status = "IN PROGRESS";
        var createDate = bindingContext.getProperty("CreateDate");
        var resolveDate = bindingContext.getProperty("ResolveDate");
        var description = bindingContext.getProperty("Description");
        var priority = bindingContext.getProperty("Priority");
        var deleted = bindingContext.getProperty("Deleted");

	    var oEntry = {};
        oEntry.TicketId = ticketId;
        oEntry.Mandt = mandt;
        oEntry.MachineId = machineId;
        oEntry.TechnicianId = technicianId;
        oEntry.Status = status;
        oEntry.CreateDate = createDate;
        oEntry.ResolveDate = resolveDate;
        oEntry.Description = description;
        oEntry.Priority = priority;
        oEntry.Deleted = deleted;

        // create new record        
        var oModel = this.getView().getModel();
        jQuery.sap.require("sap.ui.commons.MessageBox");
        oModel.update("/TroubleTicketSet(" + ticketId + ")", oEntry, null, function(){
            sap.ui.commons.MessageBox.alert("Ticket successfully updated!");
        },function(){
            sap.ui.commons.MessageBox.alert("Error occured!");
            return;
        });
        oModel.refresh();
        this.getView().byId("startProgress").setVisible(false);
	},
	
	onResolve:function() {
	    // fill new record
        var bindingContext = this.getView().getBindingContext();
		var ticketId = bindingContext.getProperty("TicketId");
        var mandt = bindingContext.getProperty("Mandt");
        var machineId = bindingContext.getProperty("MachineId");
        var technicianId = bindingContext.getProperty("TechnicianId");
        var status = "RESOLVED";
        var createDate = bindingContext.getProperty("CreateDate");
        var resolveDate = new Date();
        var description = bindingContext.getProperty("Description");
        var priority = bindingContext.getProperty("Priority");
        var deleted = bindingContext.getProperty("Deleted");

	    var oEntry = {};
        oEntry.TicketId = ticketId;
        oEntry.Mandt = mandt;
        oEntry.MachineId = machineId;
        oEntry.TechnicianId = technicianId;
        oEntry.Status = status;
        oEntry.CreateDate = createDate;
        oEntry.ResolveDate = resolveDate;
        oEntry.Description = description;
        oEntry.Priority = priority;
        oEntry.Deleted = deleted;

        // create new record        
        var oModel = this.getView().getModel();
        jQuery.sap.require("sap.ui.commons.MessageBox");
        oModel.update("/TroubleTicketSet(" + ticketId + ")", oEntry, null, function(){
            sap.ui.commons.MessageBox.alert("Ticket successfully updated!");
        },function(){
            sap.ui.commons.MessageBox.alert("Error occured!");
            return;
        });
        oModel.refresh();
	    this.getView().byId("startProgress").setVisible(false);
	    this.getView().byId("resolve").setVisible(false);
	    this.getView().byId("resolved").setVisible(true);
	    this.getView().byId("resolved").setText("Resolved: " + resolveDate.toString());   
	},
	
	onDisplayCustomer:function(){
        var bindingContext = this.getView().getBindingContext();
		var location = bindingContext.getProperty("Location");
		var customer = bindingContext.getProperty("Title");
 		sap.ui.getCore().AppContext.CurrentLocation = location;
	    
		var locationView = sap.ui.view({
			type:sap.ui.core.mvc.ViewType.XML, 
			viewName:"STSA.view.Location"
		});
		locationView.setModel(this.getView().getModel());

		var oBtnClose = new sap.ui.commons.Button({
			text : "Close",
			press : function() {
				oDialog.close();
			}
		});

		var oDialog = new sap.m.Dialog({
			modal : true,
			buttons : [ oBtnClose ],
			content : [ locationView ]
		});
		oDialog.setTitle(customer);
		

		oDialog.setContentWidth("100%");
        oDialog.setContentHeight("100%");
		oDialog.open();
	},
    	
	onDisplayMachine:function(){
		//The Template to use in the Dialog
		var itemTemplate = new sap.m.StandardListItem({
			title: "{Name}",
			description: "{Content}",
			active: true
	    });

        // only create dialog once
		if(!sap.ui.getCore().AppContext.ManualDialog)
		{
    		var oSelectDialog = new sap.m.SelectDialog("Manuals", {
    			 title: "Manuals",
    			 noDataText: "No Manuals Found"
    		});
     
    		//Now set the model for Dialog and bind the Aggregration.
    		// filter manuals by current ticket machine type
            var bindingContext = this.getView().getBindingContext();
    		var typeId = bindingContext.getProperty("TypeId");
    		oSelectDialog.setModel(this.getView().getModel());
    		oSelectDialog.bindAggregation("items", "/ManualSet", itemTemplate);				
            oSelectDialog.getBinding("items").filter([new sap.ui.model.Filter("TypeId", sap.ui.model.FilterOperator.EQ, typeId)]);
            oSelectDialog.attachConfirm(function(oEvent) {
                
                var manualLink = oEvent.getParameters().selectedItem.getDescription();
                //Create Place holder for the iFrame using a HTML Object
                var oHTML = new sap.ui.core.HTML();
                //Set the iFrame up to display the manuals
                var oContent = '<iframe id="iframeContentPanel" ' + 'src="' + manualLink.toLowerCase() + '" width="100%" height="100%"></iframe>';
                oHTML.setContent(oContent);
                var oDialog = new sap.ui.commons.Dialog();
                oDialog.addContent(oHTML);
                oDialog.addButton(new sap.ui.commons.Button({text: "Close", press:function(){oDialog.close();}}));
                oDialog.setHeight("100%");
                oDialog.setWidth("100%");
                oDialog.open();
            });
            oSelectDialog.attachLiveChange(function(oEvent) {
                var filterPattern = oEvent.getParameters().value.toLowerCase(), oBinding = oEvent.getParameters().itemsBinding; 
                // TODO implement filtering after manualset filters are active
                // oBinding.filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, filterPattern)]);
            });
            // save dialog globally
            sap.ui.getCore().AppContext.ManualDialog = oSelectDialog;
		}
		var oDialog = sap.ui.getCore().AppContext.ManualDialog;
		oDialog.open();
	}
});
