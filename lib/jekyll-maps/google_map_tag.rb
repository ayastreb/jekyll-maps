module Jekyll
  module Maps
    class GoogleMapTag < Liquid::Tag
      def initialize(_, args, _)
        options = OptionsParser.parse(args)
        @finder = LocationFinder.new(options)
        super
      end

      def render(context)
        template.render!({
          "locations" => @finder.find(context.registers[:site]).to_json
        })
      end

      private
      def template
        @template ||= Liquid::Template.parse(template_contents)
      end

      private
      def template_contents
        @template_contents ||= begin
          File.read(template_path)
        end
      end

      private
      def template_path
        @template_path ||= begin
          File.expand_path("./google_map.html", File.dirname(__FILE__))
        end
      end
    end
  end
end

Liquid::Template.register_tag("google_map", Jekyll::Maps::GoogleMapTag)
