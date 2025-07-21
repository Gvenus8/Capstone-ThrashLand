export const PostChoices = (choices) => {
    return fetch ("http://localhost:8088/userArt" , {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(choices)
})
}