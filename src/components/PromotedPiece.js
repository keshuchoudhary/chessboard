import React from 'react';

const PromotedPiece = (props) => {

  const pieceImages = {
    white: {
      king: require('../assets/white-pieces/king.svg').default,
      queen: require('../assets/white-pieces/queen.svg').default,
      bishop: require('../assets/white-pieces/bishop.svg').default,
      rook: require('../assets/white-pieces/rook.svg').default,
      pawn: require('../assets/white-pieces/pawn.svg').default,
      knight: require('../assets/white-pieces/knight.svg').default,
      // Add the remaining piece images for white
    },
    black: {
      king: require('../assets/black-pieces/king.svg').default,
      queen: require('../assets/black-pieces/queen.svg').default,
      bishop: require('../assets/black-pieces/bishop.svg').default,
      rook: require('../assets/black-pieces/rook.svg').default,
      pawn: require('../assets/black-pieces/pawn.svg').default,
      knight: require('../assets/black-pieces/knight.svg').default,
      // Add the remaining piece images for black
    },
  };

  const {onPieceSelect} = props;

  const promotedPieces = ['rook', 'knight', 'bishop', 'queen'];

  return (
    <div>
      <h3>Promoted Pieces</h3>
      {promotedPieces.map((piece) => (
        <img onClick={() => onPieceSelect(piece)} src={pieceImages[props.color][piece]} alt={piece} style={{cursor:'pointer'}} key={piece} />
      ))}
    </div>
  );
};

export default PromotedPiece;
