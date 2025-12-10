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

6. Run the Project
   As this is a free version to be able to use it must be added to our usermanagement page, so please reach out kayla if you'd like to be added!
    in order to host or run it locally we need your information including Name and Email of Spotify Account!
Use the following commands:

Install dependencies: pnpm install

Run the development server: pnpm run dev
