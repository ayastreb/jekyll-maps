require "spec_helper"

describe Jekyll::Maps::GoogleMapTag do
  let(:site) { make_site }
  before { site.process }

  context "full page rendering" do
    let(:content) { File.read(dest_dir("page.html")) }

    it "builds javascript" do
      expect(content).to match(%r!#{Jekyll::Maps::GoogleMapTag::JS_LIB_NAME}!)
      expect(content).to match(%r!(London|Paris)!)
    end

    it "does not include external js directly (should be lazy loaded)" do
      expect(content.scan(%r!maps\.googleapis\.com!).length).to eq(0)
    end

    it "registers Google Maps for lazy loading" do
      expect(content).to match(%r!js.src = "//maps.google.com/maps/!)
    end

    it "renders API key" do
      expect(content).to match(%r!maps/api/js\?key=GOOGLE_MAPS_API_KEY!)
    end

    it "provides fallback method when IntersectionObserver is
          not implemented/supported (older browsers)" do
      expect(content).to match(%r!('IntersectionObserver' in window)!)
    end
  end

  context "marker cluster disabled" do
    let(:site) do
      make_site({
        "maps" => {
          "google" => {
            "marker_cluster" => {
              "enabled" => false
            }
          }
        }
      })
    end
    let(:content) { File.read(dest_dir("page.html")) }
    before :each do
      site.process
    end

    it "does not load marker cluster external script" do
      expect(content).not_to match(%r!script.*src=.*markerclusterer\.js!)
    end
  end

  context "marker cluster enabled by default" do
    let(:site) { make_site }
    let(:content) { File.read(dest_dir("page.html")) }
    before :each do
      site.process
    end

    it "does load marker clusterer external script" do
      expect(content).to match(%r!script.*src=.*markerclusterer\.js!)
    end
  end

  context "options rendering" do
    let(:page) { make_page }
    let(:site) { make_site }
    let(:context) { make_context(:page => page, :site => site) }
    let(:tag) { "google_map" }

    context "render all attributes" do
      let(:options) do
        "id='foo' width='100' height='50%' class='baz,bar' ignored='bad' zoom='5'"
      end
      let(:output) do
        Liquid::Template.parse("{% #{tag} #{options} %}").render!(context, {})
      end

      it "renders attributes" do
        expected = %r!div id='foo' style='width:100px;height:50%;'
                        class='baz bar jekyll-map'!
        expect(output).to match(expected)
      end

      it "renders custom zoom setting" do
        expected = %r!"customZoom":5!
        expect(output).to match(expected)
      end
    end

    context "render default dimensions" do
      let(:options) { "id='foo'" }
      let(:output) do
        Liquid::Template.parse("{% #{tag} #{options} %}").render!(context, {})
      end

      it "renders dimensions with default values" do
        width    = Jekyll::Maps::GoogleMapTag::DEFAULT_MAP_WIDTH
        height   = Jekyll::Maps::GoogleMapTag::DEFAULT_MAP_HEIGHT
        expected = %r!div id='foo' style='width:#{width}px;height:#{height}px;'!
        expect(output).to match(expected)
      end
    end
  end
end
