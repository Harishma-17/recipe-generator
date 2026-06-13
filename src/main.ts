import Groq from "groq-sdk";
console.log("KEY =", import.meta.env.VITE_GROQ_API_KEY);
const groq = new Groq({
  apiKey: apiKey: import.meta.env.VITE_GROQ_API_KEY
  dangerouslyAllowBrowser: true,
});

document.querySelector('#app')!.innerHTML = `
<div style="padding:20px;font-family:Arial">
  <h1>🍲 AI Recipe Generator</h1>

  <p>Enter ingredients and get recipe ideas.</p>

  <input
    id="ingredients"
    type="text"
    placeholder="Example: tomato, onion, egg"
    style="padding:10px;width:300px;"
  />

  <br><br>

  <button id="generateBtn" style="padding:10px 20px;">
    Generate Recipe
  </button>

  <div id="result" style="margin-top:20px;"></div>
</div>
`;

const button = document.getElementById("generateBtn");
const result = document.getElementById("result");

button?.addEventListener("click", async () => {
  const ingredients = (
    document.getElementById("ingredients") as HTMLInputElement
  ).value;

  result!.innerHTML = "Generating recipe...";

  try {
    const prompt = `Create a simple recipe using these ingredients: ${ingredients}`;

const response = await groq.chat.completions.create({
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  model: "llama-3.3-70b-versatile",
});

const recipe = response.choices[0].message.content;


    result!.innerHTML = `
      <h3>Recipe Suggestion</h3>
      <p>${recipe}</p>
    `;
  } catch (error: any) {
  console.log(error);
  result!.innerHTML = error.message;
}
});