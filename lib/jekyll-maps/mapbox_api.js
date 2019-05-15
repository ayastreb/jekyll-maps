/* global mapboxgl */
// eslint-disable-next-line no-unused-vars
var jekyllMapbox = (function() {
  'use strict'
  var mapReady = false
  var options = {}
  var data = []

  return {
    initializeMap: initializeMap,
    register: register
  }

  /**
   * Setup Google Maps options and call renderer.
   */
  function initializeMap(accessToken) {
    mapboxgl.accessToken = accessToken
    mapReady = true
    render()
  }

  /**
   * Register map data to be rendered once Google Maps API is loaded.
   *
   * @param string id
   * @param Array locations
   * @param Object settings
   */
  function register(id, locations, options) {
    data.push({ id: id, locations: locations, options: options })
    render()
  }

  /**
   * Render maps data if Google Maps API is loaded.
   */
  function render() {
    if (!mapReady) return

    while (data.length > 0) {
      var item = data.pop()
      // mapbox bounds: https://stackoverflow.com/a/35715102/1407622
      var bounds = new mapboxgl.LngLatBounds()
      if(item.customZoom) item.zoom = item.customZoom // mapbox takes
      var mapOptions = Object.assign({
        container: item.id,
        style: 'mapbox://styles/mapbox/streets-v9'
      }, options, item.options)

      var map = new mapboxgl.Map(mapOptions)

      // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
      // https://docs.mapbox.com/help/tutorials/add-points-pt-1/
      var geoJSON = {
        type: "FeatureCollection",
        features: item.locations.map(toGeoJSONFeature),
      };

      map.fitBounds(bounds, {
        maxZoom: 12
      })

      map.on('load', function() {

        console.log(geoJSON);

        map.addSource("features", {
          type: "geojson",
          data: geoJSON,
          // cluster: true,
          // clusterMaxZoom: 14,
          // clusterRadius: 50, // defaults to 50
        })

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "features",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
          }
        });

        /*
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "features",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1"
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40
            ]
          }
        })

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "features",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
          }
        });

        // inspect a cluster on click
        map.on('click', 'clusters', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          var clusterId = features[0].properties.cluster_id;
          map.getSource('features').getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err)
              return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          });
        });

        map.on('mouseenter', 'clusters', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'clusters', function () {
          map.getCanvas().style.cursor = '';
        });

        */

        // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'unclustered-point', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'unclustered-point', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'unclustered-point', function () {
            map.getCanvas().style.cursor = '';
        });



      });
    }

    function toGeoJSONFeature(location) {
      var position = [location.longitude, location.latitude]; // order as in GEOJson
      bounds.extend(position);
      if (!mapOptions.showMarker) return false;

      var feature = {
        geometry: {
          type: "Point",
          coordinates: position,
        },
        type: "Feature",
      };

      if (mapOptions.showMarkerPopup) {
        var url = markerUrl(mapOptions.baseUrl, location.url)

        var description;
        if (location.popup_html.length > 0) {
          description = location.popup_html;
        } else {
          var imageTag =
            location.image.length > 0 &&
            '<img src="' + location.image + '" alt="' + location.title + '"/>'
          if (url.length > 0) {
            var linkContent = imageTag || location.url_text || 'View'
            description = '<a href="' + url + '">' + linkContent + '</a>'
          } else if (imageTag) {
            description = imageTag
          }
        }
        feature["properties"] = {
          title: location.title,
          url: url,
          url_text: location.url_text,
          image: location.image,
          popup_html: location.popup_html,
          description: description,
        };
      }

      return feature;
    }

    function markerUrl(baseUrl, url) {
      if (/^(https?|\/\/)/.test(url)) return url

      return url.length > 0 ? baseUrl + url : ''
    }
  }
})()
/* Object.assign polyfill */
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}
