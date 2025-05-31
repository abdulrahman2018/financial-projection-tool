# Klubb / Klass Kalkylator - Swoopt

## Project Overview

The "Klubb / Klass Kalkylator" is a client-side, single-page web application designed for Swoopt. It functions as an interactive financial projection tool, primarily intended for mobile (landscape orientation) use. Users (e.g., sports clubs, classes) can input data regarding product sales and sponsorships to receive an estimated revenue projection visualized on a dynamic graph over a 36-month period.

The application was built based on a detailed client brief, including specific UI mockups, calculation formulas, and interaction requirements. No backend data storage is involved; all calculations and state management are handled on the client-side.

## Core Features

1.  **Multi-Page Flow:**
    *   **Page 1 (Initial Inputs):** Collects data on `Product sale price`, `Your money per sale`, `Number of club kids`, and `Total units sold`.
    *   **Auto-Calculated Field:** `Average sales per kid` is automatically calculated and displayed as read-only on Page 1 based on `Total units sold` / `Number of club kids`.
    *   **Page 2 (Sponsorship Input):** Collects data on `Sponsorships per kid`.
    *   **Page 3 (Graph Display):** Visualizes the projected revenue based on all inputs.
2.  **Custom Numeric Keypad:**
    *   All numeric input fields trigger a custom on-screen number pad instead of the device's native keyboard.
    *   The number pad includes digits (0-9), a Clear (C) button, a Backspace (DEL) button, and an "OK" button to confirm input.
    *   This ensures a consistent input experience, especially on mobile devices.
3.  **Dynamic Graph Visualization:**
    *   Uses Chart.js to render a combined bar and line chart.
    *   **Grey Line/Bars:** Represent cumulative and periodic revenue from product sales.
        *   Cumulative calculated every 6 months.
        *   Periodic bars represent 3-monthly revenue contributions.
    *   **Yellow Line/Bars:** Represent cumulative and periodic revenue from sponsorships.
        *   Cumulative calculated every 3 months.
        *   Periodic bars represent 3-monthly revenue contributions.
    *   The graph displays data over a 36-month period.
    *   Axes and tooltips are formatted for currency (SEK).
4.  **Responsive Design:**
    *   Primarily optimized for mobile landscape viewing.
    *   Styling ensures usability and readability on smaller screens.
5.  **Client-Side Logic:**
    *   All calculations and state are managed using JavaScript within the browser.
    *   Data is not persisted after the session ends.

## Technologies Used

*   **HTML5:**
    *   Semantic markup for structuring the application's pages, forms, and components (including the custom number pad).
*   **CSS3:**
    *   Styling the application with a dark theme and yellow accents, as per client mockups.
    *   **Flexbox & CSS Grid:** For layout management, ensuring responsiveness and proper alignment of elements, especially for the form grids and number pad.
    *   Media Queries: Specifically targeting landscape orientation and different screen sizes for optimal mobile experience.
*   **JavaScript (ES6+):**
    *   **DOM Manipulation:** To dynamically show/hide pages, update input field values, interact with the custom number pad, and update the UI based on user actions.
    *   **Event Handling:** Managing clicks on input fields, number pad buttons, and navigation buttons ("NEXT", "CALCULATE").
    *   **State Management:** Storing user inputs and calculated values locally within JavaScript variables/objects (`appState`).
    *   **Calculation Logic:** Implementing the precise financial formulas provided by the client for:
        *   Average sales per kid.
        *   Periodic and cumulative revenue for both product sales and sponsorships.
    *   **Custom Component Logic:** Building the functionality for the pop-up numeric keypad.
*   **Chart.js (vX.Y.Z - specify version if known, e.g., v3.9.1 or v4.x):**
    *   A JavaScript charting library used for creating the dynamic bar and line graph on Page 3.
    *   Configuration includes:
        *   Multiple dataset types (line and bar).
        *   Custom colors and styling for lines and bars.
        *   Linear X-axis (Months) and Y-axis (Revenue kr).
        *   Custom tooltips for displaying currency values.
        *   Dynamic scaling of the Y-axis based on data.
        *   Legend customization.
*   **Development Environment/Tools:**
    *   **Browser Developer Tools:** (e.g., Chrome DevTools) for debugging, testing responsiveness, and inspecting elements.
    *   **Text Editor/IDE:** (e.g., VS Code, Sublime Text) for writing code.
    *   **(Optional) Version Control:** Git (if used for managing code versions, even locally).

## Project Structure

## Setup and Usage

1.  Ensure all files (`index.html`, `style.css`, `script.js`, and `swoopt_logo.png` if applicable) are in the same directory.
2.  Open `index.html` in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).
3.  The application will load Page 1.
4.  Tap on an input field to bring up the custom number pad.
5.  Enter values using the number pad and press "OK".
6.  Navigate through the pages using the "NEXT" and "CALCULATE" buttons.
7.  The graph on Page 3 will update based on the entered values.

## Calculation Logic Summary (as per brief interpretation)

*   **Average Sales Per Kid:** `[Total units sold] / [Number of club kids]`
*   **Grey Line/Bars (Product Sales):**
    *   `Revenue Increment (per 6 months) = [Your money per sale] * [Total units sold]`
    *   `Periodic Bar Value (3-monthly) = Revenue Increment (per 6 months) / 2`
    *   Cumulative line increases by `Revenue Increment` every 6 months.
*   **Yellow Line/Bars (Sponsorships):**
    *   `Periodic Revenue (3-monthly) = [Sponsorships per kid] * [Number of club kids] * 0.68 * 10 * 3`
    *   Periodic bar value is this `Periodic Revenue`.
    *   Cumulative line increases by this `Periodic Revenue` every 3 months.

## Notes

*   This application is designed for demonstration and estimation purposes.
*   The interpretation of calculation formulas is based on the provided project brief.

