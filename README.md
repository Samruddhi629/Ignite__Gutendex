# 📚 Gutendex Library – 2 Page Book App

A simple 2-page web application to browse and read books using the Gutendex API.
The app is designed with a dark theme and focuses on clean navigation and smooth user experience.

---

## 🌙 Theme & Design

* Dark theme used throughout the application
* Clean and minimal UI
* Easy-to-read colors and layout
* Works smoothly on desktop, tablet, and mobile

---

## 📄 Pages Overview

### **Page 1 – Category Selection**

* Shows the app title
* Displays 8 book categories:

  * Fiction
  * Mystery
  * Romance
  * History
  * Science
  * Fantasy
  * Adventure
  * Philosophy
* User selects one category to continue

---

### **Page 2 – Book List**

* Opens after selecting a category
* Shows books related to that category
* Includes:

  * Search bar
  * Back button
  * Book cards with cover images
* Clicking a book opens it in a new tab

---

## 🔍 Core Features

### 1. Category Filtering

* Books load based on selected category
* Category stays active even when searching

### 2. Search Function

* Search by book title or author name
* Works inside the selected category
* Automatically updates results while typing

### 3. Infinite Scrolling

* More books load automatically when scrolling down
* No page reloads
* Stops when no more data is available

### 4. Book Opening Priority

When a book is clicked:

1. Opens **HTML version** if available
2. Else opens **PDF version**
3. Else opens **Text version**
4. Shows alert if no readable version exists

### 5. Image Handling

* Only books with cover images are shown
* If an image fails to load, a fallback background appears

---

## ⚙️ How the App Works

1. User opens the website
2. Selects a category
3. App loads books related to that category
4. User can:

   * Scroll to load more books
   * Search within the same category
   * Click a book to read
5. Book opens in a new browser tab

---

## 🎯 Key Features Summary

* Two-page structure (Category → Books)
* Dark mode UI
* Category-based browsing
* Search within category
* Infinite scrolling
* Book format priority handling
* Error handling and loading states
* Fully responsive design
* Simple and clean user experience

---

## ✅ What This Project Demonstrates

* Proper use of API data
* Clean UI/UX design
* State handling between pages
* Filtering and searching logic
* Pagination handling
* Real-world front-end application structure

---

## 🚀 Ready to Use

Just open the project in your browser and start exploring books.

This project fully meets the assignment requirements and follows a clean, understandable structure.

