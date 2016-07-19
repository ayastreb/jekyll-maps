require "spec_helper"

describe Jekyll::Maps::GoogleMapTag do
  let(:site) { make_site }

  before do
    site.process
  end

  context "tag without options" do
    let(:content) { File.read(dest_dir("page.html")) }

    it "builds javascript" do
      expect(content).to match(%r!#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}!)
      expect(content).to match(%r!(London|Paris)!)
    end

    it "includes external js only once" do
      expect(content.scan(%r!maps\.googleapis\.com!).length).to eq(1)
    end
  end
end
