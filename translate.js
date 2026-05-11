export default class Translate {
  constructor() {
    this.url = "https://api.mymemory.translated.net";
    this.axiosInstance = window.axios.create({
      baseURL: this.url,
    });
  }

  async translateText(text, targetLanguage = "tr", sourceLanguage = "en") {
    if (!text) {
      return "";
    }

    try {
      const response = await this.axiosInstance.get("/get", {
        params: {
          q: text,
          langpair: `${sourceLanguage}|${targetLanguage}`,
        },
      });

      return response.data.responseData.translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      throw error;
    }
  }
}

export async function createTranslate(
  text,
  targetLanguage = "tr",
  sourceLanguage = "en"
) {
  return new Translate().translateText(text, targetLanguage, sourceLanguage);
}
