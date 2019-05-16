/* global mapboxgl */
// eslint-disable-next-line no-unused-vars
var jekyllMapbox = (function() {
  'use strict'
  var mapReady = false
  var options = {}
  var data = []

  const MarkerIconDefault = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADwAAAA8ABA9l7mgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASrSURBVGiB3ZpPaFxVFMZ/Z8bGTFLQEhWhaa0lYGvcSERQZ6YjhS6iuLKxaqXVWtFFQPxTazZWK1QRl0HQ+GclJSlYsVUpVCczL41oA9JqW7FUWxVLbTWgSTCZmeMiU42a+969972p4Le93znn+zj3vXf/PPifQZJOqHmWoKwCbkRZgbAMSNeHK8C3CMeAT5mhKKP8kGT9RAxpgWYq3IPwAHCzQ94ayggpXqeVnfIBv8fVEsuQdtJEG4+g9AFXxNRyGuF5JnhVxpjxTeJtSLNkEQaAa3xzGHCUFJtkmFGf4JRPkObYgjBM8mYAVlKjrFke8wl26pBCihz9wMM+xZyh9BPQK6C2IdaGFIQcbwIbvMT5Y4AyD9masp9yObZx4c0APEiWPluyVYc0TzfKHlt+A6Ao3RLwYRQxUqCuoZUpjgBLPcVUEU7XZV3JXx9ZV3xDhU4ZZSqMFD3lJnkCdzPTKP1AgTTNUqJdSrQzSQblVuAVYNox59Wko998oR3SAgup8j1wiUPhMZQeCTgRkbuDKoPA9Q65x8nQLvuYMBHCO1RlPW5m9jNJPsoMgBQ5ToYcUHTIfylT3B1GiJpyax2KnUBZK2NM2gbIPiZo4k7gpEOdUE1GQ1pgIZCzLqNslYBf7HXNQvZzDuVph5BV2kWLadDcoQqdwALLIt8RsMtB1N8RsBOx3kZcTDPXmgbNhlKscJC0x2V58k/UY/c6BKw0DZkN1Whz0HTUgWvCEWummLWFdcg4T+cp8LM11wTlnAPb4xmqOYh066YJlztwjdrCOnTWOr04PW/xcwhnTENmQ8oxBzm3a5zd72zsbQ4BRm1mQ2UOg/W8XkI+/Aseiiz3oSy2ZJ+hbH4JGQ0JKMIBa1HKds2yyJp/Pmw1bQjPOYQcCPtEhC99lEGHQssRhsK+4v9Kv4ZWptkFXGVdJUJTuKE0u8G8sp0Hq2mhpFmWR+oq0MEUZaDgkP9Xpng3jBC9wcvxBnC/Q1GY3Q+9hjBEmhEpUgHQLhaQ4RaEHmAT0OSYd0DKbA4jRBsqcB1VDtlwDUhqx6oInVIKX5VE7lilyBfAe54iANIoi+tvMV8zIOyOMgO2pz41dhBj8ZkAFGGHDdHKkIzwCTi98ZLG2zLMZzZE+3O5Gs+A/yF6DEyTZpst2dqQjPAVystekuLhRSly3JbsdrbdRQstfAksc1XlCauzuLlwun2QMSZRtrjr8oTyuIsZ8LhOkYAh4C3XOA8MSMA7rkFe90Ok6QX7ee2Br8nwqE+glyEp8huwEaj6xEegSooNYaejYfDrECBlRlBe8o03J+YF3+tIiGEIgIt4FjgUK8dcCJ/TyvZ4KWJCsyxFOIjbIcd8+AnlBgk4FSdJvA4BEnCKFHcx+1OFLyoI6+KagQQMAcgwHwNPxkjRJyU+SkRLEknOw2szqAwSsC7OUfJcJNKhP5GhFxhziDjMDJuTMgON+HmpwGVUGQU6IqgngZukzI9J1k+2Q4AUOYtwBzAeQhsHupM2Aw0wBFDfKq9n/pVEBeFeKTvcNjigIYYApMze+unOXFNVlB4p8X6j6jYcmmOj5qhpjprm/5M/UZKH5tmqWZ66ELX+AOQZQbFUXt8bAAAAAElFTkSuQmCC'

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
        style: 'mapbox://styles/mapbox/streets-v9',
      }, options, item.options)

      var map = new mapboxgl.Map(mapOptions)

      // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
      // https://docs.mapbox.com/help/tutorials/add-points-pt-1/
      var geoJSON = {
        type: "FeatureCollection",
        features: item.locations.map(toGeoJSONFeature),
      };

      map.fitBounds(bounds, {
        maxZoom: 12,
        padding: 30, // in px, to make markers on the top edge visible
      })

      map.on('load', function() {

        map.addSource("features", {
          type: "geojson",
          data: geoJSON,
          // cluster: true,
          // clusterMaxZoom: 14,
          // clusterRadius: 50, // defaults to 50
        })

        // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
        let markerIcon = mapOptions.markerIcon || MarkerIconDefault;
        map.loadImage(markerIcon, function(error, image) {
          if (error) throw error;
          map.addImage('marker-custom', image);

          map.addLayer({
            id: "unclustered-point",
            type: "symbol",
            source: "features",
            filter: ["!", ["has", "point_count"]],
            layout: {
              // "icon-image": "{marker-symbol}-15",
              "icon-image": "marker-custom",
              "icon-anchor": "bottom",
              "icon-size": 0.7,
              // "text-field": "{title}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              // "text-offset": [0, -1.6],
              // "text-anchor": "top"
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

            // offset: https://bl.ocks.org/andrewharvey/60c0b1f12118bda230174ff630931278
            new mapboxgl.Popup({offset: [0, -40]})
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

        var description = `<div class="map-info-window"><h4>${location.title}</h4>`;
        if (location.popup_html.length > 0) {
          description += location.popup_html;
        } else {
          var imageTag =
            location.image.length > 0 &&
            '<img src="' + location.image + '" alt="' + location.title + '"/>'
          if (url.length > 0) {
            var linkContent = imageTag || location.url_text || 'View'
            description += '<a href="' + url + '">' + linkContent + '</a>'
          } else if (imageTag) {
            description = imageTag
          }
        }
        description += '</div>'
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
