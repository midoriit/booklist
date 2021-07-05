$(function(){
  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18,
  });
  var layer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  layer.addTo(map);

  var markerclusters = new L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40
  }).addTo(map);

  $.getJSON( 'poi.geojson', function(data) {
    var poiLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
        }).bindPopup(
          function() {
            tr = '<table border>';
            Object.keys(feature.properties).forEach( function(k){
              if( k == 'ID' ) {
                tr = tr + 
                   '<tr><td>' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   '<a href="' + feature.properties[k] + '" target="_blank">' +
                   feature.properties[k] + '</a>' +
                   '</td></tr>';
              } else {
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td>' +
                   feature.properties[k] + 
                   '</td></tr>';
              }
            });
            return tr + '</table>';
          }
        );
      }
    });

    markerclusters.addLayer(poiLayer);
    map.fitBounds(poiLayer.getBounds());
  });

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

});
