// import React from 'react'
// // import Grid from './Grid'
// import './ChessBoard.css'

// const ChessBoard = () => {

//     const renderCell = () => {

//         const grid = [];

//         for(let row=0; row<8; row++){

//             for(let col=0; col<8; col++){
//                 const cellKey = row-col;
//                 const cellColor = (row+col)%2 === 0 ? 'white' : 'black'

//                 const cell = (
//                     <div
//                         key={cellKey}
//                         className="cell"
//                         style={{backgroundColor: cellColor }}
//                     ></div>
//                 );

//                 grid.push(cell)
//             }

//         }

//         return grid;
//     }




//   return (
//     <div className="outer">

//         <h2>CHESSBOARD</h2>

//         {/* <Grid/> */}
//         <div className="chessboard">{renderCell()}</div>
//     </div>
//   )
// }

// export default ChessBoard

import React from 'react'
import './ChessBoard.css'
import Grid from './Grid'


const ChessBoard = () => {
  return (
    <div>


        <h1 style={{color: 'black'}}>CHESSBOARD</h1>
        <Grid />


    </div>
  )
}

export default ChessBoard