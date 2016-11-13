
$(document).ready(function() {

  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9vdHNlODQiLCJhIjoiY2lrandjOTFyMDh5bHUybTZsMnQzZGhzYiJ9.v4EUTBiszBVhvt1wNek2DQ';
  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 5,
      center: [-123.221680, 38.400480],
      pitch: 60
  });

  var layerList = document.getElementById('menu');
  var inputs = layerList.getElementsByTagName('input');
  var totals = {
    "1985": {},
    "1990": {},
    "1995": {},
    "2000": {},
    "2005": {},
    "2010": {},
    "2015": {},
    "2020": {},
    "2025": {},
    "2030": {},
    "2035": {},
    "2040": {}
  }
  var populations = {
    "1985": {},
    "1990": {},
    "1995": {},
    "2000": {},
    "2005": {},
    "2010": {},
    "2015": {},
    "2020": {},
    "2025": {},
    "2030": {},
    "2035": {},
    "2040": {}
  }
  let firstTime = true;

  function switchLayer(layer) {
      var layerId = layer.target.id;
      map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
  }

  for (var i = 0; i < inputs.length; i++) {
      //inputs[i].onclick = switchLayer;
  }

  const colors = ['#00BFFF','#0000FF','#0000CD','#00008B','#141463']

  map.on('load', function () {
    $.getJSON("../static/json/tots.json", function (json) {
      for (let i = 0; i < json.length; i++) {
        totals[json[i].year][json[i].map] = parseFloat(json[i]["to.wgwfr"])
        populations[json[i].year][json[i].map] = parseFloat(json[i]["tp.totpop"])
      }
      updateMapLayers(2000)
    });
  })

  function updateMapLayers (year) {
    $.getJSON("../static/json/jsoncounties-CA.min.json", function (json) {

      if (!json.features) {
        return
      }
      
      let counties = json.features.counties
      let county_features = []

      for (let i = 0; i < counties.length; i++) {
        const { name, geometry, geographicRegion } = counties[i]

        let population = parseInt(populations[year][geographicRegion])
        let h = population * 10

        let value = parseInt(totals[year][geographicRegion])
        let color = 0
        if (value>=11.0 && value < 50.0) { color=1; }
        else if (value>=50.0 && value < 100.0) { color=2; }
        else if (value>=100.0 && value < 200.0) { color=3; }
        else if (value>=200.0) { color=4; }

        let rand = colors[color]

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
                  "description": "<strong>"+name+"</strong><p>Water usage: <i>"+value+"</i></p><p>Population: <i>"+population+"</i></p>",
                  "color": rand
                },
                "id": geographicRegion
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
                "description": "<strong>"+name+"</strong><p>Water usage: <i>"+value+"</i></p><p>Population: <i>"+population+"</i></p>",
                "color": rand
              },
              "id": geographicRegion
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

      if (firstTime) {
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['counties-extrusion'] });

            if (!features.length) {
                return;
            }

            var feature = features[0];

            // Populate the popup and set its coordinates
            // based on the feature found.
            var popup = new mapboxgl.Popup()
                .setLngLat(map.unproject(e.point))
                .setHTML(feature.properties.description)
                .addTo(map);
        });

        // Use the same approach as above to indicate that the symbols are clickable
        // by changing the cursor style to 'pointer'.
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['counties-extrusion'] });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });
        firstTime = false;
      }
    });
  }

  $(".btn-circle").click(function (event) {
      $(".btn-primary").removeAttr("disabled")
      $(".btn-primary").attr("class", "btn btn-default btn-circle")
      let year = $(this).data("year")
      $(this).attr("disabled", "disabled")
      $(this).attr("class", "btn btn-primary btn-circle")
      map.removeSource("countiesData")
      map.removeLayer("counties-extrusion")
      updateMapLayers(parseInt(year))
  })

  $('#animate').click(function (event) {
    const years = ["1985", "1990", "1995", "2000", "2005", "2010", "2015", "2020", "2025", "2030", "2035", "2040"];
    for(let i = 0; i < years.length; i++) {
      $('[data-year='+years[i]+']').click()
    }
  })
})
