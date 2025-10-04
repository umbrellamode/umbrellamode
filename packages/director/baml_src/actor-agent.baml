class Joke {
  joke string
}

function TellJoke(input: string) -> Joke {
  client "openai/gpt-4o-mini"
  prompt #"
    Tell a joke about: {{ input }}

    {{ ctx.output_format }}
  "#
}

test TellJokeTest {
  functions [TellJoke]
  args {
    input "Why did the chicken cross the road?"
  }
}