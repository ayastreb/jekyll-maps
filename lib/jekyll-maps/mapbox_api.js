/* global mapboxgl */
// eslint-disable-next-line no-unused-vars
var jekyllMapbox = (function() {
  'use strict'
  var mapReady = false
  var options = {}
  var data = []

  const MarkerIconDefault = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADwAAAA8ABA9l7mgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASrSURBVGiB3ZpPaFxVFMZ/Z8bGTFLQEhWhaa0lYGvcSERQZ6YjhS6iuLKxaqXVWtFFQPxTazZWK1QRl0HQ+GclJSlYsVUpVCczL41oA9JqW7FUWxVLbTWgSTCZmeMiU42a+969972p4Le93znn+zj3vXf/PPifQZJOqHmWoKwCbkRZgbAMSNeHK8C3CMeAT5mhKKP8kGT9RAxpgWYq3IPwAHCzQ94ayggpXqeVnfIBv8fVEsuQdtJEG4+g9AFXxNRyGuF5JnhVxpjxTeJtSLNkEQaAa3xzGHCUFJtkmFGf4JRPkObYgjBM8mYAVlKjrFke8wl26pBCihz9wMM+xZyh9BPQK6C2IdaGFIQcbwIbvMT5Y4AyD9masp9yObZx4c0APEiWPluyVYc0TzfKHlt+A6Ao3RLwYRQxUqCuoZUpjgBLPcVUEU7XZV3JXx9ZV3xDhU4ZZSqMFD3lJnkCdzPTKP1AgTTNUqJdSrQzSQblVuAVYNox59Wko998oR3SAgup8j1wiUPhMZQeCTgRkbuDKoPA9Q65x8nQLvuYMBHCO1RlPW5m9jNJPsoMgBQ5ToYcUHTIfylT3B1GiJpyax2KnUBZK2NM2gbIPiZo4k7gpEOdUE1GQ1pgIZCzLqNslYBf7HXNQvZzDuVph5BV2kWLadDcoQqdwALLIt8RsMtB1N8RsBOx3kZcTDPXmgbNhlKscJC0x2V58k/UY/c6BKw0DZkN1Whz0HTUgWvCEWummLWFdcg4T+cp8LM11wTlnAPb4xmqOYh066YJlztwjdrCOnTWOr04PW/xcwhnTENmQ8oxBzm3a5zd72zsbQ4BRm1mQ2UOg/W8XkI+/Aseiiz3oSy2ZJ+hbH4JGQ0JKMIBa1HKds2yyJp/Pmw1bQjPOYQcCPtEhC99lEGHQssRhsK+4v9Kv4ZWptkFXGVdJUJTuKE0u8G8sp0Hq2mhpFmWR+oq0MEUZaDgkP9Xpng3jBC9wcvxBnC/Q1GY3Q+9hjBEmhEpUgHQLhaQ4RaEHmAT0OSYd0DKbA4jRBsqcB1VDtlwDUhqx6oInVIKX5VE7lilyBfAe54iANIoi+tvMV8zIOyOMgO2pz41dhBj8ZkAFGGHDdHKkIzwCTi98ZLG2zLMZzZE+3O5Gs+A/yF6DEyTZpst2dqQjPAVystekuLhRSly3JbsdrbdRQstfAksc1XlCauzuLlwun2QMSZRtrjr8oTyuIsZ8LhOkYAh4C3XOA8MSMA7rkFe90Ok6QX7ee2Br8nwqE+glyEp8huwEaj6xEegSooNYaejYfDrECBlRlBe8o03J+YF3+tIiGEIgIt4FjgUK8dcCJ/TyvZ4KWJCsyxFOIjbIcd8+AnlBgk4FSdJvA4BEnCKFHcx+1OFLyoI6+KagQQMAcgwHwNPxkjRJyU+SkRLEknOw2szqAwSsC7OUfJcJNKhP5GhFxhziDjMDJuTMgON+HmpwGVUGQU6IqgngZukzI9J1k+2Q4AUOYtwBzAeQhsHupM2Aw0wBFDfKq9n/pVEBeFeKTvcNjigIYYApMze+unOXFNVlB4p8X6j6jYcmmOj5qhpjprm/5M/UZKH5tmqWZ66ELX+AOQZQbFUXt8bAAAAAElFTkSuQmCC'

  // source: https://github.com/googlemaps/js-marker-clusterer/blob/gh-pages/images/m1.png
  const ClusterIconDefault = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAAABHNCSVQICAgIfAhkiAAAEDpJREFUaEO1WmtwXddV/s7jvq8kS34raus0dkjsjDFODLQUGlJoGUiBIYQJMEOHDvQHoT8SEr8a8A1tEr+mnSkzMLRMytAfgSYzZNoGZmDalLSFadwkNMZJGzuxHcu2HMmS9bj33HvPY/Ottc+RZOVKlmx5a67uuefsvfb69nrutY+D69FqxsUxONgCD+P8YBBYO5CHM5JgaFWEHhjgOxGODRtsec2gVkuWkw1n2YjVThaBFfLxkRMgDRem7PKaABrpNGV+yzW/w8CBU0oQTsXIV2O0R0Oc6wvwJSe8Vp6uFZSDmqmQxyoMQQizUcPAL1u6ek2JaRNA0lKAEcF26hcnIc4PTeBvNrXSAUv+ujpQtRoB7KuiXC/DVHjNJgCE8QxEmIJx6pE+dyoJpeagzY/9pjQDIGc4Tlq2IHweOg7cuI12tY6ak4nZdlvE/6WDeuBMCesHxCoIhvNFZateGRj5HY7WgVcbqP2yBTQfI58+XkD/xjLcRmmmyyxwSrtOFa1cJLiFac2aY/GgVDoPrICfK8Ex1rAVCJlwESEZCfDDVQ2sO+Ero6A7QNgLL0fVRB5JZCXi+g5/B4jbEzDxGKJgEuhr4Bxp3ThehecXYJxU+gTlNyyPbnkcDztcrCu3xYH61A9z2HR7L5KGbyVDwgLI4So2Kpe4ik0cMP3CFp9UgDivkjTiJNg8alocW26ya47WG45H64paBHMJ8cgb2LV6krS6EKJbncxsu4zLLex1RjkqVVlLcu7/K4MSQDfduvoyJyBG7qKJPbiEx7CGALeScIUrHysUx3PeBULAZE0Aym8T277ynRCkR0qxuYDm2KvA6gbyUyvhVXM6LAMX0NZq3Rd5Z15gVwZVM1WUuGqZV1PpHH6HjqIbxWgzPIeAvWRaKkksMvDgelzlaBw5v07nMMk7lomonUM+30UuK0icbvaLuQCJBSlUYlfvmfAszuRehz/oYuVAH3KpIxI+wvLwQjZ2ZVCySrWL3Sj1VRHVY3ymegGHzI1k5DZdwdmSsddTaOFNPOIw4qZADk6tg/FpY7SV4MSbqG2RWMSg+7yP/J3vhx9v5MK4kAXJaIrkXNPCOxe/j+raFkFZbRk6MXold784UDJRzdD4H22isuc2JN4GTmmdhaoNJRWHg2jmjtMOuuBGW+D7t5Ht9xL0OiRJzF5WUoYyo9PmaII2pwnmKKm/jmAih1LpZri5tfxtJS8glXbzKJpFascp8nFjU4Ev0BYPSog8EWyAW9xGpqx7FVVJzBRO+t/FTVxJt/zH7LWOz/PTcyYJ7c+9fJ4kzYpcOjn7vEkpvYoT3lexgaru4+dUhcXRiDKbKERj7HuorZlaAMv0o6WBkmEHWrfCeFQXNs87ibdxHAPxx3j9ccQEkEmQukYw4ppFKUOYRMKuzMeYxNuGfUUimYq6rvg6uvnwqzhPW7oBO/i7lzZGVfVexk5nSOdcRFs6KCH6uLkFCeNLFAaoVO+nqWzgXcaqVCpJkiegcTL1ImL8CM2pYWYPDRR9ql6BLj83QEa3E+IO9hNpRaRBuSR2IZL4f7DTfxKPtzaj3RxCrUfc+KLb1YES8ppZ9B8iU7LCliFZddcd49Nn8JDzEpm6hZ7uLkpwE/3Ah2EMV9t5k8+/C1N/AUf+bRg7fue3ee8XOI5g2Wxs8/l9ltLZt2gkszpePSghctDczdX+Ta60aFSAxH2KinYGBdxP7u5hj5un52I6p01SPbm2398j809SCZ+hBX2M4D8qFsRPE6H7dwy0P54ev4SLawMlEx2M7mFa8yEE7j5mTB8kt/8K12GqYyztDMxspowmsbSwFBwolZbzAXjhOuRyf4KkdRg7i8eXgOOyrtcOSsg9cakXuR5KB59NqVumF8eV7WvoReHch/pr/8k41l7c0M69bOLY+dni77pdn6RkBJCNRSKFxbdMolWO+iYqm39m8UM797QEJb/rn2SEv5NJmZMx1nnE3LuHot+iQT2rgJxOujZ3wAK/RS0dbjHC5s3YUzq1QM8FH/n6tP/mHuS6cjhEBxyPttDs5XaAAVSy74WaZObAl1O5LEU6nanaRcnBLz7KDp/o3Gmeu7VjeZQ2F+iuQtmOSx1hNaO4TaPNmN2zeL13cnidnukMM7m30P9ojNo+cV0zkjwQ/wVd9eF5prn62+JH2o11mmd2asLzxRM5vGfjAN3+m4ybq+E1bDYflJu+Vn22SYhnk2JI1BvAD9iJv+O4xO/NDJRvobzvXhzmxi8OT7Lj69hVHqSX+2SnOa/pnlVBB4XKF0jnD5TWQ0MVrO29iXZbR6Mwzk3OVpQ2djPb8PGAOcddQIhSmaC4Ey8j77KMJZFB9q5WAjWnDa+0RlNKaYmZsBWeZCvv3MHN3O/y+Uewf5RZtwBe5iYqaMsWv6+UD8R/jbWrD9Ia/pyZyK+hNNLSxXZpKq4XYmVzDTDMXDQtLUj4Z10up3sV2cnmmU1L44ZghlWujjTHvUHhS2iMopPwun9jps8yX2Xxa3+LlUOXOiMf2Ua6W7BrlSS1aUZMdovFCi6OhyqUtE5CtZNtT9qYdupVxA2cpKG6O6XpHWIZzCSe5naan1F6xvspDZ7Xqykwl3sojHJel0vJG5y/NsqtTVqBEm1KUMTKjeRbyiK2dY5Trm+mt+Ox4S5UthNukm4hWtwKjHACZtAzPuO6YNMiTXzBAspm8K3Hnp4wq33OVNI6g8oGaC0hzy1dXUSeiYUG6XXx19R1lZTwINrCgiH/z6xevnse9bhMUtwFaCNSKTJqS0tson5OWFDXSqXTxFWmcpjbwaXErrOk4iiheokt8zvdf+11LrK2kfIppiae/DV+ZksqOjFTnM/qbY4/riJXSeXsEhiM6d5H9j2Ouxlh66lUUtcDGWVDsqZ+lI6ioGqvJTeX5ThTlGXVtXelptEax3i3jbF6U1Z95WDM6gw9mlRWuQJSDAF9YhqLSYyVHzaDN7g1IHFZMW8T9moWzbrxtFpqt2VpmuE7P4HTI66Ahw5s4gVdbjjzyk9qNlKsKYyghzFKPJ+Wvhvy8L/oKlnvlptS1566tcD73OhRSlLmksKkZOFJ9IZKTyWFTahNrqZK/MOygJhLxGrXn8GJtnOOktqUVHmbwQ/YdeV0XVEgNx+dRL6POkiFEgxBue1q6hNWbHwS4tUyawinGsyGmgoiYQ0O5Y20Lck90nuJbOM/QfX8CkeIbS2vCibmKEvM34br/zrntGEEGMIj5TNkXKpNlBw1zqO7l7MtOTyabqMEJblcYZyMS0QmAb+LTmBDRII2mXVYaPTdfgyVpCo6os7Ccenmk42I4ksE9FyanS8HMLEl8uI8hAPhrxLQKs4pdMUPcp/F+iMNRuUmpbmQQVZ2GO3Amz51wVDT6marYc+C5LxIKg5TFwqIWxfUUWgJmSTWtwb4+1kCKhKQXZdC/g/xsCvb9v/mZx5XO7OGC15lu2FjvgATvMZFvYcL2OJ8hOTWEY8fQbVvG3lhkUb/xGQuoP/2LuRK9qxLK1lPRxZUrV8zQW0irb5KGcH+4xQxMyyxLVmbwnuxO/8jTvR/7CXeRmxrAw7G9+Ps4K9wheW+bUtTR+vpNOdLnsARdzdQ+JSyLQulmQx+gFaPLO4KiObYwwaeglC9/KA0nbdGk6Go40zwDWgv2ojPuDZqR62jJKvKS2BVPNa6DcGlv+ePSV1BVsv5fTv6+/+IAfouZjFfVxI2Kb2yOlpTJPvk3+CvUK9/Hj+bfJqe7gZVMYcez3Hf4vbiKRSirQpI6YtB1Vm+picUKWmM4me0oRhmQIEnGPJAPIgmhg/2obX/FD3gRLpqtK38+1ka7ubvf+HYLF1pc/rtyLH+d/7sfbSzuym1IAWmPLyrZZK0Xu4Vupp+1hG/gkrXLkplM+lluc84pfO3Wv9z/W6lY6g9LtVuZ3WIpmKlJGYjIenwOk2+Z0DVHEZtFielSQd1GPvyJHrCEpOV40q5pZ/G8ZdeZqd/tvcZu2Sdk6SfJ4yf5+UY3nYYAuL7ePdbfHaMIM/yelA/UjlynP+lWn2Ne7MdOI0P8ICARc3C57hYdATMMS1fLYTtL/NQrsra4S06tzgHqdi+yD/Z+sjGVgVAYYTDslvXdrlx10ye25CV+kQ6y4mhHNuU9m1n9BaVEJch95sIHvsWKvt2MLH9U/WGWXVWArRLLwmye+7cP6FnwON6rpDCs9KVVCw4P4rq+i2k9fO8cyNpSEAVMKJ0lATVu10/iJD6WSwRMJ2VxE1xWq3mq7hQHMIAvaCqHZscfu/tYhXYtstByb2a6UOpUbTSEgZoazWe3h0yd/HpTHIptlYffR5+H/U6eZB2UE3dvTgQoRsw5f0cxwrAy5u8nlDZsIu9+hWGNBmjrjo5jeHhL2JFdx8K+e20Z2tHsphJeB578kfwmFk/DUgcXHhqbPZpyGybshMLALdsMwxJOwRgzXRT5VgqpvbrGZLGau5ken4RXquEIfcR2tKzfC7ZfFHBJck7vJ6wROf81+OY+Jz2s6pW0v5J+I8IPnsAa/o2oVDaTvuRbQ+Bcs44vKCAahOrrMqlGUQ40Zp7vPNuUDLN8Zd4wCx5lDQOLtHz3fS+IqX9bbp5lpdlVXmkKQx5hVuwLvoQHB61BO7DfPIk79epom9TSvMXJR2PuR2lbZLz7H8IO72/RBidQemRu+0BgqqjlaDnXcLe3ItaYCl1cVcuDo0H3BEDdYfDg86gvnRHiLFJ7m75xoqA0/pFuYvKV8CLTz8PJxlWt6r7HUrNOEw6V32EMvogWvWfkMEHUT/zjDI1X4tHXkHY2IOdbo0kJnAw/DDd8w7StWB0HGnHPGl7yHkBj0/2acVIeMk+p3/c8TTk3TY1mwk9JQ/owvm6jTgOIabi7hnDE+Z9BLXNHl4z8c2ONmW8nP497Dw3H57p+4fNL1FtK+xvw4MGetLSbQY1oel9n30v2RJeg6mQvFfBZgI69bMj8x2TdpZUNusuZxJ+c8oCStWx5BfpNFbjZdYDg/P/QSa4WnS34pmkybeJGPMW0SLuBjxm31aVraqxQELFO4Pd/jdwkWpcYinBTwHpOxVUvQUAyawLg5Ieu/vGMTQ4pqqo0uJqyfsU2/iqAdbnsZN5X8IVjdpv6Sork+HpRUASB87YRSnJR/TA8Y6h4b+A1neOqkPI3LbGTbEhfg+Vl/EgW165ec96Fltmv41CVqQA6pemsNsRT2fU3X7GEeNfTHOwv70VzdZ51Lrewb3Gw5YJBtXukpbtFAznkBZMscZQHaHzmWVznadY2Kbmjrn3ax62f5RRv4d7LqpBVgDVieklY7r8NlXmSjX42XSF5h33ljm2SCnPvAiSbfq078gk34SRcJF65LmMXf57aaCysVInKNdXzLxBxsmyd4iC8hRBdY5PnXiRdEfPgdOWqZou0lSIV/59FE//ngbGxbY5NbRFDrOSGNIip5gya7w6Ur3TqfljUyfyzd5Q93DZokifIJJsm2+hdS186tKJHu9dHaiMmH2ri+rGYo1/J98uowodO7LUNyu5CFRleedofLyOwefaS5XMXGz/D6uH1Ic5XLquAAAAAElFTkSuQmCC'

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
      let item = data.pop()
      // mapbox bounds: https://stackoverflow.com/a/35715102/1407622
      let bounds = new mapboxgl.LngLatBounds()
      if(item.customZoom) item.zoom = item.customZoom // mapbox takes
      let mapOptions = Object.assign({
        container: item.id,
        style: 'mapbox://styles/mapbox/streets-v9',
      }, options, item.options)

      let map = new mapboxgl.Map(mapOptions)

      // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
      // https://docs.mapbox.com/help/tutorials/add-points-pt-1/
      let geoJSON = {
        type: "FeatureCollection",
        features: item.locations.map(location => toGeoJSONFeature(location, mapOptions, bounds)),
      };

      map.fitBounds(bounds, {
        maxZoom: 12,
        padding: 30, // in px, to make markers on the top edge visible
      })

      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());

      // Add geolocate control to the map.
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
      }));

      map.on('load', function() {

        map.addSource("features", {
          type: "geojson",
          data: geoJSON,
          cluster: mapOptions.useCluster,
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
              "icon-allow-overlap": true, // draw overlapping images (to be consistent with Google Map) when clustering is off
              // "text-field": "{title}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              // "text-offset": [0, -1.6],
              // "text-anchor": "top"
            }
          });

          if(mapOptions.useCluster) {
            map.loadImage(ClusterIconDefault, function(error, image) {
              if (error) throw error;
              map.addImage('cluster-custom', image);

              map.addLayer({
                id: "clusters",
                type: "symbol",
                source: "features",
                filter: ["has", "point_count"],
                layout: {
                  "icon-image": "cluster-custom",
                  "icon-allow-overlap": true,
                  "text-allow-overlap": true,
                  "text-ignore-placement": true,
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
                  "text-size": 12,
                  "icon-allow-overlap": true,
                  "text-allow-overlap": true,
                  "text-ignore-placement": true,
                }
              });

              // inspect a cluster on click
              map.on('click', 'clusters', function (e) {
                let features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                let clusterId = features[0].properties.cluster_id;
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
            });
          }

          // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/

          // When a click event occurs on a feature in the places layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          map.on('click', 'unclustered-point', function (e) {
            let description = e.features[0].properties.description;
            if(!description) return;

            let coordinates = e.features[0].geometry.coordinates.slice();

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

    function toGeoJSONFeature(location, mapOptions, bounds) {
      let position = [location.longitude, location.latitude]; // order as in GEOJson
      bounds.extend(position);
      if (!mapOptions.showMarker) return false;

      let feature = {
        geometry: {
          type: "Point",
          coordinates: position,
        },
        type: "Feature",
      };

      if (mapOptions.showMarkerPopup) {
        let url = markerUrl(mapOptions.baseUrl, location.url)

        let description = `<div class="map-info-window"><h4>${location.title}</h4>`;
        if (location.popup_html.length > 0) {
          description += location.popup_html;
        } else {
          let imageTag =
            location.image.length > 0 &&
            '<img src="' + location.image + '" alt="' + location.title + '"/>'
          if (url.length > 0) {
            let linkContent = imageTag || location.url_text || 'View'
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
