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
        if (item.getNumber().toString().indexOf(filterPattern) !== -1) {
    		visibility = true;
        }
    	listItems[i].setVisible(visibility);
    }
}