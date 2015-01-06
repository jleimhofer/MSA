jQuery.sap.declare("STSA.Component");
jQuery.sap.require("STSA.MyRouter");

sap.ui.core.UIComponent.extend("STSA.Component", {
	metadata : {
		name : "TDG Demo App",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "STSA.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name: "ZY_WS1415_T2_STSA_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZY_WS1415_T2_STSA_SRV/"
			}
		},

		routing : {
			config : {
				routerClass : STSA.MyRouter,
				viewType : "XML",
				viewPath : "STSA.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "{entity}/:tab:",
							name : "detail",
							view : "Detail"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound",
							transition : "show"
						}
					]
				}
			]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("STSA");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		//This code is only needed for testing the application when there is no local proxy available, and to have stable test data.
		var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
		// start the mock server for the domain model
		if (bIsMocked) {
			this._startMockServer(sServiceUrl);
		}

		// Create and set domain model to the component
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		this.setModel(oModel);
		
		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		
		this.setModel(oDeviceModel, "device");
		
		// global variables are going to be stored within this object
		sap.ui.getCore().AppContext = new Object();
 
		// present login view
		var loginView = sap.ui.view({
			type:sap.ui.core.mvc.ViewType.XML, 
			viewName:"STSA.view.Login"
		});
		loginView.setModel(this.getModel());
		
		var oLoginDialog = new sap.m.Dialog({
			modal : true,
			content : [ loginView ],
			title: "Technician"
		});
        sap.ui.getCore().AppContext.LoginDialog = oLoginDialog;
		
		oLoginDialog.setContentWidth("100%");
        oLoginDialog.setContentHeight("100%");
        var self = this;
        oLoginDialog.attachAfterClose(function(oEvent)  {
            if(sap.ui.getCore().AppContext.ValidUser)
            {
                // start application if user is valid
    		    self.getRouter().initialize();
            }
            else
            {
                // if user has closed login window without valid login
                self.destroy();
            }
        });
        
		oLoginDialog.open();
	},

	_startMockServer : function (sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter : iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();


		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 2000
		});
	}
});