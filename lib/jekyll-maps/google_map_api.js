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
            zoom: 3
        }
        this.mapReady = true;
        this.render();
    }

    /**
     * Register map data to be rendered once Google Maps API is loaded.
     *
     * @param String id
     * @param Array locations
     */
    function register(id, locations) {
        this.data.push({id: id, locations: locations});
    }

    /**
     * Render maps data if Google Maps API is loaded.
     */
    function render() {
        if (!this.mapReady) return;

        while (this.data.length > 0) {
            var data = this.data.pop(),
                bounds = new google.maps.LatLngBounds(),
                map = new google.maps.Map(document.getElementById(data.id), this.options),
                markers = data.locations.map(function (location) {
                    var position = new google.maps.LatLng(
                        location.latitude, location.longitude
                        ),
                        marker = new google.maps.Marker({
                            position: position,
                            title: location.title,
                            url: location.url,
                            map: map
                        });

                    bounds.extend(position);
                    marker.addListener('click', function () {
                        window.location.href = this.url
                    });

                    return marker;
                });

            map.fitBounds(bounds);
            this.maps.push({map: map, markers: markers});
            this.processCluster();
        }
    }

    function initializeCluster() {
        this.clusterReady = true;
        this.processCluster();
    }

    function processCluster() {
        if (!this.clusterReady) return;

        while (this.maps.length > 0) {
            var mapObj = this.maps.pop();
            new MarkerClusterer(mapObj.map, mapObj.markers, {
                gridSize: 25,
                imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
            });
        }
    }
}());
