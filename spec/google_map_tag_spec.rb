require "spec_helper"

describe Jekyll::Maps::GoogleMapTag do
  let(:site) { make_site }

  before do
    site.process
  end

  context "tag without options" do
    let(:content) { File.read(dest_dir("page.html")) }

    it "builds javascript" do
      expect(content).to match(%r!jekyllMaps!)
      expect(content).to match(%r!(London|Paris)!)
    end
  end
end
