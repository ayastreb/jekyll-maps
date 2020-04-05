/* global google */
/* global MarkerClusterer */
// eslint-disable-next-line no-unused-vars
var jekyllMaps = (function() {
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
  function initializeMap() {
    options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: new google.maps.LatLng(0, 0),
      styles: []
    }
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
      var bounds = new google.maps.LatLngBounds()
      var mapOptions = Object.assign({}, options, item.options)
      var map = new google.maps.Map(
        document.getElementById(item.id),
        mapOptions
      )
      var infoWindow = new google.maps.InfoWindow()
      var markers = item.locations.map(createMarker)

      map.fitBounds(bounds)
      google.maps.event.addListenerOnce(map, 'idle', function() {
        if (this.customZoom) this.setZoom(this.customZoom)
      })
      if (mapOptions.useCluster) {
        maps.push({ map: map, markers: markers })
        processCluster()
      }
    }

    function createMarker(location) {
      var position = new google.maps.LatLng(
        location.latitude,
        location.longitude
      )
      bounds.extend(position)
      if (!mapOptions.showMarker) return false

      var marker = new google.maps.Marker({
        position: position,
        title: location.title,
        image: location.image,
        popup_html: location.popup_html,
        icon: location.icon || mapOptions.markerIcon,
        url: markerUrl(mapOptions.baseUrl, location.url),
        url_text: location.url_text,
        map: map
      })
      if (mapOptions.showMarkerPopup) marker.addListener('click', markerPopup)

      return marker
    }

    function markerUrl(baseUrl, url) {
      if (/^(https?|\/\/)/.test(url)) return url

      return url.length > 0 ? baseUrl + url : ''
    }

    function markerPopup() {
      var content = '<div class="map-info-window"><h5>' + this.title + '</h5>'
      if (this.popup_html.length > 0) {
        content += this.popup_html
      }
      else {
        var imageTag =
          this.image.length > 0 &&
          '<img src="' + this.image + '" alt="' + this.title + '"/>'
        if (this.url.length > 0) {
          var linkContent = imageTag || this.url_text || 'View'
          content += '<a href="' + this.url + '">' + linkContent + '</a>'
        } else if (imageTag) {
          content += imageTag
        }
      }
      content += '</div>'
      infoWindow.setContent(content)
      infoWindow.open(map, this)
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
