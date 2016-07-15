# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "jekyll-google-maps/version"

Gem::Specification.new do |spec|
  spec.name          = "jekyll-google-maps"
  spec.summary       = "Google Maps support in Jekyll blog to easily embed maps with posts' locations"
  spec.version       = Jekyll::GoogleMaps::VERSION
  spec.authors       = ["Anatoliy Yastreb"]
  spec.email         = ["anatoliy.yastreb@gmail.com"]

  spec.homepage      = "https://github.com/ayastreb/jekyll-google-maps"
  spec.licenses      = ["MIT"]
  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r!^(test|spec|features)/!) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r!^exe/!) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "jekyll", "~> 3.0"

  spec.add_development_dependency "rake"
  spec.add_development_dependency "rdoc"
  spec.add_development_dependency "rspec", "~> 3.0"
end
