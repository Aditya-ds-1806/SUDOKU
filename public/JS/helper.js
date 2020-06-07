function encodeBoard(board) {
    return board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '');
}

export function encodeParams(params) {
    return Object.keys(params).map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`).join('&');
}