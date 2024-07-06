const socket = io('http://localhost:5000'); // Update this with your backend's URL

// Function to load conversations
async function loadConversations() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const token = user.token;

    try {
        const response = await fetch('http://localhost:5000/api/conversations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            const conversationList = document.getElementById('conversation-list');
            conversationList.innerHTML = '';

            data.conversations.forEach(conversation => {
                const conversationItem = document.createElement('div');
                conversationItem.classList.add('conversation-item');
                conversationItem.setAttribute('data-user-id', conversation.userId);
                conversationItem.innerHTML = `
                    <img src="${conversation.avatar}" alt="Avatar" class="message-avatar">
                    <div class="conversation-info">
                        <span class="username">${conversation.username}</span>
                        <span class="last-message">${conversation.lastMessage}</span>
                    </div>
                `;
                conversationList.appendChild(conversationItem);

                conversationItem.addEventListener('click', function () {
                    document.querySelectorAll('.conversation-item').forEach(item => item.classList.remove('active'));
                    conversationItem.classList.add('active');
                    const selectedConversationId = conversation.userId;
                    loadMessages(selectedConversationId, user.id);
                });
            });
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Function to load messages
async function loadMessages(receiverId, senderId) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        const response = await fetch(`http://localhost:5000/api/chat/${senderId}/${receiverId}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();

        if (data.success) {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = ''; // Clear existing messages

            const receiver = await fetchReceiverDetails(receiverId);
            document.getElementById('receiver-avatar').src = receiver.avatar || 'images/avatar.png';
            document.getElementById('chat-with').innerText = `Chat with ${receiver.name}`;

            data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message');
                if (message.senderId === senderId) {
                    messageElement.classList.add('sent');
                    messageElement.innerHTML = `
                        <div class="message-content">
                            <p>${message.content}</p>
                            <span class="timestamp">${new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                        <img src="${user.avatar}" class="message-avatar">
                    `;
                } else {
                    messageElement.classList.add('received');
                    messageElement.innerHTML = `
                        <img src="${receiver.avatar}" class="message-avatar">
                        <div class="message-content">
                            <p>${message.content}</p>
                            <span class="timestamp">${new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                    `;
                }
                chatMessages.appendChild(messageElement);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            console.error('Failed to load messages:', data.message);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Function to fetch receiver details
async function fetchReceiverDetails(receiverId) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const token = user.token;
    const response = await fetch(`http://localhost:5000/api/users/${receiverId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
        return data.user;
    } else {
        console.error('Failed to load receiver details:', data.message);
        return { name: 'Unknown', avatar: 'images/avatar.png' };
    }
}

// Function to send a new message
async function sendMessage(senderId, receiverId, content) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const token = user.token;
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ senderId, receiverId, content })
        });

        const data = await response.json();
        if (data.success) {
            socket.emit('sendMessage', { senderId, receiverId, content });
            loadMessages(receiverId, senderId);
        } else {
            console.error('Failed to send message:', data.message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (user) {
        document.getElementById('user-profile').style.display = 'flex';
        document.getElementById('username').innerText = user.name;
        document.getElementById('userAvatar').src = user.avatar || 'images/avatar.png';

        loadConversations();

        document.getElementById('send-button').addEventListener('click', function () {
            const messageInput = document.getElementById('message-input');
            const messageContent = messageInput.value.trim();
            const activeConversation = document.querySelector('.conversation-item.active');
            if (activeConversation) {
                const receiverId = activeConversation.getAttribute('data-user-id');
                if (messageContent) {
                    sendMessage(user.id, receiverId, messageContent);
                    messageInput.value = '';
                }
            } else {
                alert('Please select a conversation first.');
            }
        });

        document.getElementById('message-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const messageContent = e.target.value.trim();
                const activeConversation = document.querySelector('.conversation-item.active');
                if (activeConversation) {
                    const receiverId = activeConversation.getAttribute('data-user-id');
                    if (messageContent) {
                        sendMessage(user.id, receiverId, messageContent);
                        e.target.value = '';
                    }
                } else {
                    alert('Please select a conversation first.');
                }
            }
        });
    } else {
        window.location.href = 'login.html';
    }
});

socket.on('receiveMessage', () => {
    const activeConversation = document.querySelector('.conversation-item.active');
    if (activeConversation) {
        const receiverId = activeConversation.getAttribute('data-user-id');
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        loadMessages(receiverId, user.id);
    }
});

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
});
