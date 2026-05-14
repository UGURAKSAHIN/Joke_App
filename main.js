import JokeApi from "./joke_api.js";
import Unsplash from "./unsplash.js";
import Translate from "./translate.js";
import JokeStorage from "./storage.js";
import Screen from "./screen.js";

const jokeApi = new JokeApi();
const unsplash = new Unsplash();
const translate = new Translate();
const storage = new JokeStorage();
const screen = new Screen();

let currentJoke = null;
let currentImage = null;
let currentTranslation = null;
let currentCategory = null;

const getCategoryLabel = (category) => {
  return category || "Mixed";
};

const buildJokeRecord = (joke, image, translatedText) => {
  const category = joke.categories?.[0] || screen.getSelectedCategory();

  return {
    id: joke.id || `${Date.now()}`,
    value: joke.value,
    translatedText,
    url: joke.url,
    iconUrl: joke.icon_url,
    category: getCategoryLabel(category),
    imageUrl: image?.urls?.regular || "",
    imageAlt: image?.alt_description || "Random Unsplash image",
    createdAt: new Date().toISOString(),
  };
};

const renderJoke = (joke) => {
  currentJoke = joke;
  currentImage = joke.imageUrl || null;
  currentTranslation = joke.translatedText || null;
  currentCategory = joke.category || null;
  screen.renderJoke(joke, storage.isFavorite(joke.id));
};

const renderLists = () => {
  screen.renderLists(
    storage.getFavorites(),
    storage.getHistory(),
    renderJoke
  );
};

const loadCategories = async () => {
  try {
    const categories = await jokeApi.getCategories();
    screen.addCategories(categories);
  } catch (error) {
    screen.showStatus(
      "Failed to load categories, using mixed mode.",
      "warning"
    );
  }
};

const copyWithFallback = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";

  document.body.append(textarea);
  textarea.select();
  textarea.remove();
};

const copyCurrentJoke = async () => {
  if (!currentJoke) {
    screen.showStatus("Please get a joke first.", "warning");
    return;
  }

  const text = [
    currentJoke.value,
    currentJoke.translatedText ? `TR: ${currentJoke.translatedText}` : "",
    currentJoke.url,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      copyWithFallback(text);
    }

    screen.showStatus("Joke copied.", "success");
  } catch (error) {
    copyWithFallback(text);
    screen.showStatus("Joke copied.", "success");
  }
};

const toggleCurrentFavorite = () => {
  if (!currentJoke) {
    screen.showStatus("Please get a joke first.", "warning");
    return;
  }

  const saved = storage.toggleFavorite(currentJoke, currentImage, currentTranslation, currentCategory);
  screen.updateFavoriteButton(storage.isFavorite(currentJoke.id));
  renderLists();
  screen.showStatus(
    saved ? "Added to favorites." : "Removed from favorites.",
    "success"
  );
};

const renderLoadWarning = (imageFailed, translationFailed) => {
  if (imageFailed && translationFailed) {
    screen.showStatus(
      "Joke ready; failed to load image and translation.",
      "warning"
    );
    return;
  }

  if (imageFailed) {
    screen.showStatus("Joke ready; failed to load image.", "warning");
    return;
  }

  if (translationFailed) {
    screen.showStatus("Joke ready; failed to load translation.", "warning");
    return;
  }

  screen.showStatus("Joke ready.", "success");
};

const handleJokeClick = async () => {
  screen.setButtonLoading(true);
  screen.showStatus("Joke is being prepared...");

  try {
    const [jokeResult, imageResult] = await Promise.allSettled([
      jokeApi.getRandomJoke(screen.getSelectedCategory()),
      unsplash.getRandomImage(),
    ]);

    if (jokeResult.status === "rejected") {
      throw jokeResult.reason;
    }

    let translatedText = "";
    let translationFailed = false;

    if (screen.isTranslationEnabled()) {
      try {
        translatedText = await translate.translateText(jokeResult.value.value);
      } catch (error) {
        translationFailed = true;
      }
    }

    const image = imageResult.status === "fulfilled" ? imageResult.value : null;
    const joke = buildJokeRecord(jokeResult.value, image, translatedText);

    storage.addHistory(joke);
    renderJoke(joke);
    renderLists();
    renderLoadWarning(imageResult.status === "rejected", translationFailed);
  } catch (error) {
    screen.showStatus("Failed to load joke. Please try again.", "danger");
  } finally {
    screen.setButtonLoading(false);
  }
};

const init = async () => {
  renderLists();
  await loadCategories();
};

screen.dom.chuckButton.addEventListener("click", handleJokeClick);
screen.dom.copyButton.addEventListener("click", copyCurrentJoke);
screen.dom.favoriteButton.addEventListener("click", toggleCurrentFavorite);

init();
