jQuery.sap.declare("MSA.util.Controller");

sap.ui.core.mvc.Controller.extend("MSA.util.Controller", {
	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});