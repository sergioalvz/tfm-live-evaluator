var MapModule = (function() {
  var heatpoints = new google.maps.MVCArray([]);

  var install = function($container){
    var mapOptions = { zoom: 5, center: new google.maps.LatLng(40.24, -3.41) };
    var map = new google.maps.Map($container[0], mapOptions);
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatpoints
    });
    heatmap.setMap(map);
  };

  var add = function(lat, lng) {
    var point = new google.maps.LatLng(lat, lng);
    heatpoints.push(point);
  };

  return {
    install: install,
    add: add
  };
})();
