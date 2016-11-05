module Jekyll
  module Maps
    class LocationFinder
      def initialize(options)
        @documents = []
        @options   = options
      end

      def find(site, page)
        if @options[:filters].empty?
          @documents << page if location?(page)
        else
          site.collections.each { |_, collection| filter(collection.docs) }
          site_data(site).each { |_, items| traverse(items) }
        end

        convert
      end

      private
      def site_data(site)
        return {} unless data_source?

        path = @options[:filters]["src"].scan(%r!_data\/([^\/]+)!).join(".")
        return site.data if path.empty?

        data = OpenStruct.new(site.data)
        data[path]
      end

      private
      def data_source?
        filters = @options[:filters]
        filters.key?("src") && filters["src"].start_with?("_data")
      end

      private
      def traverse(items)
        return filter(items) if items.is_a?(Array)

        items.each { |_, children| traverse(children) } if items.is_a?(Hash)
      end

      private
      def filter(docs)
        docs.each do |doc|
          @documents << doc if location?(doc) && match_filters?(doc)
        end
      end

      private
      def location?(doc)
        !doc["location"].nil? && !doc["location"].empty?
      end

      private
      def match_filters?(doc)
        @options[:filters].each do |filter, value|
          if filter == "src"
            return true unless doc.respond_to?(:relative_path)
            return false unless doc.relative_path.start_with?(value)
          elsif doc[filter].nil? || doc[filter] != value
            return false
          end
        end
      end

      private
      def convert
        @documents.map do |document|
          {
            :latitude  => document["location"]["latitude"],
            :longitude => document["location"]["longitude"],
            :title     => document["title"],
            :url       => document["url"] || document.url,
            :image     => document["image"] || ""
          }
        end
      end
    end
  end
end
