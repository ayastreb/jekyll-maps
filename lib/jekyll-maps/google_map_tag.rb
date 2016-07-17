module Jekyll
  module Maps
    class GoogleMapTag < Liquid::Tag
      def initialize(_tag_name, text, _tokens)
        super
      end

      def render(_context)
      end
    end
  end
end

Liquid::Template.register_tag("google_map", Jekyll::Maps::GoogleMapTag)
