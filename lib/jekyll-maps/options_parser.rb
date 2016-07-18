module Jekyll
  module Maps
    class OptionsParser
      OPTIONS_SYNTAX = %r!([^\s]+)\s?:\s?([^\s]+)!

      class << self
        def parse(raw_options)
          options = { :filters => {} }
          raw_options.scan(OPTIONS_SYNTAX).each do |key, value|
            value = value.split(",") if value.include?(",")
            options[:filters][key] = value
          end
          options
        end
      end
    end
  end
end
