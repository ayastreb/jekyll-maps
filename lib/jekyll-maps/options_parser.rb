module Jekyll
  module Maps
    class OptionsParser
      class << self
        def parse(raw_options)
          options = { :filters => {} }
          raw_options.strip.split(" ").each do |pair|
            key   = pair.split(":").first.strip
            value = pair.split(":").last.strip
            value = value.split(",") if value.include?(",")
            options[:filters][key] = value
          end
          options
        end
      end
    end
  end
end
