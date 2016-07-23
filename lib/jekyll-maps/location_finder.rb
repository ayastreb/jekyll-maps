module Jekyll
  module Maps
    class LocationFinder
      def initialize(options)
        @documents = []
        @options   = options
      end

      def find(site, page)
        if @options[:flags][:on_page]
          @documents << page if location?(page)
        else
          site.collections.each { |_, collection| filter(collection.docs) }
          site.data.each { |_, docs| filter(docs) }
        end

        @documents.map do |document|
          {
            :latitude  => document["location"]["latitude"],
            :longitude => document["location"]["longitude"],
            :title     => document["title"],
            :url       => document["url"] || document.url
          }
        end
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
        @options[:filters].each do |key, value|
          return false if doc[key].nil? || doc[key] != value
        end
      end
    end
  end
end
