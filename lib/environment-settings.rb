module Jekyll
  class EnvironmentVariablesGenerator < Generator
    def generate(site)
      site.config['google_maps_api_key'] = ENV['GOOGLE_MAPS_API_KEY']
    end
  end
end
