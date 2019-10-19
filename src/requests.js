export function getAllMessages() {
    return fetch('http://localhost:8082/api/messages')
    .then(response => response.json())
    .then(data => data)
    .catch(console.log);
}