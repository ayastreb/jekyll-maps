require "spec_helper"

describe Jekyll::Maps::GoogleMapTag do
  let(:site) { make_site }

  before do
    site.process
  end

  context "full page rendering" do
    let(:content) { File.read(dest_dir("page.html")) }

    it "builds javascript" do
      expect(content).to match(%r!#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}!)
      expect(content).to match(%r!(London|Paris)!)
    end

    it "includes external js only once" do
      expect(content.scan(%r!maps\.googleapis\.com!).length).to eq(1)
    end
  end

  context "options rendering" do
    let(:page)    { make_page }
    let(:site)    { make_site }
    let(:context) { make_context(:page => page, :site => site) }
    let(:tag)     { "google_map" }
    let(:options) { "id:foo width:100 height:50% class:baz,bar ignored:bad" }
    let(:output)  do
      Liquid::Template.parse("{% #{tag} #{options} %}").render!(context, {})
    end

    it "renders attributes" do
      expect(output).to match(%r!div id='foo' width='100' height='50%' class='baz bar'!)
    end
  end
end
