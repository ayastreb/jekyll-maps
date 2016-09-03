# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "jekyll-maps/version"

Gem::Specification.new do |spec|
  spec.name          = "jekyll-maps"
  spec.summary       = "Jekyll Google Maps integration"
  spec.description   = "Google Maps support in Jekyll blog to easily embed maps with posts' locations"
  spec.version       = Jekyll::Maps::VERSION
  spec.authors       = ["Anatoliy Yastreb"]
  spec.email         = ["anatoliy.yastreb@gmail.com"]

  spec.homepage      = "https://github.com/ayastreb/jekyll-maps"
  spec.licenses      = ["MIT"]
  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r!^(test|spec|features)/!) }
  spec.require_paths = ["lib"]

  spec.add_dependency "jekyll", "~> 3.0"

  spec.add_development_dependency "rake", "~> 11.0"
  spec.add_development_dependency "rspec", "~> 3.5"
  spec.add_development_dependency "rubocop", "~> 0.41"
end
