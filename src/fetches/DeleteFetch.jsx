export const DeleteFetch = (id) => {
    return fetch(`http://localhost:8088/userArt/${id}`, {
        method: "DELETE"
    }).then(res => res.json());
};

