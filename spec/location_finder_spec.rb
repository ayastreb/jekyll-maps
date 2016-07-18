require "spec_helper"

describe Jekyll::Maps::LocationFinder do
  let(:site) { make_site }

  before do
    site.process
  end

  context "looking for locations" do
    let(:options) { { :filters => {} } }
    let(:finder) { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual) { finder.find(site) }

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
    let(:options) { { :filters => { "country" => "de" } } }
    let(:finder) { Jekyll::Maps::LocationFinder.new(options) }
    let(:actual) { finder.find(site) }

    it "finds only German locations" do
      expect(actual.empty?).to be_falsey
      actual.each do |location|
        expect(location).to include(:title => "Berlin")
      end
    end
  end
end
