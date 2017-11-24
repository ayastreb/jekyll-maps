# Jekyll Maps

[![Gem Version](https://badge.fury.io/rb/jekyll-maps.svg)](https://badge.fury.io/rb/jekyll-maps)
[![Build Status](https://travis-ci.org/ayastreb/jekyll-maps.svg?branch=master)](https://travis-ci.org/ayastreb/jekyll-maps)
[![Code Climate](https://codeclimate.com/github/ayastreb/jekyll-maps/badges/gpa.svg)](https://codeclimate.com/github/ayastreb/jekyll-maps)
[![Test Coverage](https://codeclimate.com/github/ayastreb/jekyll-maps/badges/coverage.svg)](https://codeclimate.com/github/ayastreb/jekyll-maps/coverage)
[![Dependency Status](https://gemnasium.com/badges/github.com/ayastreb/jekyll-maps.svg)](https://gemnasium.com/github.com/ayastreb/jekyll-maps)

Jekyll Maps is a plugin that allows you to easily create different maps on your Jekyll site pages.
It allows you to select which points to display on the map with different filters.

GoogleMaps Marker Clusterer can be used if you have many points within close proximity.

## Installation

1. Add the following to your site's `Gemfile`:


```ruby
gem 'jekyll-maps'
```

2. Add the following to your site's `_config.yml`:


```yml
plugins:
  - jekyll-maps
```

## Usage

### Configure Google API Key

To be able to use Google Maps you need to obtain
[API Key](https://developers.google.com/maps/documentation/javascript/get-api-key).

Once you have your API Key you need to add it to Jekyll's `_config.yml`:

```yml
maps:
  google:
    api_key: <YOUR_KEY>
```

### Data Source

First, add location information to your posts YAML front-matter:

```yml
location:
  latitude: 51.5285582
  longitude: -0.2416807
```

You can specify multiple locations per post:

```yml
location:
  - latitude: 51.5285582
    longitude: -0.2416807
  - latitude: 52.5285582
    longitude: -2.2416807
  - title: custom marker title
    image: custom marker image
    url: custom marker url
    latitude: 51.5285582
    longitude: -0.2416807
```

Alternatively, you can add location info to your custom collection's documents or even in data
files:

```yml
- title: Paris
  url: http://google.fr
  location:
    latitude: 48.8587741
    longitude: 2.2074741

- title: Madrid
  url: http://google.es
  location:
    latitude: 40.4378698
    longitude: -3.8196204
```

By default this plugin will display location from the page it's placed on:

```
{% google_map %}
```

But you can use src attribute to load locations from other places, like posts, collections or data
files!

For example, this map will show locations from all posts from 2016:

```
{% google_map src="_posts/2016" %}
```

This map will show locations from a collection called 'my_collection':

```
{% google_map src="_collections/my_collection" %}
```

This map will show locations from all data files located in 'my_points' sub-folder:

```
{% google_map src="_data/my_points" %}
```

You can configure map's dimensions and assign custom CSS class to the element:

```
{% google_map width="100%" height="400" class="my-map" %}
```

You can also just set marker coordinates directly in tag attributes:

```
{% google_map latitude="48.8587741" longitude="2.2074741" marker_title="My Location" marker_img="/img.jpg" marker_url="/my-location.html" %}
```

This will create a map with single marker in given location. `marker_title`, `marker_img` and
`marker_url` attributes are optional and current page's data will be used by default.

### Filters

You can also filter which locations to display on the map!<br/> For instance, following tag will
only display locations from documents which have `lang: en` in their front-matter data.

```
{% google_map src="_posts" lang="en" %}
```

### Marker Cluster

By default [Marker Clusterer](https://github.com/googlemaps/js-marker-clusterer) is enabled. If you
have many markers on the map, it will group them and show icon with the count of markers in each
cluster -
[see example](https://googlemaps.github.io/js-marker-clusterer/examples/advanced_example.html).

If you don't want to use marker cluster, you can disable it globally in `_config.yml`:

```yml
maps:
  google:
    marker_cluster:
      enabled: false
```

Or you can disable it per single map tag:

```
{% google_map no_cluster %}
```

If you have any questions or proposals - open up an
[issue](https://github.com/ayastreb/jekyll-maps/issues/new)!

## Examples

Want to see it in action? Check out [Demo Page](https://ayastreb.me/jekyll-maps/#examples)!

## Contributing

1. Fork it (https://github.com/ayastreb/jekyll-maps/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

[MIT](https://github.com/ayastreb/jekyll-maps/blob/master/LICENSE). Feel free to use, copy or
distribute it.
