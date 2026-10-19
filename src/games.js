// Project descriptions supplied by the authors or checked against the linked source.
export const games = [
  {
    id:'cadavre', title:'Cadavre Exquis', author:'Zach Muhlbauer',
    github:'https://github.com/milwrite/cadavre-exquis',
    play:'https://cadavre.ailab-452.workers.dev/', accent:'cyan',
    teaser:'Write a poem one turn at a time with a language model',
    paragraphs:[
      'Cadavre Exquis is the Surrealist parlor game often called Exquisite Corpse in which each player writes or draws on a sheet, folds the page to hide the contribution, and passes only the last step in the sequence to the next player.',
      "This arcade version seats a language model at the table. Human players choose the table size, the model’s seat, and the word limit, and the browser shows only the latest fold. When the sheet is finally revealed, the model constructs a short close-reading analysis of the finished poem.",
    ],
  },
  {
    id:'jeopardy', title:'JeopardyLM', author:'Zach Muhlbauer',
    github:'https://github.com/milwrite/jeopardy-generator',
    play:'https://jeopardy.ailab-452.workers.dev/', accent:'violet',
    teaser:'Make a quiz board and question what you know',
    paragraphs:[
      'JeopardyLM is a customizable Jeopardy-style emulator for creating and playing quiz boards. A host supplies a system prompt, user input, optional reference material, provider settings, and model choice.',
      'The app can use local Ollama or external OpenRouter inference to batch-generate categories, clues, and answers for a full board. The hosted arcade uses CUNY AI Lab access with DeepSeek V4 Flash as its default.',
      'Players can edit generated clues, run a multiplayer game, handle Daily Doubles and Final Jeopardy, keep score, and export or import the board for reuse.',
    ],
  },
  {
    id:'cloze', title:'Cloze Reader', author:'Zach Muhlbauer',
    github:'https://github.com/milwrite/cloze-reader',
    play:'https://cloze.ailab-452.workers.dev/', accent:'pink',
    teaser:'Read closely and find the missing words',
    paragraphs:[
      'Cloze Reader turns Project Gutenberg passages into fill-in-the-blank rounds. Texts stream through the Hugging Face manu/project_gutenberg dataset. DeepSeek V4 Flash chooses blanked words rather than deleting fixed intervals, and the reader infers the missing terms from context.',
      "The chat panel offers constrained hints about part of speech, sentence role, word category, and synonymy. The project links Wilson Taylor’s cloze test to masked language modeling, then hands the predictive task back to human readers.",
    ],
  },
  {
    id:'haggle', title:'Haggle', author:'Stephen Zweibel',
    github:'https://github.com/szweibel/haggle',
    play:'https://zweibel.net/haggle/', accent:'amber',
    teaser:'Run a fantasy shop and bargain with local AI customers',
    paragraphs:[
      'Haggle is a little browser game where you run a fantasy item shop that comes saddled with a 2,500-gold debt, and you pay it off by buying stock wholesale, setting your prices, and bargaining with the customers who wander in.',
      'Every customer is played by an open-weight language model running entirely in your browser. Each one arrives with a personality, a hidden budget, and their own guess at what your goods are worth, so a sharp-eyed trader haggles very differently from a distracted errand boy.',
      'Under the hood it’s a demonstration of how to make small local models reliable: the model provides the banter while the game’s rules enforce the arithmetic, so the characters stay colorful without breaking roles.',
    ],
    note:'Uses WebGPU for local inference in a supported desktop browser.',
  },
  {
    id:'langames', title:'LanGames', author:'Stefano Morello',
    github:'https://github.com/smorello87/LanGames',
    play:'https://stefanomorello.com/langames/', accent:'lime',
    teaser:'Practice ten languages through five vocabulary and verb games',
    paragraphs:[
      'LanGames is an AI-powered multilingual language-learning platform that generates custom vocabulary and verb-conjugation data for ten languages: Italian, Spanish, French, German, Portuguese, Japanese, Chinese, Korean, Russian, and Arabic.',
      'Teachers and students can pick a language and difficulty level, and the app generates content for five browser games: Wordle, a memory match, a hangman-style Flower game, and two verb-conjugation wheels. Content is generated in a concurrent batch through LLM APIs.',
      'Users can share generated content via a short link that requires no API key, so teachers can generate content and share it with their students. The frontend is built in HTML5, CSS3, and vanilla JavaScript, storing settings and generated content in the browser’s localStorage.',
    ],
    credit:'Based on Beatrice Carnelutti’s Impariamo l’Italiano.',
  },
  {
    id:'cli-adventures', title:'CLI Adventures', author:'Zach Muhlbauer',
    github:'https://github.com/zmuhls/cli-adventures',
    play:'https://cli-adventures.ailab-452.workers.dev/', accent:'blue',
    teaser:'Learn terminal commands through a filesystem treasure hunt',
    paragraphs:[
      'CLI Adventures teaches command-line basics through a sequence of interactive challenges in a simulated terminal. Players explore a virtual filesystem, read clues, extract an archive, and return a stolen treasure to its rightful directory.',
      'The challenges introduce commands such as ls, cd, cat, pwd, mkdir, and mv. A current objective, contextual hints, command reference, and command history help players connect each instruction to its effect on files and folders.',
      'The terminal and filesystem run in JavaScript in the browser. Players can experiment with creating, copying, moving, and deleting game files. This game uses fixed rules and written challenges; no language model or API key is required.',
    ],
    note:'Progress lasts for the current tab and resets when the page reloads.',
  },
  {
    id:'chess-lm', title:'Chess / LM', author:'Zach Muhlbauer',
    github:'https://github.com/zmuhls/chess-lm',
    play:'https://chess-lm.ailab-452.workers.dev/', accent:'silver',
    teaser:'Play Stockfish and examine its replies with a language-model coach',
    paragraphs:[
      'Chess / LM pairs a browser chess game with a language-model coach. You play White against Stockfish, compare its candidate replies, and read a short explanation of what your move changed and what to consider next.',
      'Stockfish searches the position and selects the moves. The engine lines show its legal candidates, while the coach makes a separate model call to explain the supplied evidence. Players can compare those explanations with the board, test a different continuation, and ask where a plausible reading misses a tactical detail.',
    ],
    note:'The chess engine runs in your browser. Coaching needs an internet connection.',
  },
];
