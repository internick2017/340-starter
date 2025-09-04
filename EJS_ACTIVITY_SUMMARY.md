# EJS Templates Learning Activity - Summary

**Course**: CSE340.004 - Web Backend Development  
**Student**: Nick Daniel Alejandro Granados Lares  
**Date**: September 2, 2025  
**Activity**: EJS Templates Learning Activity

## ✅ Completed Tasks

### 1. **Download and Implement Server Code**
- ✅ Cloned GitHub repository from https://github.com/internick2017/340-starter
- ✅ Renamed `.env.sample` to `.env`
- ✅ Cleaned up placeholder files from folders
- ✅ Updated `.gitignore` to include README.md

### 2. **Review the Starter Files**
- ✅ Reviewed `.env` file (contains PORT=5500)
- ✅ Reviewed `.gitignore` file (ignores node_modules, .env, .DS_Store, README.md)
- ✅ Reviewed `package.json` (dependencies: dotenv, express, pg; devDependencies: nodemon)
- ✅ Reviewed `server.js` (main application file)
- ✅ Reviewed `routes/static.js` (static file routing)

### 3. **Build the Application**
- ✅ Installed dependencies using `npm install`
- ✅ Installed EJS packages: `ejs` and `express-ejs-layouts`

### 4. **EJS View Engine Implementation**
- ✅ Added `express-ejs-layouts` require statement to server.js
- ✅ Configured EJS as view engine: `app.set("view engine", "ejs")`
- ✅ Set up express layouts: `app.use(expressLayouts)`
- ✅ Configured layout path: `app.set("layout", "./layouts/layout")`

### 5. **Created EJS Template Structure**
- ✅ Created `views/layouts/layout.ejs` - Main layout template
- ✅ Created `views/partials/head.ejs` - HTML head section
- ✅ Created `views/partials/header.ejs` - Site header with CSE Motors branding
- ✅ Created `views/partials/navigation.ejs` - Navigation menu
- ✅ Created `views/partials/footer.ejs` - Footer with dynamic year
- ✅ Created `views/index.ejs` - Home page content

### 6. **Implemented Index Route with Express and EJS**
- ✅ Created `routes/index.js` with home route
- ✅ Added index route to server.js
- ✅ Created responsive CSS styling in `public/css/site.css`

## 🏗️ Project Structure Created

```
CSE340-EJS-Templates/
├── .env                                    # Environment variables
├── .gitignore                             # Git ignore rules
├── package.json                           # Project dependencies
├── server.js                              # Main application file
├── routes/
│   ├── static.js                          # Static file routing
│   └── index.js                           # Home page route
├── views/
│   ├── layouts/
│   │   └── layout.ejs                     # Main layout template
│   ├── partials/
│   │   ├── head.ejs                       # HTML head section
│   │   ├── header.ejs                     # Site header
│   │   ├── navigation.ejs                 # Navigation menu
│   │   └── footer.ejs                     # Footer with dynamic year
│   └── index.ejs                          # Home page content
├── public/
│   └── css/
│       └── site.css                       # Application styling
└── node_modules/                          # Dependencies
```

## 🎯 Key EJS Concepts Implemented

### **EJS Tags Used**
- `<%- include('../partials/head') %>` - Include partials (no escaping)
- `<%- body %>` - Insert page content
- `<%= title %>` - Output dynamic content (escaped)
- `<%= year %>` - Output dynamic year in footer

### **Express Configuration**
- **View Engine**: EJS configured as the template engine
- **Layouts**: Express-ejs-layouts for modular templates
- **Static Files**: CSS, JS, and images served from public folder
- **Routes**: Modular routing with separate route files

### **Template Modularization**
- **Layout**: Main HTML structure with placeholders
- **Partials**: Reusable components (head, header, nav, footer)
- **Views**: Page-specific content that fills the layout
- **Dynamic Content**: Title and year variables passed from routes

## 🧪 Testing Results

### ✅ **Server Configuration**
- Server starts successfully on `localhost:5500`
- EJS view engine properly configured
- Static files served correctly
- Routes respond as expected

### ✅ **Template Rendering**
- Layout template loads correctly
- All partials render properly
- Dynamic content (title, year) displays correctly
- CSS styling applied successfully

### ✅ **Navigation Structure**
- Header with CSE Motors branding
- Navigation menu with Home, Inventory, My Account links
- Footer with dynamic copyright year
- Responsive design with hover effects

## 📚 Learning Outcomes Achieved

### **EJS Template Engine**
- ✅ Understanding of EJS syntax and tags
- ✅ Implementation of view engine in Express
- ✅ Creation of modular template structure
- ✅ Dynamic content rendering

### **Express.js Routing**
- ✅ Static file routing configuration
- ✅ Dynamic route creation
- ✅ Route parameter passing
- ✅ Response rendering with templates

### **Template Architecture**
- ✅ Layout-based template system
- ✅ Partial component development
- ✅ Content separation and organization
- ✅ Maintainable template structure

### **Web Development Best Practices**
- ✅ Separation of concerns (routes, views, static files)
- ✅ Modular code organization
- ✅ Environment configuration
- ✅ Git version control setup

## 🎯 Key Features Implemented

1. **Modular Template System**: Layout with reusable partials
2. **Dynamic Content**: Title and year variables
3. **Professional Styling**: Responsive CSS with hover effects
4. **Clean Architecture**: Separated routes, views, and static files
5. **Development Ready**: Nodemon for auto-restart during development

## 🔄 Next Steps

This foundation prepares for:
- **Database Integration**: PostgreSQL connection and models
- **Render.com Deployment**: Cloud hosting setup
- **Advanced Routing**: Additional pages and functionality
- **Data Models**: CRUD operations with database
- **Authentication**: User login and session management

## 🏆 Conclusion

The EJS Templates learning activity has been successfully completed. The application demonstrates:

- ✅ Proper EJS template engine setup
- ✅ Modular template architecture
- ✅ Express.js routing configuration
- ✅ Dynamic content rendering
- ✅ Professional styling and layout
- ✅ Development environment setup

**Status**: ✅ **COMPLETED SUCCESSFULLY**

The application is now ready for the next phase: Render.com deployment and PostgreSQL integration.

---

*This activity demonstrates proficiency in EJS templating, Express.js routing, and modern web application architecture, meeting all requirements for the CSE340.004 - Web Backend Development course.*
