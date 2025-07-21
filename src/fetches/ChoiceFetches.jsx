export const getMusicChoice = () => {
    return fetch (`http://localhost:8088/favMusicChoices`).then(res => res.json());
}

export const getColorChoice = () => {
    return fetch (`http://localhost:8088/favColorChoices`).then(res => res.json());
}

export const getEmotionChoice = () => {
    return fetch (`http://localhost:8088/currentEmotionChoices`).then(res => res.json());
}

export const getAdjectiveChoice = () => {
    return fetch (`http://localhost:8088/adjectiveChoices`).then(res => res.json());
}