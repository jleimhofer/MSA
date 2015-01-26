jQuery.sap.declare("util.Utility");


function search(oView, newValue, listId) {
    var filterPattern = newValue.toLowerCase(), oList = oView.byId(listId), 
    listItems = oList.getItems(), i, item, visibility;

    for (i = 0; i < listItems.length; i++) {
    	item = listItems[i];
    	visibility = false;
        if (item.getTitle().toLowerCase().indexOf(filterPattern) !== -1) {
    		visibility = true;
        }
        if (item.getNumber().toLowerCase().indexOf(filterPattern) !== -1) {
    		visibility = true;
        }
        if (item.getIntro().toLowerCase().indexOf(filterPattern) !== -1) {
    		visibility = true;
        }
        if (item.getNumberUnit().toLowerCase().indexOf(filterPattern) !== -1) {
    		visibility = true;
        }
    	listItems[i].setVisible(visibility);
    }
}

function openMenuDialog(router, view) {
    
     	var menuView = sap.ui.view({
			type:sap.ui.core.mvc.ViewType.XML, 
			viewName:"MSA.view.Menu"
		});
		
		var oBtnClose = new sap.ui.commons.Button({
			text : "Close",
			press : function() {
				oMenuDialog.close();
			}
		});
		var oMenuDialog = new sap.m.Dialog({
			modal : true,
			buttons: [oBtnClose],
			content : [ menuView ],
			title: "Menu"
		});
		
		oMenuDialog.setContentWidth("100%");
        oMenuDialog.setContentHeight("100%");
        oMenuDialog.attachAfterClose(function(oEvent)  {
            if(typeof sap.ui.getCore().AppContext.NextViewDetail != 'undefined')
            {
            	router.myNavToWithoutHash({ 
        			currentView : view,
        			targetViewName : sap.ui.getCore().AppContext.NextViewDetail,
        			targetViewType : "XML"
        		});
                router.myNavToWithoutHash({ 
        			currentView : view,
        			targetViewName : sap.ui.getCore().AppContext.NextView,
        			targetViewType : "XML",
        			isMaster: true
        		});
            }
        });
        oMenuDialog.setModel(view.getModel());
        sap.ui.getCore().AppContext.MenuDialog = oMenuDialog;
 		oMenuDialog.open();
}

function openLoginDialog(router, model, view, component) {
    	
    	sap.ui.commons.Dialog.prototype.onsapescape = function(){ };  
    	var loginView = sap.ui.view({
			type:sap.ui.core.mvc.ViewType.XML, 
			viewName:"MSA.view.Login"
		});

        loginView.setModel(model);		
        
		var oLoginDialog = new sap.m.Dialog({
			modal : true,
			content : [ loginView ],
			title: "Manager"
		});
        sap.ui.getCore().AppContext.LoginDialog = oLoginDialog;
		
		oLoginDialog.setContentWidth("100%");
        oLoginDialog.setContentHeight("100%");
        oLoginDialog.attachAfterClose(function(oEvent)  {
            if(sap.ui.getCore().AppContext.ValidUser)
            {
                // start application if user is valid
    		    router.initialize();
            }
            else
            {
                // reopen dialog as long as login is not successful
                oLoginDialog.open();
            }
        });
        
		oLoginDialog.open();
}