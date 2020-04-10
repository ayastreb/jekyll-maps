module Jekyll
  module Maps
    class GoogleMapApi
      HEAD_END_TAG = %r!</[\s\t]*head>!
      BODY_END_TAG = %r!</[\s\t]*body>!

      class << self
        def prepend_api_code(doc)
          @config = doc.site.config
          if doc.output =~ HEAD_END_TAG
            # Insert API code before header's end if this document has one.
            doc.output.gsub!(HEAD_END_TAG, %(#{api_code}#{Regexp.last_match}))
          else
            doc.output.prepend(api_code)
          end
        end

        def prepend_google_api_code(doc)
          @config = doc.site.config
          if doc.output =~ BODY_END_TAG
            # Insert API code before body's end if this document has one.
            doc.output.gsub!(BODY_END_TAG, %(#{google_api_code}#{Regexp.last_match}))
          else
            doc.output.prepend(api_code)
          end
        end

        private
        def api_code
          <<HTML
<script type='text/javascript'>
  #{js_lib_contents}
</script>
HTML
        end

        private
        def google_api_code
          <<HTML
#{load_google_maps_api}
#{load_marker_cluster}
HTML
        end

        private
        def load_google_maps_api
          api_key = @config.fetch("maps", {})
            .fetch("google", {})
            .fetch("api_key", "")
          <<HTML
          <script async defer>


            // Load maps only when DOM is loaded
            document.addEventListener("DOMContentLoaded", function() {
                if (window.google && window.google.maps && jekyllMaps) {
                  // Maps script already loaded -> Execute callback method
                  jekyllMaps.initializeMap();
                } else if (!('IntersectionObserver' in window) ||
                !('IntersectionObserverEntry' in window) ||
                !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
                  // Intersection Observer -> Backup solution : load maps now
                  lazyLoadGoogleMap();
                } else {
                  // Google Maps not loaded & Intersection Observer working -> Enable it
                  enableMapsObserver();
                }
            });

            function enableMapsObserver() {
              // Enable Observer on all Maps
              var maps = document.getElementsByClassName('jekyll-map');

              const observer = new IntersectionObserver(function(entries, observer) {
                // Test if one of the maps is in the viewport
                var isIntersecting = typeof entries[0].isIntersecting === 'boolean' ? entries[0].isIntersecting : entries[0].intersectionRatio > 0;
                if (isIntersecting) {
                  lazyLoadGoogleMap();
                  observer.disconnect();
                }
              });

              for(var i = 0; i < maps.length; i++) {
                observer.observe(maps[i]);
              }
            }

            function lazyLoadGoogleMap() {
                // If google maps api script not already loaded
                if(!window.google || !window.google.maps) {
                  var fjs = document.getElementsByTagName('script')[0];
                  var js = document.createElement('script');
                  js.id = 'gmap-api';
                  js.setAttribute('async', '');
                  js.setAttribute('defer', '');
                  js.src = "//maps.google.com/maps/api/js?key=#{api_key}&callback=#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}.initializeMap";
                  fjs.parentNode.insertBefore(js, fjs);
                }
            }
          </script>
HTML
        end

        private
        def load_marker_cluster
          settings = @config.fetch("maps", {})
            .fetch("google", {})
            .fetch("marker_cluster", {})
          return unless settings.fetch("enabled", true)
          <<HTML
<script async defer src='https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js'
        onload='#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}.initializeCluster(#{settings.to_json})'></script>
HTML
        end

        private
        def js_lib_contents
          @js_lib_contents ||= begin
            File.read(js_lib_path)
          end
        end

        private
        def js_lib_path
          @js_lib_path ||= begin
            File.expand_path("./google_map_api.js", File.dirname(__FILE__))
          end
        end
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  if doc.output =~ %r!#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}!
    Jekyll::Maps::GoogleMapApi.prepend_api_code(doc)
    Jekyll::Maps::GoogleMapApi.prepend_google_api_code(doc)
  end
end
