# Joke App

Joke App is a simple and entertaining frontend application that displays random Chuck Norris jokes with a clean, responsive, and interactive interface. Users can generate jokes instantly, translate them into Turkish, save favorites, and view recent joke history.

## Features

- Random Chuck Norris joke generator
- Category selection
- Refresh / new joke button
- Optional Turkish translation
- Unsplash image integration
- Favorites and recent jokes saved with LocalStorage
- Responsive user interface
- Fast and lightweight structure
- Simple and modern design

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Bulma
- Axios

## APIs

- Chuck Norris API: <https://api.chucknorris.io>
- MyMemory Translated API: <https://api.mymemory.translated.net>
- Unsplash Developers: <https://unsplash.com/developers>

## Installation

```bash
git clone https://github.com/UGURAKSAHIN/JokeApp.git
cd JokeApp
```

## Usage

Open `index.html` in your browser.

The Unsplash access key is configured in `config.js`. This is fine for a small frontend demo, but a production application should keep API keys behind a backend service.

## Project Structure

```text
JokeApp/
|-- config.js
|-- index.html
|-- joke_api.js
|-- main.js
|-- screen.js
|-- storage.js
|-- style.css
|-- translate.js
`-- unsplash.js
```

## Preview

![Joke App preview 1](https://github.com/user-attachments/assets/507556f1-c773-4718-a26d-b56da036f987)

![Joke App preview 2](https://github.com/user-attachments/assets/77a2f72f-6ecd-4f1f-8932-fd36133daf83)

![Joke App preview 3](https://github.com/user-attachments/assets/bb394c87-7fc4-40af-8250-27cfcf3a70d8)

## License

This project is licensed under the MIT License.
