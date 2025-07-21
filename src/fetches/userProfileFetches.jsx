export const updateUserBio= (userId, bio) => {
     return fetch(`http://localhost:8088/users/${userId}`)
        .then(res => res.json())
        .then(existingUser => {
             return fetch(`http://localhost:8088/users/${userId}`, {
                 method: "PUT",
                 headers: {
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     ...existingUser,
                     bio : bio
        })
     }) .then(res => res.json())
    });
};
export const updateUserName = (userId, name) => {
     return fetch(`http://localhost:8088/users/${userId}`)
        .then(res => res.json())
        .then(existingUser => {
             return fetch(`http://localhost:8088/users/${userId}`, {
                 method: "PUT",
                 headers: {
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     ...existingUser,
                     name: name
        })
     }) .then(res => res.json())
    });
};

export const updateUserEmail = (userId, email) => {
        return fetch(`http://localhost:8088/users/${userId}`)
        .then(res => res.json())
        .then(existingUser => {
    return fetch(`http://localhost:8088/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...existingUser,  
            email: email 
       })
     }) .then(res => res.json())
    });
}; 