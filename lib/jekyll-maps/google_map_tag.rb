module Jekyll
  module Maps
    class GoogleMapTag < Liquid::Tag
      attr_accessor :context

      def initialize(_, args, _)
        unless args.empty?
          @filter_key   = args.split(":").first.strip
          @filter_value = args.split(":").last.strip
        end

        super
      end

      def render(context)
        @context = context
        template.render!({ "locations" => locations.to_json })
      end

      private
      def locations
        filter_posts.map do |post|
          {
            :latitude  => post["location"]["latitude"],
            :longitude => post["location"]["longitude"],
            :title     => post["title"],
            :url       => post.url
          }
        end
      end

      def filter_posts
        posts = context.registers[:site].posts.docs.reject do |post|
          post["location"].nil? || post["location"].empty?
        end
        if @filter_key
          posts.reject do |post|
            post[@filter_key].nil? || post[@filter_key] != @filter_value
          end
        else
          posts
        end
      end

      private
      def template
        @template ||= Liquid::Template.parse template_contents
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
          File.expand_path "./google_map.html", File.dirname(__FILE__)
        end
      end
    end
  end
end

Liquid::Template.register_tag("google_map", Jekyll::Maps::GoogleMapTag)
