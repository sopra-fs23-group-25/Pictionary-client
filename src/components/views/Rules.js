import { useHistory } from "react-router-dom";

const Rules = () => {
  const history = useHistory();

  function handleClick() {
    history.push("/lobbies");
  }
  return (
    <div>
      <button onClick={handleClick}>Back</button>
    </div>
  );
};

export default Rules;
