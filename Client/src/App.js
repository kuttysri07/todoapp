import Inputtodo from "./components/Inputtodo"
import Listtodo from "./components/Listtodo"

const App = () => {
  return (
    <div>
      <div className="container">
      <Inputtodo />
      <Listtodo />
      </div>

    </div>
  )
}

export default App