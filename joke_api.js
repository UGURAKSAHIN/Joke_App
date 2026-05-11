export default class JokeApi {
  constructor() {
    this.url = "https://api.chucknorris.io";
    this.axiosInstance = window.axios.create({
      baseURL: this.url,
    });
  }

  async getCategories() {
    try {
      const response = await this.axiosInstance.get("/jokes/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching joke categories:", error);
      throw error;
    }
  }

  async getRandomJoke(category = "") {
    try {
      const response = await this.axiosInstance.get("/jokes/random", {
        params: category ? { category } : {},
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching joke:", error);
      throw error;
    }
  }
}

export async function createJokeApi(category = "") {
  return new JokeApi().getRandomJoke(category);
}
