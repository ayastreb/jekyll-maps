$LOAD_PATH.unshift File.expand_path("../../lib", __FILE__)
require "simplecov"
SimpleCov.start

require "jekyll"
require "jekyll-maps"

Jekyll.logger.log_level = :error

RSpec.configure do |config|
  config.run_all_when_everything_filtered = true
  config.filter_run :focus
  config.order = "random"

  SOURCE_DIR = File.expand_path("../fixtures", __FILE__)
  DEST_DIR   = File.expand_path("../dest", __FILE__)

  def source_dir(*files)
    File.join(SOURCE_DIR, *files)
  end

  def dest_dir(*files)
    File.join(DEST_DIR, *files)
  end

  CONFIG_DEFAULTS = {
    "source"      => source_dir,
    "destination" => dest_dir,
    "gems"        => ["jekyll-maps"],
    "collections" => ["my_collection"],
    "maps"        => {
      "google" => {
        "api_key" => "GOOGLE_MAPS_API_KEY"
      }
    }
  }.freeze

  def make_page(options = {})
    page      = Jekyll::Page.new(site, CONFIG_DEFAULTS["source"], "", "page.md")
    page.data = options
    page
  end

  def make_site(options = {})
    site_config = Jekyll.configuration(CONFIG_DEFAULTS.merge(options))
    Jekyll::Site.new(site_config)
  end

  def make_context(registers = {}, environments = {})
    Liquid::Context.new(
      environments,
      {},
      { :site => site, :page => page }.merge(registers)
    )
  end
end
