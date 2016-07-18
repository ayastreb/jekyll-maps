require "spec_helper"

describe Jekyll::Maps::GoogleMapTag do
  let(:site) { make_site }

  before do
    site.process
  end

  context "tag without options" do
    let(:content) { File.read(dest_dir("page_no_options.html")) }

    it "builds javascript" do
      expect(content).to match(%r!jekyllMaps!)
    end

    it "finds posts with location" do
      expect(content).to match(%r!Berlin!)
      expect(content).to match(%r!London!)
    end

    it "skips posts without location" do
      expect(content).not_to match(%r!post without location!)
    end
  end

  context "tag with attribute filter" do
    let(:content) { File.read(dest_dir("page_filter_attribute.html")) }

    it "finds only post with matching attribute" do
      expect(content).to match(%r!Berlin!)
      expect(content).not_to match(%r!London!)
    end
  end
end
