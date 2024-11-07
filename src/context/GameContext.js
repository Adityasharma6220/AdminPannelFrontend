// GameContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState('default');
  const [data, setData] = useState(null);

  const fetchGameData = async (game) => {
    if (game === 'default') {
      setData(null);
      return;
    }
    
    try {
      const response = await axios.get(`/api/${game}/data`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  const changeGame = (game) => {
    setSelectedGame(game);
    fetchGameData(game);
  };

  return (
    <GameContext.Provider value={{ selectedGame, changeGame, data }}>
      {children}
    </GameContext.Provider>
  );
};
