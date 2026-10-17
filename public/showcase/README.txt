Put student website screenshots in this folder.

Then add an entry to src/data/studentWebsites.js:

  {
    title: 'My Recipes Blog',
    url: 'https://example.com',
    student: 'Aarav Sharma',
    course: 'Web Design & Development',
    blurb: 'A responsive recipe site built with HTML, CSS and JavaScript.',
    screenshot: '/showcase/recipes.jpg',
  },

Rules:
- `url` must start with http:// or https://  (anything else is rejected)
- `screenshot` is optional - without it the card shows a generated tile
- Only publish sites with the student's permission
