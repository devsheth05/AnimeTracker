// src/components/HomePage.js
import React from 'react';

function HomePage() {
  return (
    <div>
      <h1>Top 5 Anime</h1>
      <div>
        <h2>1. Naruto</h2>
        <textarea placeholder="Explain why Naruto is your top choice..."></textarea>
      </div>
      <div>
        <h2>2. Attack on Titan</h2>
        <textarea placeholder="Explain why Attack on Titan is your second choice..."></textarea>
      </div>
      <div>
        <h2>3. Demon Slayer</h2>
        <textarea placeholder="Explain why Demon Slayer is your third choice..."></textarea>
      </div>
      <div>
        <h2>4. Fullmetal Alchemist: Brotherhood</h2>
        <textarea placeholder="Explain why Fullmetal Alchemist is your fourth choice..."></textarea>
      </div>
      <div>
        <h2>5. My Hero Academia</h2>
        <textarea placeholder="Explain why My Hero Academia is your fifth choice..."></textarea>
      </div>
    </div>
  );
}

export default HomePage;
