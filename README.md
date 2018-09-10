# Chess

> An implementation of chess, using JavaScript and jQuery

<img src="https://user-images.githubusercontent.com/3531085/45269077-4ff36e80-b47f-11e8-8891-9d75ec201c5b.png" style="box-shadow:0 2px 25px 0">

Play online here: https://mickyginger.github.io/chess/

## Approach

This game was influenced by some work I did with one of my students [Theodhor Shyti](https://github.com/Theodhor). He wanted to make a chess game for his first project on his [Web Development Immersive](https://generalassemb.ly/education/web-development-immersive) course at General Assembly in London.

Theodhor's approach was to create a virtual grid onto which moves can be made and checks can be run to ensure moves are valid.

He also came up with the idea of making each square an object which has three properties:

- `color`
- `col` (a zero indexed x-axis reference)
- `row` (a zero indexed y-axis reference)

The challenge then was to write some logic to describe the movement of each piece.

## Movement

The way I approached this was to consider each piece to fall into essentially two broad categories: restricted, and unrestricted movement types.

### Restricted movement

A restricted piece can only move one square, these pieces are:

- pawn
- knight
- king

To move a restricted piece, I just need to check if the square the piece is moving to is either unoccupied or occupied by an opposition piece.

The edge case is the pawn, whose movement is a little more complex. On its first move the pawn can either move one square or two, and when taking another piece can move diagonally.

### Unrestricted movement

An unrestricted piece can move any squares in certain directions, as long as nothing is blocking their path. These pieces are:

- rook
- bishop
- queen

To move an unrestricted piece I first have to determine in which direction it was moving and check that that direction is valid. Then I check that there are no pieces between the start square and the end square. Finally I run the same checks that I made with the restricted piece.

### Validating movement

To ensure a piece is moving in a valid way I create an array of movement objects which describes all the moves that a piece can make. If the piece is unrestricted, I describe the smallest single move that the piece can make in any direction.

The movement array for the queen for example looks like this:

```js
[
  { row: -1, col: 0 },
  { row: 0, col: -1 },
  { row: 1, col: 0 },
  { row: 0, col: 1 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 }
]
```

This describes a move of one square in any direction.

If the user attempts to move in a different direction, for example a knight's move (`{ row: 1, col: 2 }` for example), then it would be considered an invalid move since the array does not contain an object that describes that movement.

## Check

To decide whether a player is in check, I find all of opponents positions and check to see if they could move to the player's king square in one move. If so the player is in check.

## To do

The following things have not yet been implemented:

- Check mate
- ~~[Castling](https://simple.wikipedia.org/wiki/Chess#Castling)~~
- [En passant](https://simple.wikipedia.org/wiki/Chess#En_passant)
- ~~[Promotion](https://simple.wikipedia.org/wiki/Chess#Promotion)~~
- Automated tests

## Contributing

Please fork the repo and make a pull request.

If you'd rather just take the code and develop it please credit me and drop me a link to your repo, I'd love to take a look!
