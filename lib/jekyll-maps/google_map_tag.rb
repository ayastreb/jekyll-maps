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
        @args[:attributes][:id] ||= SecureRandom.uuid

        <<HTML
<div #{render_attributes}></div>
<script type='text/javascript'>
  #{JS_LIB_NAME}.create('#{@args[:attributes][:id]}', #{locations.to_json});
</script>
HTML
      end

      private
      def render_attributes
        attributes = @args[:attributes].map do |attribute, value|
          value = value.join(" ") if value.is_a?(Array)
          %(#{attribute}='#{value}')
        end
        attributes.join(" ")
      end
    end
  end
end

Liquid::Template.register_tag("google_map", Jekyll::Maps::GoogleMapTag)
