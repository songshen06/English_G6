# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development Server
```bash
# Start local HTTP server (port 3000 is recommended)
python3 -m http.server 3000
```

### Opening Test Pages
```bash
# Main application
open http://localhost:3000/index.html

# Test system with multiple question types
open http://localhost:3000/test.html

# Audio debugging tools
open http://localhost:3000/debug-audio.html
open http://localhost:3000/test-audio-simple.html
```

## Architecture Overview

### Core Components

**Main Flashcard System** (`index.html`, `script.js`, `style.css`)
- Primary learning application with flip cards
- `FlashcardApp` class handles vocabulary, phrases, and sentence patterns
- Uses Web Speech API for audio pronunciation
- LocalStorage for progress persistence

**Test System** (`test.html`, `test.js`, `test.css`)
- Comprehensive testing platform with 4 question types:
  1. **Vocabulary** - Multiple choice word definitions
  2. **Phrases** - Multiple choice phrase translations
  3. **Sentences** - Multiple choice sentence completions
  4. **Sentence Order** - Drag-and-drop sentence reconstruction (new feature)
- `TestSystem` class manages question generation, scoring, and results
- Enhanced result display with vocabulary explanations

**Data Layer** (`data.js`)
- Centralized data structure with 10 units covering Grade 6 English curriculum
- `flashcardData` object contains vocabulary, phrases, and sentences arrays
- Each item includes: `english`, `chinese`, `unit`, and `keyWords` (for sentences)

### Key Technical Features

**Audio System Integration**
- Web Speech API for text-to-speech functionality
- Audio queue management prevents overlapping speech
- Sentence pronunciation hints in drag-and-drop exercises
- Word-by-word audio feedback during interactions

**Drag-and-Drop Interface** (Sentence Order Questions)
- HTML5 Drag and Drop API implementation
- Multiple sentence boxes for word placement
- Bidirectional movement between word pool and sentence boxes
- Visual feedback during drag operations
- Automatic sentence validation upon word placement

**Responsive Design**
- CSS Grid and Flexbox for adaptive layouts
- Touch-friendly interface for mobile devices
- CSS3 animations and transitions for smooth interactions

## Data Structure Patterns

### Vocabulary/Phrase Items
```javascript
{ english: "how long", chinese: "多长", unit: 1 }
```

### Sentence Items (Enhanced for Explanations)
```javascript
{
    english: "How long is the Great Wall? It's more than forty thousand li long.",
    chinese: "长城有多长？它超过四万华里。",
    unit: 1,
    keyWords: ["Great Wall", "long", "more than", "thousand"]
}
```

## Audio Implementation Details

**Event Listener Pattern for Dynamic Elements**
When creating audio buttons dynamically (e.g., in sentence order questions):
```javascript
// Create button element
const audioBtn = document.createElement('button');
audioBtn.id = 'playAudioBtn';

// Add event listener BEFORE appending to DOM
audioBtn.addEventListener('click', () => {
    this.playSentenceAudio(sentence);
});
container.appendChild(audioBtn);
```

**Audio Queue Management**
- `addToAudioQueue()` - Queues audio items with 5-item limit
- `processAudioQueue()` - Sequential playback with 200ms delays
- `updateAudioButtonState()` - Visual feedback during playback

## Adding New Test Types

1. Add case to `generateQuestions()` method in `test.js`
2. Implement `generate[NewType]Question()` method
3. Create `display[NewType]Question()` method with HTML generation
4. Add corresponding validation in the results system
5. Update test setup HTML with new radio option

## CSS Organization

- `style.css` - Main flashcard application styles
- `test.css` - Test system specific styles including drag-and-drop interfaces
- Uses CSS custom properties for theming
- Mobile-first responsive design patterns