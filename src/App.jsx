import UserList from "./components/UserList.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>my app advance</h1>
        <p>Perfecting static data integration</p>
      </header>
      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;
