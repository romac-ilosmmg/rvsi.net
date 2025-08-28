const chatToggle = document.querySelector('.chat-toggle');
const chatbox = document.querySelector('.chatbox');
const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Avatars
const botAvatar = 'Assets/robot.png'; // Bot icon
const userAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png'; // User icon

// Toggle chatbox
chatToggle.addEventListener('click', () => {
    chatbox.style.display = chatbox.style.display === 'flex' ? 'none' : 'flex';
    if (chatbox.style.display === 'flex' && chatBody.children.length === 0) {
        setTimeout(() => botIntro(), 500);
    }
});

// Send message
sendBtn.addEventListener('click', () => sendMessage());
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function appendMessage(text, sender) {
    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row', sender);

    const avatar = document.createElement('img');
    avatar.classList.add('chat-avatar');
    avatar.src = sender === 'bot' ? botAvatar : userAvatar;

    const bubble = document.createElement('div');
    bubble.classList.add('chat-message', sender === 'bot' ? 'bot-message' : 'user-message');
    bubble.innerText = text;

    if (sender === 'bot') {
        messageRow.appendChild(avatar);
        messageRow.appendChild(bubble);
    } else {
        messageRow.appendChild(bubble);
        messageRow.appendChild(avatar);
    }

    chatBody.appendChild(messageRow);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botIntro() {
    appendMessage("Hi there! 👋 I’m Romacky, your friendly virtual assistant.\nNeed a hand? Just type \"help\" to get started.", 'bot');
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    userInput.value = '';

    setTimeout(() => botResponse(text.toLowerCase()), 700);
}

function botResponse(input) {
    if (input === 'hi' || input === 'hello') {
        appendMessage("How can I help you? To start, type \"help\".", 'bot');
    } else if (input === 'help') {
        appendMessage("Here are your options:\n\n1️⃣ Services – Discover what we offer.\n2️⃣ Hire – Need talented manpower?\n3️⃣ Apply – See our job openings.\n4️⃣ Contact – Have questions?\n5️⃣ Details – View company info.", 'bot');
    } else if (input === '1') {
        window.location.href = '/services.html';
    } else if (input === '2') {
        window.location.href = '/hire-manpower.html';
    } else if (input === '3') {
        window.location.href = '/job-vacancies.html';
    } else if (input === '4') {
        window.location.href = '/contacts.html';
    } else if (input === '5') {
        appendMessage("Here are our details:\n\nRomac IloIlo Branch\nAddress: 251-A General Hughes St. IloIlo City\nTelephone: (033) 335-5200\nCellphone: 09190803924\n\nRomac Bacolod Branch\nAddress: Room 300B Silos Building, San Juan St. Bacolod City\nTelephone: (034) 461-7097\nCellphone: 09088983827\n\nRomac Boracay Aklan Branch\nAddress: Unit I&II, Pardico Hill, Hagdan Brgy. Yapak, Malay, Aklan\nTelephone: (036) 286-2338\nCellphone: 09190803921\n\nRomac Cebu Branch\nAddress: 3rd Floor Unit A. Chua Tiam Bldg.A. Del Rosario St. Mandaue City\nTelephone: (032) 383-8068\nCellphone: 09088983836", 'bot');
    } else {
       appendMessage("Sorry, I don't understand you. If you need help, here are your options:\n\n1️⃣ Services\n2️⃣ Hire\n3️⃣ Apply\n4️⃣ Contact\n5️⃣ Details",'bot');
    }
}