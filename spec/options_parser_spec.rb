require "spec_helper"

describe Jekyll::Maps::OptionsParser do
  context "parses filters" do
    it "ignores extra whitespaces" do
      actual   = Jekyll::Maps::OptionsParser.parse(" foo_key = 'bar' moo  = 'baz'")
      expected = {
        "foo_key" => "bar",
        "moo"     => "baz"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses double quotes" do
      actual   = Jekyll::Maps::OptionsParser.parse('foo="bar"')
      expected = {
        "foo" => "bar"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses single argument" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo='bar'")
      expected = {
        "foo" => "bar"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses multiple arguments" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo='bar' moo='baz'")
      expected = {
        "foo" => "bar",
        "moo" => "baz"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses multiple values in argument" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo='bar,baz'")
      expected = {
        "foo" => %w(bar baz)
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses multiple words in argument" do
      actual = Jekyll::Maps::OptionsParser.parse("foo='bar baz' moo = 'mar maz'")
      expected = {
        "foo" => "bar baz",
        "moo" => "mar maz"
      }

      expect(actual[:filters]).to eq(expected)
    end
  end

  context "parses attributes" do
    it "parses predefined attributes" do
      actual   = Jekyll::Maps::OptionsParser.parse(
        "id='foo' width='100' height='50%' class='my-css-class,another-class'"
      )
      expected = {
        :id     => "foo",
        :width  => "100",
        :height => "50%",
        :class  => %w(my-css-class another-class)
      }

      expect(actual[:attributes]).to eq(expected)
    end
  end

  context "parses flags" do
    it "parses all allowed flags correctly" do
      actual   = Jekyll::Maps::OptionsParser.parse("no_cluster")
      expected = {
        :no_cluster => true
      }

      expect(actual[:flags]).to eq(expected)
    end
  end
end
