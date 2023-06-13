import React, { useState, useEffect } from 'react'
import { valid } from 'semver';
import './Grid.css'
import PromotedPiece from './PromotedPiece';
// import img from '../assets/white-pieces/pawn.svg'

const Grid = () => {


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


    const getPieceImage = (pieceImage, row, col) => {
        if(row===1 || row===6){
            return pieceImage.pawn
        }
        if((row===0 || row===7) && (col===0 || col===7)){
            return pieceImage.rook
        }
        if((row===0 || row===7) && (col===1 || col===6)){
            return pieceImage.knight
        }
        if((row===0 || row===7) && (col===2 || col===5)){
            return pieceImage.bishop
        }
        if(row === 0 && col===4){
            return pieceImage.king
        }
        if(row === 0 && col===3){
            return pieceImage.queen
        }
        if(row === 7 && col===4){
            return pieceImage.queen
        }
        if(row === 7 && col===3){
            return pieceImage.king
        }

    }


    const [chessboard, setChessboard] = useState([

        // Rows 0 and 1 (black pieces)
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
        // Row 2 (black pawns)
        Array(8).fill({type: 'pawn', color: 'black', img: pieceImages.black.pawn}),
        // Rows 3 to 6 (empty squares)
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill({type: 'pawn', color: 'white', img: pieceImages.white.pawn}),
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
    

    const [shouldGetValidMovesExecuted, setShouldGetValidMovesExecuted] = useState(false)

    const [whichPieceTurn, setWhichPieceTurn] = useState("white")


    const [recentPieceClicked, setRecentPieceClicked] = useState({
        value: false,
        type: '',
        color: '',
        row: -1,
        col: -1,
        validMoves: [],
    })

    const [showPromotionModal, setShowPromotionModal] = useState(false) 

    const [selectedPromotedPiece, setSelectedPromotedPiece] = useState(null)

    const handlePromotionSelection = (piece) => {
        setSelectedPromotedPiece(piece);
    }

    const [currentCellClicked, setCurrentCellClicked] = useState({
        row: -1,
        col: -1,
    })

    const [castlingInfo, setCastlingInfo] = useState({
        br00: false,
        br07: false,
        bk04: false,
        wr70: false,
        wr77: false,
        wk74: false,
    })

    const [chessboardHistory, setChessboardHistory] = useState([]);



    // const try64Moves = (type, color, row, col) =>{
    //     for(let r=0; r<8; r++){
    //         for(let c=0; c<8; c++){
                
    //         }
    //     }
    // } 

    const getValidMovesOfPawn = (row, col, color, chessboard) => {
        const validMoves=[];

        console.log("----chala-----", row, col)
        
        // --------- (row+1) or (row-2) expression should lie between 0 and 7
        // --------- when pawn reaches last row, option of konsa piece zinda krwana hai

        if(color=="black"){

            // console.log("chala")

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
            // const { r, c } = move;
            // console.log(`Row: ${row}, Col: ${col}`);
        }
          

        // validMoves=[...tempMoves];


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
            // const { r, c } = move;
            // console.log(`Row: ${row}, Col: ${col}`);
        }
        


        return validMoves;
    }


    const getValidMoves = (type, chessboard, row, col, color) => {
        // console.log(recentPieceClicked.type);

        // const validMoves=[]
        let moves=[];
        let validMoves=[];

        if(type=='pawn'){
            moves =  getValidMovesOfPawn(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }
        else if(type=='rook'){
            moves =  getValidMovesOfRook(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }
        else if(type=='knight'){
            moves =  getValidMovesOfKnight(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }
        else if(type=='bishop'){
            moves =  getValidMovesOfBishop(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }
        else if(type=='queen'){
            moves =  getValidMovesOfQueen(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }
        else if(type=='king'){
            moves =  getValidMovesOfKing(row, col, color, chessboard);
            // setRecentPieceClicked({...recentPieceClicked, validMoves: validMoves})
        }

        // const allPossibleMoves = recentPieceClicked.validMoves;
        
        for(let i=0; i<moves.length; i++){

            let copy=JSON.parse(JSON.stringify(chessboard));
            let tempMove = moves[i];

            copy[tempMove.row][tempMove.col]=copy[row][col];
            copy[row][col]=null;
            // ------- Check this out, on clicking on king below line says Cannot destructure property 'row' of 'findKing(...)' as it is undefined. at isKingInCheckHelper (bundle.js:1402:7) at willKingGetCheck (bundle.js:1507:9) at getValidMoves 
            // Shayad is wajah se kyuki, willKingGetCheck() m recentPieceClicked ki value purane piece ki rhegi isliye
            // if(isKingInCheckHelper(color, copy)==false && willKingGetCheck(tempMove.row, tempMove.col, copy)==false){
            if(isKingInCheckHelper(color, copy)==false){

                validMoves.push(tempMove);
            }

        }

        if(chessboard[row][col].type=='king'){
            if(isShortCastlingPossible()){
                validMoves.push({row: row, col: col+2})
            }
            if(isLongCastlingPossible()){
                validMoves.push({row: row, col: col-2})
            }
        }



        // console.log("----------", validMoves)


        return validMoves;
    }

    const isKingInCheck = (row, col, color, chessboard) => {

        let temp=[]
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                let validMoves=[]
                if(chessboard[i][j]!=null && chessboard[i][j].color!=color){
                    let type=chessboard[i][j].type;
                    let clr=(whichPieceTurn=="black")? "white" : "black";
                    if(type=='pawn'){
                        // console.log(i, j, whichPieceTurn)
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
                    // console.log(temp)
                }
            }
        }

        // if (temp.some(move => Object.is(move.row, row) && Object.is(move.col, col))){
        //     return true;
        // }
        // else{
        //     return false;
        // }
        return false;
    }

    const findKing = (color, chessboard) => {
        console.log("~~~~~~~~~~~~~~~~~~~~~",chessboard)
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(chessboard[i][j]!=null && chessboard[i][j].color==color && chessboard[i][j].type=='king'){
                    return {row: i, col: j}
                }
            }
        }
    }

    const isKingInCheckHelper = (color, chessboard) => {
        // for(let i=0; i<8; i++){
        //     for(let j=0; j<8; j++){
        //         if(chessboard[i][j]!=null && chessboard[i][j].color==color && chessboard[i][j].type=='king'){
        //             return isKingInCheck(i, j, color, chessboard);
        //         }
        //     }
        // }
        const  {row, col} = findKing(color, chessboard);
        // console.log(isKingInCheck(row, col, color, chessboard))

        return isKingInCheck(row, col, color, chessboard);
    }

    const canCheckMateBeAvoided = (row, col, color, chessboard) => {
        let copy=JSON.parse(JSON.stringify(chessboard));
        // console.log("yha tak chalaaaaaaaaaa", copy)
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                // console.log("kuch to bol bhaiiiii", copy[i][j])
                if(copy[i][j]!=null && copy[i][j].color==color && copy[i][j].type!='king'){
                    // console.log("-------" + copy[i][j].type + "--------" + i + j)
                    let opponentPieceMoves = getValidMoves(copy[i][j].type, copy, i, j, copy[i][j].color);
                    for(let k=0; k<opponentPieceMoves.length; k++){
                        let move=opponentPieceMoves[k];
                        let temp=JSON.parse(JSON.stringify(copy));
                        temp[move.row][move.col]=temp[i][j];
                        temp[i][j]=null;
                        // console.log(isKingInCheck(row, col, color, temp), "~~~~~~~~~~~~~~~~~~~~~")
                        if(isKingInCheck(row, col, color, temp)==false){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    const checkMate = (color, chessboard) => {

        // console.log("checkmate chaliiiiii")

        const  {row, col} = findKing(color, chessboard);
        
        if(isKingInCheck(row, col, color, chessboard)==false){
            return false;
        }

        const tempMoves=getValidMovesOfKing(row, col, color, chessboard);
        // console.log(tempMoves)
        let count=0
        for(let i=0; i<tempMoves.length; i++){
            let move=tempMoves[i];
            // let copy=[...chessboard];
            // Deep copy of array chessboard
            let copy=JSON.parse(JSON.stringify(chessboard));
            copy[move.row][move.col]=copy[row][col];
            copy[row][col]=null;
            if(isKingInCheck(move.row,move.col,color,copy)){
                // console.log(row,col)
                count++;
            }
            else{
                break;
            }
        }
        // console.log(count+"~~~~~~~~~~~"+tempMoves.length+"`````````````")
        if(count==tempMoves.length){
            // console.log(canCheckMateBeAvoided(row, col, color, chessboard)==false);
            // console.log(canCheckMateBeAvoided(row, col, color, chessboard),   "  (*&^%$#@!!   ")
            if(canCheckMateBeAvoided(row, col, color, chessboard)==false){
                console.log(`${whichPieceTurn} got checkmate!`)
                return true;
            }
            else{
                console.log("Valid moves still exist to come out of check!")
                return false;
            }
        }
        else{
            console.log("Valid moves still exist to come out of check!")
            return false;
        }





        // let r,c;
        // for(let i=0; i<8; i++){
        //     for(let j=0; j<8; j++){
        //         if(chessboard[i][j]!=null && chessboard[i][j].color==whichPieceTurn && chessboard[i][j].type=='king'){
        //             r=i;
        //             c=j;
        //             break;
        //         }
        //     }
        // }

        // const temp = getValidMovesOfKing(r,c,whichPieceTurn);
        // let count=0;
        // for(let i=0; i<temp.length; i++){
        //     let move=temp[i];
        //     let copy=chessboard;
        //     copy[move.row][move.col]=copy[r][c];
        //     copy[r][c]=null;
        //     // if(isKingInCheckWithBoard(r,c,whichPieceTurn,copy)){
        //     //     count++;
        //     // }
        // }

    }

    // Only use when piece is already clicked and now next cell is gonna clicked
    const willKingGetCheck = (row, col, chessboard) => {

        
        
        let copy=JSON.parse(JSON.stringify(chessboard));
        copy[row][col]=copy[recentPieceClicked.row][recentPieceClicked.col];
        copy[recentPieceClicked.row][recentPieceClicked.col]=null;


        // console.log(row, col, copy)

        if(isKingInCheckHelper(whichPieceTurn, copy)){
            return true;
        }
        else{
            return false;
        }

    }


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
            if(recentPieceClicked.row=0 && recentPieceClicked.col==0 && recentPieceClicked.type=='rook'){
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

    const isCastlingThroughCheck = (row, col) => {

        let copy=JSON.parse(JSON.stringify(chessboard));
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
                // console.log("chalraaa kya!!!!")
            return false;

        }
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

    const isObstaclePresentInCastling = (row, col) => {

        let copy=JSON.parse(JSON.stringify(chessboard));

        if(col>4){
            if(copy[row][col-1]==null && copy[row][col-2]==null){
                return false;
            }
            else{
                return true;
            }
        }
        else if(col<4){
            if(copy[row][col+1]==null && copy[row][col+2]==null && copy[row][col+3]==null){
                return false;
            }
            else{
                return true;
            }
        }
    }

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

    const previousMove = () => {
        if(chessboardHistory.length==0){
            return;
        }

        let prevChessboardState = chessboardHistory[chessboardHistory.length-1]
        setChessboardHistory(temp => temp.slice(0, temp.length-1))

        setChessboard(prevChessboardState)
        setWhichPieceTurn(whichPieceTurn=="white"? "black":"white")
        setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });
        
    }

    const handlePieceClick = (row, col) => {

        // if(isCurrentPlayerKingInCheck()){
        //     console.log("Current player's king is in check")
        // }

        if(isKingInCheckHelper(whichPieceTurn, chessboard)){
            if(checkMate(whichPieceTurn, chessboard)){
                console.log(`${whichPieceTurn} player got CHECKMATE!`)
                return;
            }
            else{
                console.log(`Current player's king(${whichPieceTurn}) is in check!`)
            }
        }
        


        // console.log(recentPieceClicked)
        if(chessboard[row][col]!=null && recentPieceClicked.value==false && chessboard[row][col].color!=whichPieceTurn){
            // console.log(`Bhai ${whichPieceTurn} abhi tumhari turn hai`)
            return;
        }
        // If chess piece is clicked without any recent pieceClick OR chess piece is clicked and recent piececlick color was also same
        if((chessboard[row][col]!=null && recentPieceClicked.value==false) || (chessboard[row][col]!=null && recentPieceClicked.color==chessboard[row][col].color)){
            setRecentPieceClicked({...recentPieceClicked, value: true, type: chessboard[row][col].type, color: chessboard[row][col].color, row: row, col: col})
            setShowPromotionModal(false)
            setShouldGetValidMovesExecuted(true)


            
            
        }
        else if((recentPieceClicked.value==true && chessboard[row][col]==null) || (recentPieceClicked.value==true && recentPieceClicked.color!=chessboard[row][col].color)){
            // console.log("This was a kill move")

            // console.log("short--", isShortCastlingPossible());
            // console.log("long--", isLongCastlingPossible());
            // console.log(castlingInfo);
            
            // const allPossibleMoves = recentPieceClicked.validMoves;
            // if(recentPieceClicked.type=='king'){
            //     if(isShortCastlingPossible()){
            //         // console.log("short chaliiiiii")
            //         // recentPieceClicked.validMoves.push({row: row, col: col+2})

            //         // setRecentPieceClicked(prevState => ({
            //         //     ...prevState,
            //         //     validMoves: [...prevState.validMoves, {row: row, col: col+2}]
            //         // }));
            //         if(col-2==4){
            //             allPossibleMoves.push({row: row, col: col})
            //         }
            //     }
            //     if(isLongCastlingPossible()){
            //         // setRecentPieceClicked(prevState => ({
            //         //     ...prevState,
            //         //     validMoves: [...prevState.validMoves, {row: row, col: col-2}]
            //         // }));

            //         if(col+2==4){
            //             allPossibleMoves.push({row: row, col: col})
            //         }

                    
            //     }
            // }

            // console.log(allPossibleMoves)

            // if(recentPieceClicked.validMoves.includes({row: row,col: col})){
            if (recentPieceClicked.validMoves.some(move => Object.is(move.row, row) && Object.is(move.col, col))){

                // No need of below code, as getValidMoves() will take care of only those moves in which the king doesn't get check!
                // if(isKingInCheckHelper(whichPieceTurn, chessboard)){
                //     if(willKingGetCheck(row, col, chessboard)==true){
                //         return;
                //     }
                // }

                // if(willKingGetCheck(row, col, chessboard)==true){
                //     // console.log("chalra kya")
                //     return;
                // }

                
                setChessboardHistory(prevMoves => [...prevMoves, chessboard]);

                
                // let copy=[...chessboard];
                let copy=JSON.parse(JSON.stringify(chessboard));
                copy[row][col] = copy[recentPieceClicked.row][recentPieceClicked.col]
                copy[recentPieceClicked.row][recentPieceClicked.col]=null

                // For CASTLING move, piece placing!!
                if(recentPieceClicked.type=='king'){
                    if(isShortCastlingPossible() && col==6 && (row==0 || row==7)){
                        copy[row][col-1]=copy[row][col+1];
                        copy[row][col+1]=null;
                    }
                    if(isLongCastlingPossible() && col==2  && (row==0 || row==7)){
                        copy[row][col+1]=copy[row][col-2];
                        copy[row][col-2]=null;
                    }
                }

                

                if(recentPieceClicked.type=='rook' || recentPieceClicked.type=='king'){
                    updateCastlingInfo(row, col);
                }
    

                if(recentPieceClicked.type=='pawn' && (row==7 || row==0)){
                    setCurrentCellClicked({row: row, col: col})
                    setShowPromotionModal(true);
                    
                    // console.log("first----", selectedPromotedPiece);
                    // copy[row][col].type=selectedPromotedPiece
                    // copy[row][col].img=pieceImages[whichPieceTurn][selectedPromotedPiece];
                    // setShowPromotionModal(false);


                    return;
                }
                

                setChessboard(copy)

                


                if(recentPieceClicked.color=="white"){
                    setWhichPieceTurn("black")
                }
                else if(recentPieceClicked.color=="black"){
                    setWhichPieceTurn("white")
                }

                // setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });
            }
            setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });


        }
        
        // console.log(recentPieceClicked.value)
        
    }


    useEffect(() => {
        console.log(recentPieceClicked);
        if(shouldGetValidMovesExecuted){
            const validMoves = getValidMoves(recentPieceClicked.type, chessboard, recentPieceClicked.row, recentPieceClicked.col, recentPieceClicked.color)
            setRecentPieceClicked({...recentPieceClicked, validMoves: [...validMoves]})
            setShouldGetValidMovesExecuted(false)
        }
        // if(isKingInCheckHelper(whichPieceTurn, chessboard)){
        //     console.log(`Current player's king(${whichPieceTurn}) is in check`)
        //     if(checkMate(whichPieceTurn, chessboard)){
        //         console.log(`${whichPieceTurn} player got CHECKMATE!`)
        //     }
        // }

        if (selectedPromotedPiece) {
            console.log(selectedPromotedPiece)
            let updatedCopy=JSON.parse(JSON.stringify(chessboard));
            updatedCopy[currentCellClicked.row][currentCellClicked.col].type = selectedPromotedPiece;
            updatedCopy[currentCellClicked.row][currentCellClicked.col].img = pieceImages[whichPieceTurn][selectedPromotedPiece];
            updatedCopy[currentCellClicked.row][currentCellClicked.col].color = whichPieceTurn;

            updatedCopy[recentPieceClicked.row][recentPieceClicked.col]=null;
            
            setRecentPieceClicked({...recentPieceClicked, value: false, type: '', color: '', row: -1, col: -1, validMoves: [] });

            setChessboard(updatedCopy);
            setShowPromotionModal(false);
            setSelectedPromotedPiece(null);


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


                let pieceImage = null;
                if(row===0 || row===1){
                    pieceImage = pieceImages.black
                }
                else if(row===6 || row===7){
                    pieceImage = pieceImages.white
                }
                
                const cell = (
                    <div
                        key={`${row}-${col}`}
                        className={`cell ${isHighlighted ? "highlighted" : ""}`}
                        style={{backgroundColor: cellColor }}
                        onClick={ () => handlePieceClick(row, col)}
                    >
                        {/* <img src={img} height='90px' width= '90px'></img> */}
                        {/* {pieceImage && <img src={pieceImage.king} alt="piece" />} */}
                        {/* {pieceImage && <img src={getPieceImage(pieceImage, row, col)} alt = "img" style={{cursor:'pointer'}} onClick={ () => handlePieceClick(row, col)}></img>} */}
                        { chessboard[row][col] && <img src={chessboard[row][col].img} alt = "img" style={{cursor:'pointer'}}></img>}
                    </div>
                )

                grid.push(cell)
            }
        }



        return grid;

    }



  return (
    // <div className="grid">
    //     {/* {renderCell() && <PromotedPiece color={whichPieceTurn === 'white' ? 'white' : 'black'}/>} */}
    //     {renderCell()}
    //     {showPromotionModal && (
    //     <div className="modal">
    //         <h3>Select a piece for promotion:</h3>
    //         <PromotedPiece
    //             color={whichPieceTurn === 'white' ? 'white' : 'black'}
    //             // onPieceSelect={handlePromotionSelection}
    //         />
    //     </div>
    //     )}
    // </div>
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
        
        {whichPieceTurn=="white" && checkMate(whichPieceTurn, chessboard)==false && <h2>It's white turn!</h2>}
        {whichPieceTurn=="black" && checkMate(whichPieceTurn, chessboard)==false && <h2>It's black turn!</h2>}
        {isKingInCheckHelper(whichPieceTurn, chessboard)==true && checkMate(whichPieceTurn, chessboard)==false && <h2>{whichPieceTurn}'s king is in check!</h2>}
        {checkMate(whichPieceTurn, chessboard) && <h2>Game Over! {whichPieceTurn} got Checkmate!</h2>}

    </div>
  )
}

export default Grid