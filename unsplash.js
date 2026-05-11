import { APP_CONFIG } from "./config.js";

export default class Unsplash {
  constructor() {
    this.url = "https://api.unsplash.com";
    this.clientId = APP_CONFIG.unsplashAccessKey || "";
    this.axiosInstance = window.axios.create({
      baseURL: this.url,
      headers: {
        Authorization: `Client-ID ${this.clientId}`,
      },
    });
  }

  async getRandomImage() {
    try {
      if (!this.clientId) {
        throw new Error("Unsplash access key is missing.");
      }

      const response = await this.axiosInstance.get("/photos/random", {
        params: {
          query: "funny",
          orientation: "landscape",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  }
}

export async function createUnsplash() {
  return new Unsplash().getRandomImage();
}
