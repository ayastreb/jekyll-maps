require "spec_helper"

describe Jekyll::Maps::LocationFinder do
  let(:site) { make_site }
  let(:page) { make_page }

  before :each do
    site.process
  end

  context "looking for locations in posts" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_posts'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds posts with location" do
      expect(actual).to all(be_a(Hash))
      expect(actual).to all(include(:latitude, :longitude, :title, :url))
    end

    it "finds location in post" do
      expect(actual.find { |l| l[:title] == "London" }).to be_a(Hash)
    end

    it "finds multiple locations in single post" do
      # there should be 3 locations in post: fixtures/_posts/2017-06-19-multi-locations.md
      barcelona_main = actual.find { |l| l[:title] == "Barcelona" }
      expect(barcelona_main).to be_a(Hash)
      expect(barcelona_main[:url]).to eq("")
      expect(barcelona_main[:latitude]).to eq(41.3948976)
      expect(barcelona_main[:longitude]).to eq(2.0787279)
      expect(barcelona_main[:image]).to eq("/main-img.jpg")

      barcelona_sagrada = actual.find { |l| l[:title] == "sagrada familia" }
      expect(barcelona_sagrada[:url]).to eq("")
      expect(barcelona_sagrada[:latitude]).to eq(41.4032671)
      expect(barcelona_sagrada[:longitude]).to eq(2.1739832)
      expect(barcelona_sagrada[:image]).to eq("/main-img.jpg")

      barcelona_url = actual.find { |l| l[:title] == "location with url" }
      expect(barcelona_url[:url]).to eq("/next-post")
      expect(barcelona_url[:url_text]).to eq("Next Post")
      expect(barcelona_url[:latitude]).to eq(41.3864518)
      expect(barcelona_url[:longitude]).to eq(2.1890757)
      expect(barcelona_url[:image]).to eq("/next-img.jpg")
    end

    it "skips posts without location" do
      actual.each do |location|
        expect(location).not_to include(:title => "post without location")
      end
    end
  end

  context "looking for locations in custom collections" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_my_collection'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds location in custom collections" do
      expect(actual.find { |l| l[:title] == "Tokyo" }).to be_a(Hash)
    end
  end

  context "looking for locations in data files with deep source (France)" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data/france/places.yml'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds location from France" do
      expect(actual.find { |l| l[:title] == "Paris" }).to be_a(Hash)
    end

    it "doesn't find location from Spain" do
      actual.each do |location|
        expect(location).not_to include(:title => "Madird")
      end
    end
  end

  context "looking for locations in data files with deep source (Spain)" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data/spain'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds location from Spain" do
      expect(actual.find { |l| l[:title] == "Madrid" }).to be_a(Hash)
    end

    it "doesn't find location from France" do
      actual.each do |location|
        expect(location).not_to include(:title => "Paris")
      end
    end
  end

  context "looking for locations in specific data file" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data/places.yaml'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds locations in all data files" do
      expect(actual.length).to eq(2)
      expect(actual.find { |l| l[:title] == "Tokyo" }).to be_a(Hash)
      expect(actual.find { |l| l[:title] == "New York" }).to be_a(Hash)
    end
  end

  context "looking for locations in data files with shallow source" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds locations in all data files" do
      expect(actual.find { |l| l[:title] == "Paris" }).to be_a(Hash)
      expect(actual.find { |l| l[:title] == "Madrid" }).to be_a(Hash)
    end
  end

  context "filtering posts by location" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_posts' country='de'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds only German locations" do
      expect(actual.empty?).to be_falsey
      actual.each do |location|
        expect(location).to include(:title => "Berlin")
      end
    end
  end

  context "filtering data by location (state filter first)" do
    search_data_for_pa_places("state='PA' src='_data'")
  end

  context "filtering data by location (src filter first)" do
    search_data_for_pa_places("src='_data' state='PA'")
  end

  context "by default look for locations on current page" do
    let(:location) { { "location" => { "latitude" => 1, "longitude" => -1 } } }
    let(:page)     { make_page(location) }
    let(:options)  { Jekyll::Maps::OptionsParser.parse("") }
    let(:finder)   { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)   { finder.find(site, page) }

    it "finds only location from given page" do
      expect(actual.length).to eq(1)
      expect(actual.first[:latitude]).to eq(location["location"]["latitude"])
      expect(actual.first[:longitude]).to eq(location["location"]["longitude"])
    end
  end

  context "skip url if location does not have it" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data/no_url'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds location without link" do
      location = actual.find { |l| l[:title] == "No link" }
      expect(location).to be_a(Hash)
      expect(location[:url]).to eq("")
    end
  end

  context "take location from inline attributes first" do
    let(:options) do
      attrs = %w(
        latitude='42.2'
        longitude='3.2'
        marker_title='inline marker'
        marker_img='/marker-img.jpg'
        marker_url='/marker-url'
      )
      Jekyll::Maps::OptionsParser.parse(attrs.join(" "))
    end
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds only location from attributes" do
      expect(actual.empty?).to be_falsey
      expect(actual.length).to eq(1)
      location = actual.find { |l| l[:title] == "inline marker" }
      expect(location).to be_a(Hash)
      expect(location[:latitude]).to eq("42.2")
      expect(location[:longitude]).to eq("3.2")
      expect(location[:title]).to eq("inline marker")
      expect(location[:image]).to eq("/marker-img.jpg")
      expect(location[:url]).to eq("/marker-url")
    end
  end
end
