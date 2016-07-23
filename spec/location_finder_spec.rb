require "spec_helper"

describe Jekyll::Maps::LocationFinder do
  let(:site) { make_site }
  let(:page) { make_page }

  before :each do
    site.process
  end

  context "looking for locations" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds posts with location" do
      expect(actual).to all(be_a(Hash))
      expect(actual).to all(include(:latitude, :longitude, :title, :url))
    end

    it "skips posts without location" do
      actual.each do |location|
        expect(location).not_to include(:title => "post without location")
      end
    end

    it "finds location in custom collections" do
      expect(actual.find { |l| l[:title] == "Tokyo" }).to be_a(Hash)
    end

    it "finds location in data files" do
      expect(actual.find { |l| l[:title] == "Paris" }).to be_a(Hash)
    end
  end

  context "filtering locations" do
    let(:options) { Jekyll::Maps::OptionsParser.parse("country:de") }
    let(:finder)  { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)  { finder.find(site, page) }

    it "finds only German locations" do
      expect(actual.empty?).to be_falsey
      actual.each do |location|
        expect(location).to include(:title => "Berlin")
      end
    end
  end

  context "looking for on_page locations" do
    let(:location) { { "location" => { "latitude" => 1, "longitude" => -1 } } }
    let(:page)     { make_page(location) }
    let(:options)  { Jekyll::Maps::OptionsParser.parse("on_page") }
    let(:finder)   { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual)   { finder.find(site, page) }

    it "finds only location from given page" do
      expect(actual.length).to eq(1)
      expect(actual.first[:latitude]).to eq(location["location"]["latitude"])
      expect(actual.first[:longitude]).to eq(location["location"]["longitude"])
    end
  end
end
