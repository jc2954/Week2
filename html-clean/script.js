let inputLocationX = window.innerWidth / 2;
let inputLocationY = window.innerHeight / 2;
let inputBoxDirectionX = 1;
let inputBoxDirectionY = 1;
let inputBoxSpeed = 2;


let newTextarea = document.createElement("textarea");

// Configure its attributes
newTextarea.name = "codeInput";
newTextarea.rows = 5;
newTextarea.cols = 40;
newTextarea.placeholder = "Enter your prompt here and hit enter";
newTextarea.className = "code-textarea";
document.body.appendChild(newTextarea);
newTextarea.style.position = "absolute";
newTextarea.style.left = "30px";
newTextarea.style.top = "30px";

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1'; // Ensure the canvas is behind the input box

document.body.appendChild(canvas);

let inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.id = 'input-box';
inputBox.style.position = 'absolute';
inputBox.style.left = inputLocationX + 'px';
inputBox.style.top = inputLocationY + 'px';
inputBox.style.width = '400px';

document.body.appendChild(inputBox);

function updateInputBoxPosition() {
    const inputBox = document.getElementById('input-box');
    inputLocationX += inputBoxDirectionX * inputBoxSpeed;
    inputLocationY += inputBoxDirectionY * inputBoxSpeed;
    inputBox.style.left = inputLocationX + 'px';
    inputBox.style.top = inputLocationY + 'px';

    // Check for collision with window edges
    if (inputLocationX <= 0 || inputLocationX + inputBox.offsetWidth >= window.innerWidth) {
        inputBoxDirectionX *= -1; // Reverse direction on X-axis
    }
    if (inputLocationY <= 0 || inputLocationY + inputBox.offsetHeight >= window.innerHeight) {
        inputBoxDirectionY *= -1; // Reverse direction on Y-axis
    }
      inputBox.style.left = inputLocationX + 'px';
    inputBox.style.top = inputLocationY + 'px';
}


//setInterval(updateInputBoxPosition, 16); // Update position every 16ms (approximately 60fps)
async function askAI(){
    const userInput = newTextarea.value;
    const url="https://itp-ima-replicate-proxy.web.app/api/create_n_get";
    let authToken = "";
    let prompt = userInput;

    const data = {
        model: "anthropic/claude-sonnet-5",
        input: {
        prompt: prompt,
        max_tokens: 1024
 
        }
    };
console.log("Sending request to AI model with prompt:", prompt);
const options ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    if (authToken) {
        options.headers.Authorization = `Bearer ${authToken}`;
    }
    const raw_response = await fetch(url, options);
    const json_response = await raw_response.json();
    if (!raw_response.ok) {
        console.error("AI request failed:", raw_response.status, json_response);
        return;
    }
    console.log("Received response from AI model:", json_response); 
    let parsedResponse = json_response.output.join("");
    if (parsedResponse) {
      inputBox.value = parsedResponse;
    }
    console.log(parsedResponse);
}
newTextarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of the Enter key
        askAI();
    }
})


