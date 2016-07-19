require "spec_helper"

describe Jekyll::Maps::OptionsParser do
  context "parses filters" do
    it "ignores extra whitespaces" do
      actual   = Jekyll::Maps::OptionsParser.parse(" foo_key : bar moo :  baz")
      expected = {
        "foo_key" => "bar",
        "moo"     => "baz"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses single argument" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo:bar")
      expected = {
        "foo" => "bar"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses multiple arguments" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo:bar moo:baz")
      expected = {
        "foo" => "bar",
        "moo" => "baz"
      }

      expect(actual[:filters]).to eq(expected)
    end

    it "parses multiple values in argument" do
      actual   = Jekyll::Maps::OptionsParser.parse("foo:bar,baz")
      expected = {
        "foo" => %w(bar baz)
      }

      expect(actual[:filters]).to eq(expected)
    end
  end
end
