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

  context "looking for locations in data files with deep source" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data/france'") }
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

  context "looking for locations in data files with shallow source" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("src='_data'") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds locations in all data files" do
      expect(actual.find { |l| l[:title] == "Paris" }).to be_a(Hash)
      expect(actual.find { |l| l[:title] == "Madrid" }).to be_a(Hash)
    end
  end

  context "filtering locations" do
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
end
