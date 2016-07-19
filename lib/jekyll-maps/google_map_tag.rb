module Jekyll
  module Maps
    class GoogleMapTag < Liquid::Tag
      JS_LIB_NAME = "jekyllMaps".freeze

      def initialize(_, args, _)
        @args   = OptionsParser.parse(args)
        @finder = LocationFinder.new(@args)
        super
      end

      def render(context)
        locations = @finder.find(context.registers[:site])
        map_id    = @args[:attributes][:id] || SecureRandom.uuid

        <<HTML
<div id='#{map_id}'></div>
<script type='text/javascript'>
  #{JS_LIB_NAME}.create('#{map_id}', #{locations.to_json});
</script>
HTML
      end
    end
  end
end

Liquid::Template.register_tag("google_map", Jekyll::Maps::GoogleMapTag)
