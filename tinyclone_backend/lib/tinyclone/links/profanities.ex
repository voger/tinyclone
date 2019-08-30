defmodule TinyClone.Links.Profanities do
  @moduledoc """
  A list of words that should not be used as link identifiers.
  """

  @profanities ~w(ass asses asshole assholes bastard beastial beastiality beastility bestial bestiality bitch bitcher bitchers bitches bitchin bitching blowjob blowjobs clit cock cocks cocksuck cocksucked cocksucker cocksucking cocksucks cum cummer cumming cums cumshot cunilingus cunillingus cunnilingus cunt cuntlick cuntlicker cuntlicking cunts cyberfuc cyberfuck cyberfucked cyberfucker cyberfuckers cyberfucking damn dildo dildos dink dinks ejaculate ejaculated ejaculates ejaculating ejaculatings ejaculation fag fagging faggot faggs fagot fagots fags fart farted farting fartings farts farty felatio fellatio fingerfuck fingerfucked fingerfucker fingerfuckers fingerfucking fingerfucks fistfuck fistfucked fistfucker fistfuckers fistfucking fistfuckings fistfucks fuck fucked fucker fuckers fuckin fucking fuckings fuckme fucks fuk fuks gangbang gangbanged gangbangs gaysex goddamn hardcoresex hell horniest horny hotsex jack-off jerk-off jism jiz jizm kock kondum kondums kum kummer kumming kums kunilingus lust lusting mothafuck mothafucka mothafuckas mothafuckaz mothafucked mothafucker mothafuckers mothafuckin mothafucking mothafuckings mothafucks motherfuck motherfucked motherfucker motherfuckers motherfuckin motherfucking motherfuckings motherfucks nigger niggers orgasim orgasims orgasm orgasms phonesex phuk phuked phuking phukked phukking phuks phuq piss pissed pisser pissers pisses pissin pissing pissoff porn porno pornography pornos prick pricks pussies pussy pussys shit shited shitfull shiting shitings shits shitted shitter shitters shitting shittings shitty slut sluts smut spunk twat)

  def is_profanity?(string) do
    string
    |> String.downcase()
    |> profanity?()
  end

  Enum.each(@profanities, fn word ->
    defp profanity?(unquote(word)), do: unquote(true)
  end)

  defp profanity?(_), do: false
end
