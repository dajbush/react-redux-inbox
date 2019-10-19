export function getAllMessages() {
    return fetch('http://localhost:8082/api/messages')
    .then(response => response.json())
    .then(data => data)
    .catch(console.log);
}

export function toggleStar(messageIds) {
    console.log('messageIds', messageIds);
    return fetch("http://localhost:8082/api/messages", 
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'PATCH',
                    body: JSON.stringify({
                        messageIds: messageIds,
                        command: "star"
                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}

export function markMessageRead(messageIds, read) {
    console.log('messageIds', messageIds);
    return fetch("http://localhost:8082/api/messages", 
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'PATCH',
                    body: JSON.stringify({
                        messageIds: messageIds,
                        command: "read",
                        read: read
                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}

export function deleteMessages() {
    return fetch('http://localhost:8082/api/messages', 
                {
                    method: 'PATCH',
                    body: JSON.stringify({

                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}