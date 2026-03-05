import Admin from "./Admin";
import QRVerify from "./QRVerify";
import "./styles.css";

function App() {
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-title">
          University Credential Verification
        </div>

        {/* <div className="header-wallet">
          <Admin />
        </div> */}
      </header>

      {/* Main Center */}
      <main className="main">
        <QRVerify />
      </main>

    </div>
  );
}

export default App;