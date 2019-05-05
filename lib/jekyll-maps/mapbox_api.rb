module Jekyll
  module Maps
    class MapboxApi
      HEAD_END_TAG = %r!</[\s\t]*head>!

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

        private
        def api_code
          <<HTML
<script type='text/javascript'>
  #{js_lib_contents}
</script>
#{load_mapbox_api}
#{load_marker_cluster}
HTML
        end

        private
        def load_mapbox_api
          access_token = @config.fetch("maps", {})
            .fetch("mapbox", {})
            .fetch("access_token", "")
          <<HTML

<script async defer src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js' onload='#{Jekyll::Maps::MapboxTag::JS_LIB_NAME}.initializeMap("#{access_token}")'></script>
<link async defer href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css' rel='stylesheet' />
<style>
  .marker {
    background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
HTML
        end

        private
        def load_marker_cluster
          settings = @config.fetch("maps", {})
            .fetch("google", {})
            .fetch("marker_cluster", {})
          return unless settings.fetch("enabled", true)
          <<HTML
<!-- <script async defer src='https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js'
        onload='#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}.initializeCluster(#{settings.to_json})'></script> //-->
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
            File.expand_path("./mapbox_api.js", File.dirname(__FILE__))
          end
        end
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  if doc.output =~ %r!#{Jekyll::Maps::MapboxTag::JS_LIB_NAME}!
    Jekyll::Maps::MapboxApi.prepend_api_code(doc)
  end
end
