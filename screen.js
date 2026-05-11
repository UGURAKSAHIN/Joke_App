export default class Screen {
  constructor() {
    this.dom = {
      categorySelect: document.querySelector("#category-select"),
      translateToggle: document.querySelector("#translate-toggle"),
      chuckButton: document.querySelector("#chuck-btn"),
      statusMessage: document.querySelector("#status-message"),
      welcomeState: document.querySelector("#welcome-state"),
      jokeCard: document.querySelector("#joke-card"),
      imageWrapper: document.querySelector("#image-wrapper"),
      randomImage: document.querySelector("#random-image"),
      jokeIcon: document.querySelector("#joke-icon"),
      jokeMeta: document.querySelector("#joke-meta"),
      jokeText: document.querySelector("#joke-text"),
      translationBox: document.querySelector("#translation-box"),
      translatedText: document.querySelector("#translated-text"),
      copyButton: document.querySelector("#copy-btn"),
      favoriteButton: document.querySelector("#favorite-btn"),
      sourceLink: document.querySelector("#source-link"),
      favoritesList: document.querySelector("#favorites-list"),
      historyList: document.querySelector("#history-list"),
    };
  }

  getSelectedCategory() {
    return this.dom.categorySelect.value;
  }

  isTranslationEnabled() {
    return this.dom.translateToggle.checked;
  }

  setButtonLoading(isLoading) {
    this.dom.chuckButton.classList.toggle("is-loading", isLoading);
    this.dom.chuckButton.disabled = isLoading;
  }

  showStatus(message, type = "info") {
    this.dom.statusMessage.textContent = message;
    this.dom.statusMessage.className = "help mt-3";

    if (type === "success") {
      this.dom.statusMessage.classList.add("has-text-success");
    }

    if (type === "warning") {
      this.dom.statusMessage.classList.add("has-text-warning");
    }

    if (type === "danger") {
      this.dom.statusMessage.classList.add("has-text-danger");
    }
  }

  addCategories(categories) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      this.dom.categorySelect.append(option);
    });
  }

  updateFavoriteButton(isFavorite) {
    this.dom.favoriteButton.textContent = isFavorite
      ? "Remove from Favorites"
      : "Add to Favorites";
    this.dom.favoriteButton.classList.toggle("is-light", !isFavorite);
  }

  renderJoke(joke, isFavorite = false) {
    this.dom.welcomeState.classList.add("is-hidden");
    this.dom.jokeCard.classList.remove("is-hidden");

    if (joke.imageUrl) {
      this.dom.randomImage.src = joke.imageUrl;
      this.dom.randomImage.alt = joke.imageAlt;
      this.dom.imageWrapper.classList.remove("is-hidden");
    } else {
      this.dom.randomImage.removeAttribute("src");
      this.dom.randomImage.alt = "";
      this.dom.imageWrapper.classList.add("is-hidden");
    }

    this.dom.jokeIcon.src = joke.iconUrl;
    this.dom.jokeMeta.textContent = `${joke.category} category`;
    this.dom.jokeText.textContent = joke.value;
    this.dom.sourceLink.href = joke.url;

    if (joke.translatedText) {
      this.dom.translatedText.textContent = joke.translatedText;
      this.dom.translationBox.classList.remove("is-hidden");
    } else {
      this.dom.translatedText.textContent = "";
      this.dom.translationBox.classList.add("is-hidden");
    }

    this.updateFavoriteButton(isFavorite);
  }

  renderList(container, items, emptyText, onSelect) {
    container.innerHTML = "";

    if (items.length === 0) {
      container.className = "panel-block app-empty-list";
      container.textContent = emptyText;
      return;
    }

    container.className = "panel-block";

    const list = document.createElement("div");
    list.className = "app-list";

    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "app-list-item";

      const meta = document.createElement("small");
      meta.textContent = `${this.formatDate(item.createdAt)} - ${item.category}`;

      const text = document.createElement("span");
      text.textContent = item.translatedText || item.value;

      button.append(meta, text);
      button.addEventListener("click", () => onSelect(item));
      list.append(button);
    });

    container.append(list);
  }

  renderLists(favorites, history, onSelect) {
    this.renderList(
      this.dom.favoritesList,
      favorites,
      "No favorites yet.",
      onSelect
    );
    this.renderList(this.dom.historyList, history, "No history yet.", onSelect);
  }

  formatDate(value) {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
      return "No date";
    }

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}
