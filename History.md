## 2.4.0
* support jekyll v4

## 2.3.0 / 2018-03-17

* customize popup link text (#34)
* do not use page url for multiple on page locations (#33)

## 2.2.0 / 2018-03-07

* implement custom marker icon (#30)
* fix external URL in marker

## 2.1.1 / 2018-01-25

* fixed JS lib injection in header (fix #31)

## 2.1.0 / 2018-01-10

* fixed base_url in marker url (fix #28)

## 2.0.4 / 2017-07-19

* allow multiple locations per document (fix #6)
* allow inline locations with map attributes, e.g. `{% google_map laititude='42.23323' longitude='3.213232' %}` (fix #23)

## 2.0.3 / 2017-05-17

* load locations from specific data file (fix #26)

## 2.0.2 / 2017-04-24

* allow multi-word filters (fix #25)

## 2.0.1 / 2017-04-11

* add option to hide markers (show_marker="false")
* do not show link in marker popup when no URL is set

## 2.0.0 / 2016-11-06

* change default behaviour to load location from current page
* removed on-page flag
* change attributes syntax to HTML-style

## 1.1.6 / 2016-09-07

* fix #15 - broken page if there is <header> tag used
* allow setting custom zoom level with `zoom:10` attribute

## 1.1.5 / 2016-09-03

* allow to disable marker popup on the map

## 1.1.4 / 2016-07-31

* open info window when marker is clicked

## 1.1.3 / 2016-07-28

* on-page map flag

## 1.1.2 / 2016-07-22

* configurable marker cluster

## 1.1.1 / 2016-07-20

* configure GoogleMaps API key from \_config.yml

## 1.1.0 / 2016-07-19

* add multiple maps to single page
* load external JavaScript asynchronously
* configure map element's id, CSS class and dimensions

## 1.0.2 / 2016-07-18

* fix script loading
* look for location coordinates in all collections

## 1.0.1 / 2016-07-17

* implement Google Maps tag
