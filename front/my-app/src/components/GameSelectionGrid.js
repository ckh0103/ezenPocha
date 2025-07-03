import React from 'react';

const GameSelectionGrid = ({ games, selectedTable, onOpenGameRequest, currentTableInfo }) => {

const handleGameClick = (game) => {
  onOpenGameRequest(game.id, game.title, selectedTable, currentTableInfo);
};

  return (
    <div className="menu-grid">
      {games.map((game) => (
        <div
          key={game.id}
          className="menu-item"
          onClick={() => handleGameClick(game)}
        >
          <img src={game.image} alt={game.title} />
          <div className="item-name">{game.title}</div>
        </div>
      ))}
    </div>

  );
};

export default GameSelectionGrid;