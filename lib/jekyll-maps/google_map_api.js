var jekyllMaps = (function () {
    'use strict';

    return {
        data: [],
        maps: [],
        initializeMap: initializeMap,
        initializeCluster: initializeCluster,
        register: register,
        render: render,
        processCluster: processCluster
    };

    /**
     * Setup Google Maps options and call renderer.
     */
    function initializeMap() {
        this.options = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(0, 0),
            zoom: 12
        }
        this.mapReady = true;
        this.render();
    }

    /**
     * Register map data to be rendered once Google Maps API is loaded.
     *
     * @param String id
     * @param Array locations
     * @param Boolean useCluster
     */
    function register(id, locations, useCluster) {
        this.data.push({id: id, locations: locations, useCluster: useCluster});
        this.render();
    }

    /**
     * Render maps data if Google Maps API is loaded.
     */
    function render() {
        if (!this.mapReady) return;

        while (this.data.length > 0) {
            var data = this.data.pop(),
                bounds = new google.maps.LatLngBounds(),
                options = this.options,
                map = new google.maps.Map(document.getElementById(data.id), options),
                infoWindow = new google.maps.InfoWindow(),
                markers = data.locations.map(createMarker);

            map.fitBounds(bounds);
            google.maps.event.addListenerOnce(map, 'bounds_changed', onBoundsChanged);
            if (data.useCluster) {
                this.maps.push({map: map, markers: markers});
                this.processCluster();
            }
        }

        function createMarker(location) {
            var position = new google.maps.LatLng(location.latitude, location.longitude),
                marker = new google.maps.Marker({
                    position: position,
                    title: location.title,
                    image: location.image,
                    url: location.url,
                    map: map
                });

            bounds.extend(position);
            marker.addListener('click', function () {
                var contentString = '<div class="map-info-window"><h5>' + this.title + '</h5>',
                    link = 'View';
                if (this.image.length > 0) {
                    link = '<img src="' + this.image + '" alt="' + this.title + '"/>';
                }
                contentString += '<a href="' + this.url + '">' + link + '</a></div>';
                infoWindow.setContent(contentString);
                infoWindow.open(map, this);
            });

            return marker;
        }

        function onBoundsChanged() {
            if (this.getZoom() > options.zoom) {
                this.setZoom(options.zoom);
            }
        }
    }

    function initializeCluster(settings) {
        this.clusterReady = true;
        this.clusterSettings = settings || {};
        this.processCluster();
    }

    function processCluster() {
        if (!this.clusterReady) return;

        while (this.maps.length > 0) {
            var obj = this.maps.pop();
            new MarkerClusterer(obj.map, obj.markers, {
                gridSize: this.clusterSettings.grid_size || 25,
                imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
            });
        }
    }
}());
