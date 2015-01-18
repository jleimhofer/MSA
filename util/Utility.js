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
		
		var oMenuDialog = new sap.m.Dialog({
			modal : true,
			content : [ menuView ],
			title: "Menu"
		});
		
		oMenuDialog.setContentWidth("100%");
        oMenuDialog.setContentHeight("100%");
        oMenuDialog.attachAfterClose(function(oEvent)  {
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
        });
        sap.ui.getCore().AppContext.MenuDialog = oMenuDialog;
 		oMenuDialog.open();
}