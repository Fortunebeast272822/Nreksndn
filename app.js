let gapiLoaded = false;
let authToken = '';

// Load the Google API client library and auth2 library
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initialize the client with API key and OAuth 2.0 credentials
function initClient() {
  gapi.client.init({
    apiKey: 'YOUR_API_KEY', // Replace with your API key
    clientId: '171136606059-q1hid5d2o4ei1ph19ucpcv3coupq3o8m.apps.googleusercontent.com', // Your client ID
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    scope: 'https://www.googleapis.com/auth/gmail.send'
  }).then(function () {
    gapiLoaded = true;
    const authButton = document.getElementById('auth-button');
    authButton.onclick = handleAuthClick;
  });
}

// Handle the OAuth 2.0 authorization flow
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn().then(function () {
    authToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    document.getElementById('message-form').style.display = 'block';
  });
}

// Send an email
function sendEmail() {
  const to = document.getElementById('to').value;
  const subject = document.getElementById('subject').value;
  const body = document.getElementById('body').value;

  const email = [
    'From: me',
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');

  const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': encodedEmail
    }
  }).then(function (response) {
    console.log('Message sent', response);
  }).catch(function (error) {
    console.error('Error sending message', error);
  });
}

// Add event listener to the send button
document.getElementById('send-button').addEventListener('click', sendEmail);

// Load the client library
handleClientLoad();
