function sad(): string {
  const sadEmojis = ["🥲", "😢", "😭", "😥", "😓", "😔", "🙁"];
  return sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
}

const RandomEmoji = { sad };

export default RandomEmoji;
