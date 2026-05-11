export default class JokeStorage {
  constructor() {
    this.historyKey = "joke-app:history";
    this.favoritesKey = "joke-app:favorites";
    this.maxHistoryItems = 8;
  }

  read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
      console.error("Error reading storage:", error);
      return [];
    }
  }

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getHistory() {
    return this.read(this.historyKey);
  }

  addHistory(joke) {
    const history = this.getHistory().filter((item) => item.id !== joke.id);
    history.unshift(joke);
    this.write(this.historyKey, history.slice(0, this.maxHistoryItems));
  }

  clearHistory() {
    this.write(this.historyKey, []);
  }

  getFavorites() {
    return this.read(this.favoritesKey);
  }

  isFavorite(id) {
    return this.getFavorites().some((item) => item.id === id);
  }

  toggleFavorite(joke) {
    const favorites = this.getFavorites();
    const isSaved = favorites.some((item) => item.id === joke.id);

    if (isSaved) {
      this.write(
        this.favoritesKey,
        favorites.filter((item) => item.id !== joke.id)
      );
      return false;
    }

    this.write(this.favoritesKey, [joke, ...favorites]);
    return true;
  }
}
