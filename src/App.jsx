function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍲 AI Recipe Generator</h1>

      <p>
        Welcome! Enter your ingredients and get recipe suggestions.
      </p>

      <input
        type="text"
        placeholder="Example: tomato, onion, egg"
        style={{
          width: "300px",
          padding: "10px",
          marginRight: "10px",
        }}
      />

      <button>Generate Recipe</button>
    </div>
  );
}

export default App;