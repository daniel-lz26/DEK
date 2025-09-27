// import { BrowserRouter,Route, Routes } from 'react-router-dom'
// import { Home } from './pages/home'
// import { NotFound } from './pages/NotFound'
// import { Profile } from './pages/profile'
// import { Stats } from './pages/stats'
// import { Friends } from './pages/friends'
// import { Shuffle } from './pages/shuffle'

// function App() {

//   return (
//     <>
//     <BrowserRouter> 
//       <Routes>
//   <Route index element={<Home />} />
//   <Route path="profile" element={<Profile />} />
//   <Route path="stats" element={<Stats />} />
//   <Route path="friends" element={<Friends />} />
//   <Route path="shuffle" element={<Shuffle />} />
//   <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//     </>
//   );
// }

// export default App

// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { ProfilePage } from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
