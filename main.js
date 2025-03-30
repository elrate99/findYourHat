const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


class Field {
    constructor(width, height, percentage) {
     this._field = Field.generateField(width, height, percentage);
     this.playerPosition =  this._findPlayer();
    }

    print() {
        process.stdout.write('\x1Bc');
        console.log(this._field.map(row => row.join('')).join('\n'))
    }

    _findPlayer() {
        for(let y = 0; y < this._field.length; y++) {
            for(let x = 0; x < this._field[y].length; x++){
                if (this._field[y][x] === pathCharacter) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    move(way) {

        let { x, y } = this.playerPosition;

        switch(way) {
            case 'u':
                y--;
                break;
            case 'd':
                y++;
                break;
            case 'l':
                x--;
                break;
            case 'r':
                x++;
                break;
            default:
                console.log('Please input a right way: u, d, l, r!');
                return;
        }

        if(y < 0 || y >= this._field.length || x < 0 || x >= this._field[0].length) {
            console.log('Out of bonds! Try a different way!');
            return;
        }

        if(this._field[y][x] === hole) {
            console.log('Game Over! You are into the hole!');
            process.exit();
        }
        
        if(this._field[y][x] === hat) {
            console.log('You Win! You found a hat!');
            process.exit();
        }

        this._field[y][x] = pathCharacter;
        this.playerPosition = { x, y };
        this.print();
    }

    static generateField(width, height, percentage) {
        
        let field = [];
        for(let i = 0; i < height; i++) {
            let row = [];
            for(let j = 0; j < width; j++) {
                row.push(fieldCharacter);
            }
            field.push(row);
        }
        const totalCells = height*width;
        const totalHoles = Math.floor(totalCells*percentage);
        let holesPlaced = 0;

        while(holesPlaced < totalHoles) {
            let randomRow = Math.floor(Math.random() * height);
            let randomCol = Math.floor(Math.random() * width);

            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = hole;
                holesPlaced++;
            }
        }

        let hatPlaced = 0;

        while(!hatPlaced) {
            let randomRow = Math.floor(Math.random() * height);
            let randomCol = Math.floor(Math.random() * width);

            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = hat;
                hatPlaced = true;
            }
        }

        let playerPlaced = 0;

        while(!playerPlaced) {
            let randomRow = Math.floor(Math.random() * height);
            let randomCol = Math.floor(Math.random() * width);

            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = pathCharacter;
                playerPlaced = true;
            }
        }
        return field;
    }
}

const myField = new Field(10,10,0.2);

myField.print();
console.log('Move your way (r,l,u,d): ');

while(true) {
    const userInput = prompt('Move: '.toLowerCase().trim());
    myField.move(userInput);
}