
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9vdHNlODQiLCJhIjoiY2lrandjOTFyMDh5bHUybTZsMnQzZGhzYiJ9.v4EUTBiszBVhvt1wNek2DQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 4.5,
    center: [-123.221680, 38.400480],
    pitch: 40
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
}

for (var i = 0; i < inputs.length; i++) {
    //inputs[i].onclick = switchLayer;
}

const colors = ['#1a721b', '#33ac28', '#6fd626', '#f8e71c', '#f5a623']
const heights = [0, 5000, 7000, 20000, 50000]

map.on('load', function () {
  $.getJSON("../static/json/jsoncounties-CA.min.json", function (json) {

    if (!json.features) {
      return
    }
    
    let counties = json.features.counties
    let county_features = []

    for (let i = 0; i < counties.length; i++) {
      const { name, geometry } = counties[i]
      let rand = colors[Math.floor(Math.random() * colors.length)]
      let h = heights[Math.floor(Math.random() * heights.length)]

      if (geometry.type === 'MultiPolygon') {
        let j = 0
        geometry.coordinates.forEach(function (coords) {
          county_features.push({
              "type": 'Feature',
              "geometry": {
                  'type': 'Polygon',
                  'coordinates': [coords]
              },
              //"geometry": geometry,
              "properties": {
                "level": 1,
                "height": h,
                "base_height": 0,
                "name": name,
                "color": rand
              },
              "id": name+i+'_'+j
          })
          j += 1
        })
      } else {
        county_features.push({
            "type": 'Feature',
            "geometry": {
              'type': 'Polygon',
              'coordinates': geometry.coordinates
            },
            //"geometry": geometry,
            "properties": {
              "level": 1,
              "height": h,
              "base_height": 0,
              "name": name,
              "color": rand
            },
            "id": name+i
        })
      }
    }

    map.addSource("countiesData", {
        "type": 'geojson',
        "data": {
          "features": county_features,
          "type": "FeatureCollection"
        }
    })

    map.addLayer({
        'id': 'counties-extrusion',
        'type': 'fill-extrusion',
        'source': 'countiesData',
        'paint': {
            'fill-extrusion-color': {
              'property': 'color',
              'type': 'identity'
            },
            'fill-extrusion-opacity': 0.6,
            'fill-extrusion-height': {
              'property': 'height',
              'type': 'identity'
            },
            'fill-extrusion-base': {
              'property': 'base_height',
              'type': 'identity'
            }
        }
    })
  });
});

$(document).ready(function() {
  $(".btn-circle").click(function (event) {
    $(".btn-primary").removeAttr("disabled")
    $(".btn-primary").attr("class", "btn btn-default btn-circle")
    let year = $(this).data("year")
    $(this).attr("disabled", "disabled")
    $(this).attr("class", "btn btn-primary btn-circle")
  })
})
