module Jekyll
  module GoogleMaps
    class GoogleMapTag < Liquid::Tag

    end
  end
end

Liquid::Template.register_tag('google_map', Jekyll::GoogleMaps::GoogleMapTag)
