module Jekyll
  module Maps
    class JsApi
      class << self
        def prepend_api_code(doc)
          doc.output.prepend(template.render!)
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
            File.expand_path("./js_api.html", File.dirname(__FILE__))
          end
        end
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  if doc.output =~ %r!#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}!
    Jekyll::Maps::JsApi.prepend_api_code(doc)
  end
end
