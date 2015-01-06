jQuery.sap.declare("STSA.util.Controller");

sap.ui.core.mvc.Controller.extend("STSA.util.Controller", {
	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});