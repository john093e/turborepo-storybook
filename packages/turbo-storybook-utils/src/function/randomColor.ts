/**
 * Generates a random color.
 */
export function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }
  