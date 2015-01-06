jQuery.sap.require("STSA.util.Formatter");
jQuery.sap.require("STSA.util.Controller");

STSA.util.Controller.extend("STSA.view.Location", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf STSA.view.Location
*/
 onInit: function () {  
        this.getView().byId("map_canvas").addStyleClass("myMap");
    },
    
    onAfterRendering: function () {  

        if (!this.initialized) {  
            this.initialized = true;  
            this.geocoder = new google.maps.Geocoder();  
            var mapOptions = {  
                center: new google.maps.LatLng(-34.397, 150.644),  
                zoom: 8,  
                mapTypeId: google.maps.MapTypeId.ROADMAP  
            };  
            this.map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(),  
                mapOptions);  
        }
        this.getView().byId("inpSearch").setValue(sap.ui.getCore().AppContext.CurrentLocation);
        this.getView().byId("bntSearch").firePress();
    },  
    actSearch: function () {  
        var map = this.map;  
        var address = this.getView().byId("inpSearch").getValue();  
        this.geocoder.geocode({ 'address': address }, function (results, status) {  
            if (status == google.maps.GeocoderStatus.OK) {  
                map.setCenter(results[0].geometry.location);  
                var marker = new google.maps.Marker({  
                    map: map,  
                    position: results[0].geometry.location  
                });  
            } else {  
                alert('Geocode was not successful for the following reason: ' + status);  
            }  
        });  
    }  

});