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

export function deleteMessages(messageIds) {
    return fetch('http://localhost:8082/api/messages', 
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'PATCH',
                    body: JSON.stringify({
                        messageIds: messageIds,
                        command: "delete"
                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}

export function editLabels(messageIds, add, label) {
    return fetch('http://localhost:8082/api/messages', 
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'PATCH',
                    body: JSON.stringify({
                        messageIds: messageIds,
                        command: add ? "addLabel" : "removeLabel",
                        label: label
                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}

export function createMessage(subject, body) {
    return fetch('http://localhost:8082/api/messages', 
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify({
                        subject: subject,
                        body: body
                    })
                }
    ).then(response => response.json())
    .then(data => data)
    .catch(console.log);
}