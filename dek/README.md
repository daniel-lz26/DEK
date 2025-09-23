# What/Where is everything? 

SRC Folder - holds everything we are working on
Assets Folder - where images and downloaded files go
Components Folder - where we will have the majority of our files for text and sections of website
Pages Folder - holds the pages our website will hold (home & NotFound as of now)
lib Folder - functions/backend stuff

# Where / How do I get started?

1. If you want to add custom fonts or colors etc. go to index.css

2. For each section we want to create its own file, go to components and create a .JSX file for example 'Stats.jsx'. 

3. This file is where you will format and customize the look and text of it instead of having one file with all the text of the page. Because it's its own file before we start working on it we need to set it up so it's ready for export.

    ex. 
        export const stats = () => {
            Do your work here 
        }

4. After you finish your file we go to 'src/pages/home.jsx', and you import the file.

    ex. 
        import { Stats } from "../components/Stats"

5. Then you add it to the home function and you're done for the most part
    ex.
        <Stats />




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
