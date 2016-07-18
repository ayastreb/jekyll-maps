require "spec_helper"

describe Jekyll::Maps::OptionsParser do
  it "ignores extra whitespaces" do
    actual   = Jekyll::Maps::OptionsParser.parse(" foo_key : bar moo :  baz")
    expected = {
      :filters => {
        "foo_key" => "bar",
        "moo" => "baz"
      }
    }

    expect(actual).to eq(expected)
  end

  it "parses single argument" do
    actual   = Jekyll::Maps::OptionsParser.parse("foo:bar")
    expected = {
      :filters => {
        "foo" => "bar"
      }
    }

    expect(actual).to eq(expected)
  end

  it "parses multiple arguments" do
    actual   = Jekyll::Maps::OptionsParser.parse("foo:bar moo:baz")
    expected = {
      :filters => {
        "foo" => "bar",
        "moo" => "baz"
      }
    }

    expect(actual).to eq(expected)
  end

  it "parses multiple values in argument" do
    actual   = Jekyll::Maps::OptionsParser.parse("foo:bar,baz")
    expected = {
      :filters => {
        "foo" => %w(bar baz)
      }
    }

    expect(actual).to eq(expected)
  end
end
