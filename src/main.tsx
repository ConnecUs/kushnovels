
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx is being executed"); // Add logging to debug

// Get the root element
const root = document.getElementById('root');
console.log("Root element found:", root); // Check if root element is found

// Check if root element exists and render the app
if (root) {
  console.log("Creating root and rendering App"); // Track rendering process
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
