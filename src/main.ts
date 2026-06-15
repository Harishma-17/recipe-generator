import Groq from "groq-sdk";
console.log("KEY =", import.meta.env.VITE_GROQ_API_KEY);
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

document.querySelector('#app')!.innerHTML = `
<div style="
padding:20px;
font-family:Arial;
max-width:900px;
margin:auto;
text-align:center;
">
 <img
src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
width="100%"
style="height:250px;object-fit:cover;border-radius:15px;"
/>
<h1>🍲 AI Recipe Generator</h1>

  <p>Enter ingredients and get recipe ideas.</p>

  <input
    id="ingredients"
    type="text"
    placeholder="Example: tomato, onion, egg"
    style="padding:10px;width:300px;"
  />

  <br><br>
  <button
id="generateBtn"
style="
padding:12px 24px;
background:#ff6b35;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
"
>

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
const prompt = `
Using these ingredients: ${ingredients}

Generate 3 different recipes.

For each recipe provide:

Recipe Name
Ingredients
Steps
Cooking Time

Make the recipes easy and beginner friendly.
`;
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
<div
style="
background:white;
padding:25px;
border-radius:15px;
box-shadow:0px 4px 15px rgba(0,0,0,0.15);
margin-top:20px;
"
>

<img
src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
style="
width:100%;
max-width:500px;
border-radius:15px;
"
/>

<h2>🍽 Recipe Suggestions</h2>

<div style="font-size:40px;">
🍅 🧅 🥚
</div>

<pre
style="
white-space:pre-wrap;
text-align:left;
font-size:15px;
line-height:1.6;
"
>
${recipe}
</pre>

</div>
`;
} catch (error: any) {
  console.log(error);
  result!.innerHTML = error.message;
}
});