module Jekyll
  module Maps
    class LocationFinder
      def initialize(options)
        @options = options
      end

      def find(site)
        matching_documents(site).map do |document|
          {
            :latitude  => document["location"]["latitude"],
            :longitude => document["location"]["longitude"],
            :title     => document["title"],
            :url       => document.url
          }
        end
      end

      private
      def matching_documents(site)
        documents = []
        site.collections.each do |_, collection|
          collection.docs.each do |doc|
            documents << doc if location?(doc) && match_filters?(doc)
          end
        end
        documents
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
