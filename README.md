# SAT Learning App

A gamified SAT geometry practice application that rewards students with video game time for correct answers. Includes integrated Khan Academy learning resources to help students master concepts.

## Features

- **Gamification**: Earn video game minutes for correct answers
- **Progressive Learning**: 3 difficulty levels with 26 micro-concepts
- **Streak Bonuses**: Extra rewards for consecutive correct answers
- **XP & Leveling**: Level up from Beginner to Grandmaster
- **Khan Academy Integration**: Contextual help with videos and practice exercises
- **Clean Modern UI**: Responsive design that works on all devices

## How It Works

1. Answer SAT geometry questions
2. First attempt correct = 5 min game time + 100 XP
3. Build streaks for bonus rewards
4. Get stuck? Click "Learn This Concept" for Khan Academy resources
5. Watch videos, practice, and try again
6. Master concepts and level up!

## Reward System

### Base Rewards
- First attempt: 5 minutes + 100 XP
- Second attempt: 3 minutes + 60 XP
- Third attempt: 1 minute + 30 XP

### Streak Bonuses
- 3 in a row: +1 minute
- 5 in a row: +2 minutes
- 10 in a row: +5 minutes
- 20 in a row: +10 minutes

### Time Multipliers (Stack!)
- Weekend practice: 1.5x
- Morning practice: 1.25x
- Hard mode: 2x
- Timed challenge: 1.5x

## Concept Coverage

The app covers 26 geometry concepts across 8 skill categories:
- Lines & Angles
- Triangles
- Right Triangles & Trigonometry
- Quadrilaterals
- 3D Geometry
- Circles
- Similarity & Proportions
- Combined Shapes

## Khan Academy Integration

When students struggle with questions, the app provides:
- Simple explanations in plain language
- Key formulas highlighted
- Prerequisites showing what to learn first
- Direct links to Khan Academy video lessons
- Practice exercises with estimated time
- Common mistakes to avoid

## Local Development

1. Clone this repository
2. Open `index.html` in a web browser
3. No build step required - it's pure HTML, CSS, and JavaScript!

## Deployment

This app can be deployed as a static site to:
- Render
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Files Structure

```
sat-learning-app/
├── index.html                      # Main HTML file
├── styles.css                      # All styles and animations
├── app.js                          # Application logic
├── khan-academy-lessons.json       # Learning resources database
├── question-concept-mapping.json   # Question metadata
├── questions.md                    # All 50 SAT questions
├── answers.md                      # Answer key
├── explanations.md                 # Detailed explanations
├── concept-breakdown.md            # Learning path structure
├── gamification-system.md          # Complete reward rules
├── reward-calculator.js            # Reward calculation logic
├── IMPLEMENTATION-GUIDE.md         # Technical implementation guide
└── HELP-SYSTEM-README.md           # Help system documentation
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- All modern browsers with ES6 support

## License

MIT

## Credits

- SAT questions based on College Board practice materials
- Learning resources linked to Khan Academy
- Built with vanilla JavaScript, HTML5, and CSS3
