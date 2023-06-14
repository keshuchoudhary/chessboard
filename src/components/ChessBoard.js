import React from 'react'
import './ChessBoard.css'
import Grid from './Grid'


const ChessBoard = () => {
  return (
    <div>

        <br />
        {/* <h1 style={{color: 'black'}}>CHESSBOARD</h1> */}
        <h1 style={{color: 'black'}}>2 - Player Chess Game</h1>
        <br/>

        <Grid />


    </div>
  )
}

export default ChessBoard