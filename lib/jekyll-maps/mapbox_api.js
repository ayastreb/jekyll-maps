/* global mapboxgl */
/* global MarkerClusterer */
// eslint-disable-next-line no-unused-vars
var jekyllMapbox = (function() {
  'use strict'
  var clusterSettings = {}
  var clusterReady = false
  var mapReady = false
  var options = {}
  var data = []
  var maps = []

  return {
    initializeMap: initializeMap,
    initializeCluster: initializeCluster,
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
      var markers = item.locations.map(createMarker)

      map.fitBounds(bounds, {
        maxZoom: 12
      })

      if (mapOptions.useCluster) {
        maps.push({ map: map, markers: markers })
        processCluster()
      }
    }

    function createMarker(location) {
      // make a marker for each feature and add to the map
      var position = [location.longitude, location.latitude]; // order as in GEOJson
      bounds.extend(position)

      if (!mapOptions.showMarker) return false

      // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker';
      var marker = new mapboxgl.Marker(el).setLngLat(position);
      if (mapOptions.showMarkerPopup) {
        var content = '<div class="map-info-window"><h5>' + location.title + '</h5>'
        if (location.popup_html.length > 0) {
          content += location.popup_html
        }
        else {
          var imageTag =
            location.image.length > 0 &&
            '<img src="' + location.image + '" alt="' + location.title + '"/>'

          var url = markerUrl(mapOptions.baseUrl, location.url)
          if (url.length > 0) {
            var linkContent = imageTag || location.url_text || 'View'
            content += '<a href="' + url + '">' + linkContent + '</a>'
          } else if (imageTag) {
            content += imageTag
          }
        }
        content += '</div>'

        marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
      }

      marker.addTo(map);

      return marker
    }

    function markerUrl(baseUrl, url) {
      if (/^(https?|\/\/)/.test(url)) return url

      return url.length > 0 ? baseUrl + url : ''
    }
  }

  function initializeCluster(settings) {
    clusterReady = true
    clusterSettings = settings || {}
    processCluster()
  }

  function processCluster() {
    if (!clusterReady) return

    while (maps.length > 0) {
      var obj = maps.pop()
      // eslint-disable-next-line no-new
      new MarkerClusterer(obj.map, obj.markers, {
        gridSize: clusterSettings.grid_size || 25,
        imagePath:
          'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
      })
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
