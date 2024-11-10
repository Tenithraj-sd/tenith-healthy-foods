// References to key DOM elements
const chatBox = document.getElementById('chat-box');
const sidebar = document.getElementById('sidebar');
const chatArea = document.getElementById('chat-area');

// Product data including descriptions and images
const productInfo = {
  "ஆந்திரா பருப்பு பொடி": {
    description: "நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது, செரிமானத்தை மேம்படுத்துகிறது, மற்றும் உடல் வலிமையை வழங்குகிறது.",
    image: "ஆந்திரா பருப்பு பொடி.jpg"
  },
  "கருவேப்பிலை பொடி": {
    description: "முடியை வலுப்படுத்துகிறது, கெட்ட கொழுப்பை குறைக்கிறது.",
    image: "கருவேப்பிலை பொடி.jpg"
  },
  // Add additional products as needed
};

// Function to display product information in the chat area
function showProductInfo(product) {
  // Hide sidebar and expand chat area
  hideSidebar();

  // User message for product request
  const message = document.createElement('div');
  message.classList.add('message', 'user-message');
  message.textContent = `You asked for information about ${product}`;
  chatBox.appendChild(message);
  scrollToBottom();

  // Bot response with product details and image
  const productDetails = productInfo[product];
  if (productDetails) {
    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.classList.add('message', 'bot-message');
      botMessage.innerHTML = `
        <p>${productDetails.description}</p>
        <img src="${productDetails.image}" class="bot-image" />
      `;
      chatBox.appendChild(botMessage);
      scrollToBottom();
    }, 1000);
  }
}

// Function to toggle the visibility of the sidebar
function toggleSidebar() {
  if (sidebar.style.display === "none") {
    showSidebar();
  } else {
    hideSidebar();
  }
}

// Function to hide the sidebar and expand chat area
function hideSidebar() {
  sidebar.style.display = "none";
  chatArea.classList.add('full-screen');
}

// Function to show the sidebar and reduce chat area size
function showSidebar() {
  sidebar.style.display = "block";
  chatArea.classList.remove('full-screen');
}

// Function to show contact information in the chat area
function showContactInfo() {
  // Hide sidebar and expand chat area
  hideSidebar();

  // User message for contact request
  const message = document.createElement('div');
  message.classList.add('message', 'user-message');
  message.textContent = "You asked for contact details";
  chatBox.appendChild(message);
  scrollToBottom();

  // Bot response with contact information
  setTimeout(() => {
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot-message');
    botMessage.innerHTML = `
      <p>Contact us for any inquiries:</p>
      <p>Email: <a href="mailto:tenithhealthyfoods@gmail.com">tenithhealthyfoods@gmail.com</a></p>
      <p>WhatsApp: <a href="https://wa.me/9488710427">+91 9488710427</a></p>
      <p>Phone: +91 9488710427</p>
    `;
    chatBox.appendChild(botMessage);
    scrollToBottom();
  }, 1000);
}

// Function to scroll chat area to the latest message
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}