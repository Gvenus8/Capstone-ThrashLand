export const getAllUsers = () => {
    return fetch("http://localhost:8088/users")
        .then(res => res.json())
}
export const getAllUserArt = () => {
    return fetch("http://localhost:8088/userArt")
        .then(res => res.json());
}

export const deleteUserArt = (artId) => {
    return fetch(`http://localhost:8088/userArt/${artId}`, {
        method: "DELETE"
    }).then(res => res.json());

}
export const deleteUsers = (userId) => {
    return fetch(`http://localhost:8088/users/${userId}`, {
        method: "DELETE"
    }).then(res => res.json());

}