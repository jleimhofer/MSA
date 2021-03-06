jQuery.sap.declare("MSA.Component");
jQuery.sap.require("MSA.MyRouter");

sap.ui.core.UIComponent.extend("MSA.Component", {
	metadata : {
		name : "TDG Demo App",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "MSA.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name: "ZY_WS1415_T2_STSA_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZY_WS1415_T2_STSA_SRV/"
			}
		},

		routing : {
			config : {
				routerClass : MSA.MyRouter,
				viewType : "XML",
				viewPath : "MSA.view",
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
							pattern : "Ticket/{entity}/:tab:",
							name : "detail",
							view : "Detail"
						}
					]
				},
				{
					pattern : "",
					name : "techMain",
					view : "TechnicianMaster",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "Technician/{entity}/:tab:",
							name : "techDetail",
							view : "TechnicianDetail"
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
		var oRootPath = jQuery.sap.getModulePath("MSA");

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
 
 		jQuery.sap.require("MSA.util.Utility");
		openLoginDialog(this.getRouter(), this.getModel(), null, this);
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