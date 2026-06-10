# Visual Question Answering (VQA) System

An AI-powered Visual Question Answering (VQA) web application that allows users to upload an image and ask questions about its content. The system analyzes the image using computer vision and AI techniques to generate accurate and context-aware answers.

## Features

- Upload images for analysis
- Ask natural language questions about images
- AI-generated answers based on image content
- Modern and responsive user interface
- Fast image processing
- User-friendly experience
- Secure environment variable support

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend & Database
- Supabase

### AI & Computer Vision
- Visual Question Answering (VQA)
- Machine Learning
- Computer Vision

## Project Structure

```text
viz-ask-any-main/
├── public/
├── src/
├── supabase/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
https://github.com/23se02ml110-krija/Visual-Question-Answering-System.git
```

### 2. Navigate to Project Folder

```bash
cd viz-ask-any-main
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file and add your API keys and configuration.

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### 5. Run the Project

```bash
npm run dev
```

### 6. Open in Browser

```text
http://localhost:5173
```

## Usage

1. Upload an image.
2. Enter a question related to the image.
3. Click the "Get Answer" button.
4. View the AI-generated response.

## Future Improvements

- Support multiple image formats
- Real-time object detection
- Voice-based questions
- Multi-language support
- Advanced AI models

## Author

Developed by Krija

## License

This project is intended for educational and research purposes.
