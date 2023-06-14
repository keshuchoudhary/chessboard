import React, { useState, useEffect } from 'react'
import './Grid.css'
import PromotedPiece from './PromotedPiece';

const Grid = () => {


    // pieceImages is a nested object which holds the images of all type of chess pieces
    const pieceImages = {
        white: {
          king: require('../assets/white-pieces/king.svg').default,
          queen: require('../assets/white-pieces/queen.svg').default,
          bishop: require('../assets/white-pieces/bishop.svg').default,
          rook: require('../assets/white-pieces/rook.svg').default,
          pawn: require('../assets/white-pieces/pawn.svg').default,
          knight: require('../assets/white-pieces/knight.svg').default,
        },
        black: {
          king: require('../assets/black-pieces/king.svg').default,
          queen: require('../assets/black-pieces/queen.svg').default,
          bishop: require('../assets/black-pieces/bishop.svg').default,
          rook: require('../assets/black-pieces/rook.svg').default,
          pawn: require('../assets/black-pieces/pawn.svg').default,
          knight: require('../assets/black-pieces/knight.svg').default,
        },
    };

    
    // "chessboard" state variable which is a 2-D array of dimension 8x8, which holds info of each cell, i.e. null or (type, color, img)
    const [chessboard, setChessboard] = useState([

        // Rows 0 and 1 (black pieces)
        // Row 0 (black pieces (i.e. rook, knight, bishop, queen, king, bishop, knight, rook))
        [
            { type: 'rook', color: 'black', img: pieceImages.black.rook},
            { type: 'knight', color: 'black', img: pieceImages.black.knight},
            { type: 'bishop', color: 'black', img: pieceImages.black.bishop},
            { type: 'queen', color: 'black', img: pieceImages.black.queen},
            { type: 'king', color: 'black', img: pieceImages.black.king},
            { type: 'bishop', color: 'black', img: pieceImages.black.bishop},
            { type: 'knight', color: 'black', img: pieceImages.black.knight},
            { type: 'rook', color: 'black', img: pieceImages.black.rook},
        ],
        // Row 1 (black pawns)
        Array(8).fill({type: 'pawn', color: 'black', img: pieceImages.black.pawn}),
        // Rows 2 to 5 (empty squares)
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),

        // Rows 6 and 7 (white pieces)
        // Row 6 (white pawns)
        Array(8).fill({type: 'pawn', color: 'white', img: pieceImages.white.pawn}),
        // Row 7 (white pieces (i.e. rook, knight, bishop, queen, king, bishop, knight, rook))
        [
            { type: 'rook', color: 'white', img: pieceImages.white.rook},
            { type: 'knight', color: 'white', img: pieceImages.white.knight},
            { type: 'bishop', color: 'white', img: pieceImages.white.bishop},
            { type: 'queen', color: 'white', img: pieceImages.white.queen},
            { type: 'king', color: 'white', img: pieceImages.white.king},
            { type: 'bishop', color: 'white', img: pieceImages.white.bishop},
            { type: 'knight', color: 'white', img: pieceImages.white.knight},
            { type: 'rook', color: 'white', img: pieceImages.white.rook},
        ]
    ])
    

    // "shouldGetValidMovesExecuted" state variable is of type boolean whose value is set to true, in order to execute getValidMoves() function
    const [shouldGetValidMovesExecuted, setShouldGetValidMovesExecuted] = useState(false)

    // "whichPieceTurn" state variable holds the color of the current player's chess pieces. Initially set to color "white" and after each move it changes alternatively between "black" & "white"
    const [whichPieceTurn, setWhichPieceTurn] = useState("white")

    // "recentPieceClicked" state variable is a object holding info related to the piece which recently got clicked
    const [recentPieceClicked, setRecentPieceClicked] = useState({
        value: false,
        type: '',
        color: '',
        row: -1,
        col: -1,
        validMoves: [],
    })

    // "showPromotionModal" state variable is boolean, when set to 'true' indicates/signifies the window should open for selecting pawn promotion
    const [showPromotionModal, setShowPromotionModal] = useState(false) 

    // "selectedPromotedPiece" state variable holds the value of 'type' of piece selected for pawn promotion
    const [selectedPromotedPiece, setSelectedPromotedPiece] = useState(null)

    // handlePromotionSelection() function sets the selectedPromotedPiece value when a piece gets selected for pawn promotion
    const handlePromotionSelection = (piece) => {
        setSelectedPromotedPiece(piece);
    }

    // "currentCellClicked" state variable holds the info of row no. and col no. when pawn wants to reach last row. By this currentCellClicked variable we can update our chessboard scenario in useEffect hook
    const [currentCellClicked, setCurrentCellClicked] = useState({
        row: -1,
        col: -1,
    })

    // "castlingInfo" state variable is an object holding information about rooks and kings, that whether they got displaced from initial position or not. "castlingInfo" variable is helpful while performing castling
    const [castlingInfo, setCastlingInfo] = useState({
        br00: false,
        br07: false,
        bk04: false,
        wr70: false,
        wr77: false,
        wk74: false,
    })

    // "chessboardHistory" state variable is an array(which can be considered as a stack also), whose elements are the different chessboard scenarios (whenever any move is made, it will lead chessboard to a different scenario)
    const [chessboardHistory, setChessboardHistory] = useState([]);

    // "lastPawnMove" state variable is an object for storing info particularly related to en-passant move/rule. If any pawn piece moves directly 2 moves then info of this "lastPawnMove" object gets updated
    const [lastPawnMove, setLastPawnMove] = useState({
        value: false,
        sourceRow: -1,
        sourceCol: -1,
        targetRow: -1,
        targetCol: -1,
        color: '',
    })


// ----- Below are the six functions for getting valid moves of all type of pieces in chess, irrespective of whether the move will lead to check or not

    const getValidMovesOfPawn = (row, col, color, chessboard) => {
        const validMoves=[];


        if(color=="black"){

            if(chessboard[row+1][col]==null){
                validMoves.push({row: row+1, col: col})
                if((row+2<7) && chessboard[row+2][col]==null && row==1){
                    validMoves.push({row: row+2, col: col})
                }
            }
            if(col!=0 && chessboard[row+1][col-1]!=null && chessboard[row+1][col-1].color=="white"){
                validMoves.push({row: row+1, col: col-1})
            }
            if(col!=7 && chessboard[row+1][col+1]!=null && chessboard[row+1][col+1].color=="white"){
                validMoves.push({row: row+1, col: col+1})
            }

        }
        else if(color=="white"){

            if(chessboard[row-1][col]==null){
                validMoves.push({row: row-1, col: col})
                if((row-2>0) && chessboard[row-2][col]==null && row==6){
                    validMoves.push({row: row-2, col: col})
                }
            }
            if(col!=0 && chessboard[row-1][col-1]!=null && chessboard[row-1][col-1].color=="black"){
                validMoves.push({row: row-1, col: col-1})
            }
            if(col!=7 && chessboard[row-1][col+1]!=null && chessboard[row-1][col+1].color=="black"){
                validMoves.push({row: row-1, col: col+1})
            }

        }


        // En-passant move
        if(lastPawnMove.value==true && ( (color=='white' && row==3) || (color=='black' && row==4) ) && (color!=chessboard[lastPawnMove.targetRow][lastPawnMove.targetCol]) ){
            if(col-1==lastPawnMove.targetCol || col+1==lastPawnMove.targetCol){
                if(color=='white'){
                    validMoves.push({row: row-1, col: lastPawnMove.targetCol})
                }
                else if(color=='black'){
                    validMoves.push({row: row+1, col: lastPawnMove.targetCol})
                }
            }
        }
        
        return validMoves;
    }

    const getValidMovesOfRook = (row, col, color, chessboard) => {
        const validMoves=[]

        for(let i=col-1; i>=0; i--){
            if(chessboard[row][i]==null){
                validMoves.push({row: row, col: i})
            }
            else{
                if(chessboard[row][i].color=="black" && color=="white"){
                    validMoves.push({row: row, col: i})
                }
                if(chessboard[row][i].color=="white" && color=="black"){
                    validMoves.push({row: row, col: i})
                }
                break;
            }
        }

        for(let i=col+1; i<8; i++){
            if(chessboard[row][i]==null){
                validMoves.push({row: row, col: i})
            }
            else{
                if(chessboard[row][i].color=="black" && color=="white"){
                    validMoves.push({row: row, col: i})
                }
                if(chessboard[row][i].color=="white" && color=="black"){
                    validMoves.push({row: row, col: i})
                }
                break;
            }
        }

        for(let i=row-1; i>=0; i--){
            if(chessboard[i][col]==null){
                validMoves.push({row: i, col: col})
            }
            else{
                if(chessboard[i][col].color=="black" && color=="white"){
                    validMoves.push({row: i, col: col})
                }
                if(chessboard[i][col].color=="white" && color=="black"){
                    validMoves.push({row: i, col: col})
                }
                break;
            }
        }

        for(let i=row+1; i<8; i++){
            if(chessboard[i][col]==null){
                validMoves.push({row: i, col: col})
            }
            else{
                if(chessboard[i][col].color=="black" && color=="white"){
                    validMoves.push({row: i, col: col})
                }
                if(chessboard[i][col].color=="white" && color=="black"){
                    validMoves.push({row: i, col: col})
                }
                break;
            }
        }

        return validMoves;
    }

    const getValidMovesOfKnight = (row, col, color, chessboard) => {
        const validMoves=[]
        
        let tempMoves=[]
        tempMoves.push({row: row-2, col: col-1})
        tempMoves.push({row: row-2, col: col+1})
        tempMoves.push({row: row-1, col: col-2})
        tempMoves.push({row: row-1, col: col+2})
        tempMoves.push({row: row+1, col: col-2})
        tempMoves.push({row: row+1, col: col+2})
        tempMoves.push({row: row+2, col: col-1})
        tempMoves.push({row: row+2, col: col+1})

        tempMoves = tempMoves.filter((move) => {
            if(move.row >7 || move.row<0 || move.col >7 || move.col<0){
                return false;
            }
            if(chessboard[move.row][move.col]!=null && (chessboard[move.row][move.col].color==color)){
                return false;
            }
            return true;
        });

        for (let i = 0; i < tempMoves.length; i++) {
            const move = tempMoves[i];
            validMoves.push(move);
        }

        return validMoves;
    }

    const getValidMovesOfBishop = (row, col, color, chessboard) => {
        const validMoves=[]
        
        const performTask = (rowNo, colNo, rowOper, colOper) => {
            while(rowNo>=0 && rowNo<8 && colNo>=0 && colNo<8){

                

                if(chessboard[rowNo][colNo]==null){
                    validMoves.push({row: rowNo, col: colNo})
                }
                else{
                    if(chessboard[rowNo][colNo].color=="black" && color=="white"){
                        validMoves.push({row: rowNo, col: colNo})
                    }
                    if(chessboard[rowNo][colNo].color=="white" && color=="black"){
                        validMoves.push({row: rowNo, col: colNo})
                    }
                    break;
                
                }


                if(rowOper=='-'){
                    rowNo--;
                }
                else if(rowOper=='+'){
                    rowNo++;
                }
                if(colOper=='-'){
                    colNo--;
                }
                else if(colOper=='+'){
                    colNo++;
                }
                
                
            }    
        }

        performTask(row-1, col-1, '-', '-');
        performTask(row-1, col+1, '-', '+');
        performTask(row+1, col-1, '+', '-');
        performTask(row+1, col+1, '+', '+');
        return validMoves;
    }

    const getValidMovesOfQueen = (row, col, color, chessboard) => {
        const validMoves=[]
        
        let tempMoves=getValidMovesOfRook(row, col, color, chessboard).concat(getValidMovesOfBishop(row, col, color, chessboard));

        for(let i=0; i<tempMoves.length; i++){
            const move=tempMoves[i];
            validMoves.push(move);
        }

        return validMoves;
    }

    const getValidMovesOfKing = (row, col, color, chessboard) => {
        const validMoves=[]
        

        let tempMoves=[]
        tempMoves.push({row: row-1, col: col-1})
        tempMoves.push({row: row-1, col: col})
        tempMoves.push({row: row-1, col: col+1})
        tempMoves.push({row: row, col: col-1})
        tempMoves.push({row: row, col: col+1})
        tempMoves.push({row: row+1, col: col-1})
        tempMoves.push({row: row+1, col: col})
        tempMoves.push({row: row+1, col: col+1})

        tempMoves = tempMoves.filter((move) => {
            if(move.row >7 || move.row<0 || move.col >7 || move.col<0){
                return false;
            }
            if(chessboard[move.row][move.col]!=null && (chessboard[move.row][move.col].color==color)){
                return false;
            }
            return true;
        });

        for (let i = 0; i < tempMoves.length; i++) {
            const move = tempMoves[i];
            validMoves.push(move);
        }
        


        return validMoves;
    }


    // getValidMoves() function returns all the valid moves(indices of cells where a piece can actually move)
    // This function calls an another functions for getting valid moves of a piece and this(other) function returns all the valid moves without carrying about check
    // Then we remove those moves, in which our king will get check
    // Then we are adding castling moves(if applicable) is type=='king (the reason of adding king's move here, is because of error-"Maximum call stack size exceeded", because of recursively function calling itself)
    const getValidMoves = (type, chessboard, row, col, color) => {

        let moves=[];
        let validMoves=[];

        // Based on the 'type' of piece, we are calling an other function which returns valid moves for these 'type' of pieces, without carrying about check
        if(type=='pawn'){
            moves =  getValidMovesOfPawn(row, col, color, chessboard);
        }
        else if(type=='rook'){
            moves =  getValidMovesOfRook(row, col, color, chessboard);
        }
        else if(type=='knight'){
            moves =  getValidMovesOfKnight(row, col, color, chessboard);
        }
        else if(type=='bishop'){
            moves =  getValidMovesOfBishop(row, col, color, chessboard);
        }
        else if(type=='queen'){
            moves =  getValidMovesOfQueen(row, col, color, chessboard);
        }
        else if(type=='king'){
            moves =  getValidMovesOfKing(row, col, color, chessboard);
        }

        // Now the valid moves which we got from other function, we will remove all those moves in which king will get check
        for(let i=0; i<moves.length; i++){

            let copy=JSON.parse(JSON.stringify(chessboard));
            let tempMove = moves[i];

            copy[tempMove.row][tempMove.col]=copy[row][col];
            copy[row][col]=null;

            if(isKingInCheckHelper(color, copy)==false){

                validMoves.push(tempMove);
            }

        }

        // Adding castling moves for king(if applicable)
        if(chessboard[row][col].type=='king'){
            if(isShortCastlingPossible()){
                validMoves.push({row: row, col: col+2})
            }
            if(isLongCastlingPossible()){
                validMoves.push({row: row, col: col-2})
            }
        }

        return validMoves;
    }

    // isKingInCheck() function returns true if a king is in check
    // We are doing this by iterating over whole chessboard and finding if there exist any opponent piece whose valid move hits out the current player's king
    const isKingInCheck = (row, col, color, chessboard) => {

        let temp=[]
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                let validMoves=[]
                if(chessboard[i][j]!=null && chessboard[i][j].color!=color){
                    let type=chessboard[i][j].type;
                    let clr=(whichPieceTurn=="black")? "white" : "black";
                    if(type=='pawn'){
                        validMoves =  getValidMovesOfPawn(i, j, clr, chessboard);
                    }
                    else if(type=='rook'){
                        validMoves =  getValidMovesOfRook(i, j, clr, chessboard);
                    }
                    else if(type=='knight'){
                        validMoves =  getValidMovesOfKnight(i, j, clr, chessboard);
                    }
                    else if(type=='bishop'){
                        validMoves =  getValidMovesOfBishop(i, j, clr, chessboard);
                    }
                    else if(type=='queen'){
                        validMoves =  getValidMovesOfQueen(i, j, clr, chessboard);
                    }
                    else if(type=='king'){
                        validMoves =  getValidMovesOfKing(i, j, clr, chessboard);
                    }
                    temp=validMoves;
                    if (temp.some(move => Object.is(move.row, row) && Object.is(move.col, col))){
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // findKing() function returns indices(i.e. row no. & col no.) of a king(with color=color)
    // We are doing this by iterating over the whole chessboard
    const findKing = (color, chessboard) => {
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(chessboard[i][j]!=null && chessboard[i][j].color==color && chessboard[i][j].type=='king'){
                    return {row: i, col: j}
                }
            }
        }
    }

    // isKingInCheckHelper() function finds whether a king (with its color and chessboard scenario) is getting check or not. We are doing this by calling isKingInCheck() function
    const isKingInCheckHelper = (color, chessboard) => {
        
        // Finding row no. and col no. of king(of color=color)
        const  {row, col} = findKing(color, chessboard);

        // Calling isKingInCheck() function for evaluating whether king is in check or not
        return isKingInCheck(row, col, color, chessboard);
    }

    // canCheckMateBeAvoided() function returns true if there exist a possible/valid move, so that current player's king can come out of check
    const canCheckMateBeAvoided = (row, col, color, chessboard) => {

        // Iterating over whole chessboard array and finding whether there exist any valid move for any piece of current player, so that current player's king can come out of check. If there exist any such valid move for a piece of current player then checkmate can be avoided and function returns true
        let copy=JSON.parse(JSON.stringify(chessboard));
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(copy[i][j]!=null && copy[i][j].color==color && copy[i][j].type!='king'){
                    let pieceMoves = getValidMoves(copy[i][j].type, copy, i, j, copy[i][j].color);
                    for(let k=0; k<pieceMoves.length; k++){
                        let move=pieceMoves[k];
                        let temp=JSON.parse(JSON.stringify(copy));
                        temp[move.row][move.col]=temp[i][j];
                        temp[i][j]=null;
                        if(isKingInCheck(row, col, color, temp)==false){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // checkMate() function returns true, if current player got checkmate!
    const checkMate = (color, chessboard) => {


        const  {row, col} = findKing(color, chessboard);
        
        // If current player's king is in check
        if(isKingInCheck(row, col, color, chessboard)==false){
            return false;
        }

        // Evaluating whether king's valid moves(adjacent cells) are all getting check, if king got placed there!
        const tempMoves=getValidMovesOfKing(row, col, color, chessboard);
        let count=0
        for(let i=0; i<tempMoves.length; i++){
            let move=tempMoves[i];

            // Deep copy of array chessboard
            let copy=JSON.parse(JSON.stringify(chessboard));
            copy[move.row][move.col]=copy[row][col];
            copy[row][col]=null;
            if(isKingInCheck(move.row,move.col,color,copy)){
                count++;
            }
            else{
                break;
            }
        }

        // If king has not any valid moves(adjacent cells) which are out of check
        if(count==tempMoves.length){

            // If king is in check and for all its valid moves, the king is going to be in check, then evaluating whether checkmate can be avoided through canCheckMateBeAvoided() function. If canCheckMateBeAvoided() function return false then we can say current player got checkmate and the checkMate() function returns true in this case
            if(canCheckMateBeAvoided(row, col, color, chessboard)==false){
                console.log(`${whichPieceTurn} got checkmate!`)
                return true;
            }
            else{
                console.log("Valid moves still exist to come out of check!")
                return false;
            }
        }
        // If king has some valid moves(adjacent cells) which are out of check
        else{
            console.log("Valid moves still exist to come out of check!")
            return false;
        }

    }



    // updateCastlingInfo() function updates the 'castlingInfo' state variable, if rook or king are displaced
    const updateCastlingInfo = (row, col) => {
        if(whichPieceTurn=='white' && castlingInfo.wk74==false){
            if(recentPieceClicked.row==7 && recentPieceClicked.col==0 && recentPieceClicked.type=='rook'){
                setCastlingInfo({...castlingInfo, wr70: true})
            }
            else if(recentPieceClicked.row==7 && recentPieceClicked.col==7 && recentPieceClicked.type=='rook'){
                setCastlingInfo({...castlingInfo, wr77: true})
            } 
            else if(recentPieceClicked.row==7 && recentPieceClicked.col==4 && recentPieceClicked.type=='king'){
                setCastlingInfo({...castlingInfo, wk74: true})
            }
        }
        else if(whichPieceTurn=='black' && castlingInfo.bk04==false){
            if(recentPieceClicked.row==0 && recentPieceClicked.col==0 && recentPieceClicked.type=='rook'){
                setCastlingInfo({...castlingInfo, br00: true})
            }
            else if(recentPieceClicked.row==0 && recentPieceClicked.col==7 && recentPieceClicked.type=='rook'){
                setCastlingInfo({...castlingInfo, br07: true})
            } 
            else if(recentPieceClicked.row==0 && recentPieceClicked.col==4 && recentPieceClicked.type=='king'){
                setCastlingInfo({...castlingInfo, bk04: true})
            }
        }
    }

    // isCastlingThroughCheck() function return false if castling can be done without getting check
    const isCastlingThroughCheck = (row, col) => {

        let copy=JSON.parse(JSON.stringify(chessboard));

        // If it's a short castling, checking for check on 3 cells(by placing king at each cell one by one)
        if(col>4){

            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
            copy[row][col-1]=copy[row][col-2];
            copy[row][col-2]=null;
            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
            copy[row][col]=copy[row][col-1];
            copy[row][col-1]=null;
            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
            return false;

        }
        // else if it's a long castling, checking for check on 4 cells(by placing king at each cell one by one)
        else if(col<4){

            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
            copy[row][col+1]=copy[row][col+2];
            copy[row][col+2]=null;
            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
            copy[row][col]=copy[row][col+1];
            copy[row][col+1]=null;
            if(isKingInCheckHelper(whichPieceTurn, copy)){
                return true;
            }
                
            return false;


        }
    }

    // isObstaclePresentInCastling() function returns false if there are no obstacles for castling between rook and the king. "row" & "col" parameter passed is showing rook's row no. & column no.
    const isObstaclePresentInCastling = (row, col) => {

        let copy=JSON.parse(JSON.stringify(chessboard));

        // If short castling needed to be performed, then we need to check whether 2 cells between king and rook are empty or not?
        if(col>4){
            if(copy[row][col-1]==null && copy[row][col-2]==null){
                return false;
            }
            else{
                return true;
            }
        }
        // If long castling needed to be performed, then we need to check whether 3 cells between king and rook are empty or not?
        else if(col<4){
            if(copy[row][col+1]==null && copy[row][col+2]==null && copy[row][col+3]==null){
                return false;
            }
            else{
                return true;
            }
        }
    }

    // isShortCastlingPossible() function return true if castling is possible towards king's side and take care of - (1) Castling isn't through check (2) No obstacles in between (3) king isn't in check (4) rook and king aren't displaced from initial positions yet
    const isShortCastlingPossible = () => {
        if(whichPieceTurn=='white'){
            if(castlingInfo.wk74==false && castlingInfo.wr77==false){
                if(isObstaclePresentInCastling(7,7)==false && isCastlingThroughCheck(7,6)==false){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else if(whichPieceTurn=='black'){
            if(castlingInfo.bk04==false && castlingInfo.br07==false){
                if(isObstaclePresentInCastling(0,7)==false && isCastlingThroughCheck(0,6)==false){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
    }
    
    // isLongCastlingPossible() function return true if castling is possible towards queen's side and take care of - (1) Castling isn't through check (2) No obstacles in between (3) king isn't in check (4) rook and king aren't displaced from initial positions yet
    const isLongCastlingPossible = () => {
        if(whichPieceTurn=='white'){
            if(castlingInfo.wk74==false && castlingInfo.wr70==false){
                if(isObstaclePresentInCastling(7,0)==false && isCastlingThroughCheck(7,2)==false){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else if(whichPieceTurn=='black'){
            if(castlingInfo.bk04==false && castlingInfo.br00==false){
                if(isObstaclePresentInCastling(0,0)==false && isCastlingThroughCheck(0,2)==false){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
    }

    // previousMove() function, transforms the current chess scenario to its just previous scenario and also changes piece turn
    // We are setting the scenario of chessboard to the 2nd last element of the chessboard history and removing the last element of chessboard history 
    const previousMove = () => {

        // If chessboard is empty, then nothing to revert back, as the chessboardHistory array size will be 0
        if(chessboardHistory.length==0){
            return;
        }

        // Setting the scenario of chessboard to the 2nd last element of the chessboard history and removing the last element of chessboard history 
        let prevChessboardState = chessboardHistory[chessboardHistory.length-1]
        setChessboardHistory(temp => temp.slice(0, temp.length-1))

        setChessboard(prevChessboardState)
        setWhichPieceTurn(whichPieceTurn=="white"? "black":"white")
        setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });
        
    }

    // isMatchDraw() function return true if draw situation occurs else returns false
    // We are checking that whether any valid move exist(for current player whose turn is there) for any piece. If no such move exist we return true
    const isMatchDraw = (color, chessboard) => {
        let ans=true;
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(chessboard[i][j]!=null && color==chessboard[i][j].color){
                    let temp=getValidMoves(chessboard[i][j].type, chessboard, i, j, color);
                    if(temp.length>0){
                        ans=false;
                        return ans;
                    }
                }
            }
        }
        return ans;
    }

    // handlePieceClick() function is heart of my(Keshav choudhary's) chess game, which gets executed whenever any cell in chessboard gets clicked up!
    const handlePieceClick = (row, col) => {

        // If king is in check and also if in checkmate condition
        if(isKingInCheckHelper(whichPieceTurn, chessboard)){
            if(checkMate(whichPieceTurn, chessboard)){
                console.log(`${whichPieceTurn} player got CHECKMATE!`)
                return;
            }
            else{
                console.log(`Current player's king(${whichPieceTurn}) is in check!`)
            }
        }
        


        // If a piece is clicked whose turn is not there!
        if(chessboard[row][col]!=null && recentPieceClicked.value==false && chessboard[row][col].color!=whichPieceTurn){
            return;
        }
        // If chess piece is clicked without any recent pieceClick OR chess piece is clicked and recent piececlick color was also same
        if((chessboard[row][col]!=null && recentPieceClicked.value==false) || (chessboard[row][col]!=null && recentPieceClicked.color==chessboard[row][col].color)){
            setRecentPieceClicked({...recentPieceClicked, value: true, type: chessboard[row][col].type, color: chessboard[row][col].color, row: row, col: col})
            setShowPromotionModal(false)
            setShouldGetValidMovesExecuted(true)
        }
        // If piece got clicked already, and now an empty cell is clicked or cell where opponent piece is present
        else if((recentPieceClicked.value==true && chessboard[row][col]==null) || (recentPieceClicked.value==true && recentPieceClicked.color!=chessboard[row][col].color)){
            
            // If piece is being placed on a valid cell
            if (recentPieceClicked.validMoves.some(move => Object.is(move.row, row) && Object.is(move.col, col))){

                // Adding current chessboard scenario in Chessboard History array
                setChessboardHistory(prevMoves => [...prevMoves, chessboard]);

                
                // Creating a new array updatedCopy(8x8) in which current move is added
                let updatedCopy=JSON.parse(JSON.stringify(chessboard));
                updatedCopy[row][col] = updatedCopy[recentPieceClicked.row][recentPieceClicked.col]
                updatedCopy[recentPieceClicked.row][recentPieceClicked.col]=null

                // For CASTLING move, piece placing!!
                if(recentPieceClicked.type=='king'){
                    if(isShortCastlingPossible() && col==6 && (row==0 || row==7)){
                        updatedCopy[row][col-1]=updatedCopy[row][col+1];
                        updatedCopy[row][col+1]=null;
                    }
                    if(isLongCastlingPossible() && col==2  && (row==0 || row==7)){
                        updatedCopy[row][col+1]=updatedCopy[row][col-2];
                        updatedCopy[row][col-2]=null;
                    }
                }

                // Updating Castling Info, if rook or king movement detected!
                if(recentPieceClicked.type=='rook' || recentPieceClicked.type=='king'){
                    updateCastlingInfo(row, col);
                }


                // En-passant move
                if(recentPieceClicked.type=='pawn' && ( (recentPieceClicked.row-row==2) || (row-recentPieceClicked.row==2)) ){
                    setLastPawnMove({value: true, sourceRow: recentPieceClicked.row, sourceCol: recentPieceClicked.col, targetRow: row, targetCol: col, color: recentPieceClicked.color})
                }
                if(recentPieceClicked.type=='pawn' && chessboard[row][col]==null && recentPieceClicked.col!=col && lastPawnMove.value==true){
                    if(col>recentPieceClicked.col){
                        updatedCopy[recentPieceClicked.row][recentPieceClicked.col+1]=null;
                    }
                    else if(col<recentPieceClicked.col){
                        updatedCopy[recentPieceClicked.row][recentPieceClicked.col-1]=null;
                    }
                }
                if(recentPieceClicked.type=='pawn' && ( (recentPieceClicked.row-row==2) || (row-recentPieceClicked.row==2)) ){
                }
                else{
                    setLastPawnMove({value: false, sourceRow: -1, sourceCol: -1, targetRow: -1, targetCol: -1, color: ''})
                }

                
    
                // If pawn reaches last row
                if(recentPieceClicked.type=='pawn' && (row==7 || row==0)){
                    setCurrentCellClicked({row: row, col: col})
                    setShowPromotionModal(true);
                    return;
                }
                

                // Updating chessboard
                setChessboard(updatedCopy)

                

                // Changing piece turn
                if(recentPieceClicked.color=="white"){
                    setWhichPieceTurn("black")
                }
                else if(recentPieceClicked.color=="black"){
                    setWhichPieceTurn("white")
                }

            }
            setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });


        }
        
        
    }


    useEffect(() => {
        // console.log(recentPieceClicked);

        // If valid moves for a piece needed to be evaluated
        if(shouldGetValidMovesExecuted){
            const validMoves = getValidMoves(recentPieceClicked.type, chessboard, recentPieceClicked.row, recentPieceClicked.col, recentPieceClicked.color)
            setRecentPieceClicked({...recentPieceClicked, validMoves: [...validMoves]})
            setShouldGetValidMovesExecuted(false)
        }

        // If a piece got selected for pawn promotion
        if (selectedPromotedPiece) {
            // console.log(selectedPromotedPiece)
            let updatedCopy=JSON.parse(JSON.stringify(chessboard));
            updatedCopy[currentCellClicked.row][currentCellClicked.col].type = selectedPromotedPiece;
            updatedCopy[currentCellClicked.row][currentCellClicked.col].img = pieceImages[whichPieceTurn][selectedPromotedPiece];
            updatedCopy[currentCellClicked.row][currentCellClicked.col].color = whichPieceTurn;

            updatedCopy[recentPieceClicked.row][recentPieceClicked.col]=null;
            
            setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });

            setChessboard(updatedCopy);
            setShowPromotionModal(false);
            setSelectedPromotedPiece(null);


            // Changing piece turn
            if(recentPieceClicked.color=="white"){
                setWhichPieceTurn("black")
            }
            else if(recentPieceClicked.color=="black"){
                setWhichPieceTurn("white")
            }

        }

      }, [recentPieceClicked, shouldGetValidMovesExecuted, selectedPromotedPiece]);

    const renderCell = () => {


        const grid = [];

        for(let row=0; row<8; row++){
            for(let col=0; col<8; col++){
                const cellColor = ((row+col)%2===0) ? '#855E42' : '#D3D3D3'
                // const cellColor = ((row+col)%2===0) ? '#96bc4b' : '#D3D3D3'
                const isHighlighted = recentPieceClicked.validMoves.some(
                    (highlightedCell) => highlightedCell.row === row && highlightedCell.col === col
                );
                
                const cell = (
                    <div
                        key={`${row}-${col}`}
                        className={`cell ${isHighlighted ? "highlighted" : ""}`}
                        style={{backgroundColor: cellColor }}
                        onClick={ () => handlePieceClick(row, col)}
                    >
                        { chessboard[row][col] && <img src={chessboard[row][col].img} alt = "img" style={{cursor:'pointer'}}></img>}
                    </div>
                )

                grid.push(cell)
            }
        }



        return grid;

    }



  return (
    
    <div>
        <div className="grid">
            {renderCell()}
        </div>


        
        {showPromotionModal && (
            <div className="modal">
                <h2>Select a piece for pawn promotion:</h2>
                <PromotedPiece
                    color={whichPieceTurn}
                    cellColor={(currentCellClicked.row+currentCellClicked.col)%2===0 ? '#855E42' : '#D3D3D3'}
                    onPieceSelect={handlePromotionSelection}
                />
            </div>
        )}
        <br/>
        <div><button className="undo-btn" onClick={()=>previousMove()}>Back</button></div>
        
        {whichPieceTurn=="white" && isMatchDraw(whichPieceTurn, chessboard)==false && checkMate(whichPieceTurn, chessboard)==false && <h2>It's white turn!</h2>}
        {whichPieceTurn=="black" && isMatchDraw(whichPieceTurn, chessboard)==false && checkMate(whichPieceTurn, chessboard)==false && <h2>It's black turn!</h2>}
        {isKingInCheckHelper(whichPieceTurn, chessboard)==true && checkMate(whichPieceTurn, chessboard)==false && <h2>{whichPieceTurn}'s king is in check!</h2>}
        {checkMate(whichPieceTurn, chessboard) && <h2>Game Over! {whichPieceTurn} got Checkmate!</h2>}
        {isMatchDraw(whichPieceTurn, chessboard) && (checkMate(whichPieceTurn, chessboard)==false) && (
                <div>
                    <h2>Match drawn! It's a stalemate.</h2>
                    <h3>(Current player has no legal move and isn't in check)</h3>
                </div>
            )
        }
        
    </div>
  )
}

export default Grid