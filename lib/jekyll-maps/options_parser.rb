module Jekyll
  module Maps
    class OptionsParser
      OPTIONS_SYNTAX     = %r!([^\s]+)\s*=\s*['"]+([^\s'"]+)['"]+!
      ALLOWED_FLAGS      = %w(
        no_cluster
      ).freeze
      ALLOWED_ATTRIBUTES = %w(
        id
        width
        height
        class
        show_popup
        zoom
      ).freeze

      class << self
        def parse(raw_options)
          options = {
            :attributes => {},
            :filters    => {},
            :flags      => {}
          }
          raw_options.scan(OPTIONS_SYNTAX).each do |key, value|
            value = value.split(",") if value.include?(",")
            if ALLOWED_ATTRIBUTES.include?(key)
              options[:attributes][key.to_sym] = value
            else
              options[:filters][key] = value
            end
          end
          ALLOWED_FLAGS.each do |key|
            options[:flags][key.to_sym] = true if raw_options.include?(key)
          end
          options
        end
      end
    end
  end
end
