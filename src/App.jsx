import { useEffect, useState } from "react";

const getLocalStorage = () => {
  const list = localStorage.getItem("list");
  if (list) return JSON.parse(list);
  else return [];
};

const App = () => {
  const [itemName, setItemName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [error, setError] = useState({ status: false, msg: "", type: "" });

  const errorToDisplay = (status = false, msg = "", type = "") => {
    return { status, msg, type };
  };

  const addToList = (e) => {
    e.preventDefault();
    if (!itemName)
      setError(errorToDisplay(true, "Please enter value", "danger"));
    else {
      const newItem = {
        id: new Date().getTime().toString(),
        title: itemName,
        completed: false,
      };
      setList([...list, newItem]);
      setError(errorToDisplay(true, "Item added to the list", "success"));
      setItemName("");
    }
  };

  const itemToDelete = (id) => {
    setList(list.filter((item) => item.id !== id));
    setError(errorToDisplay(true, "Item deleted from list", "success"));
  };

  const complete = (id) => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id == id ? { ...item, completed: !item.completed } : item
      )
    );
    const selectedItem = list.filter((item) => item.id == id);
    if (selectedItem[0].completed)
      setError(errorToDisplay(true, "Item marked as uncompleted", "success"));
    else setError(errorToDisplay(true, "Item marked as completed", "success"));
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(errorToDisplay());
    }, 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="">
      {error.status && <div className={`${error.type}`}>{error.msg}</div>}
      <h1 className="text-3xl w-max m-auto pt-12">Grocery Bud</h1>
      <div className="w-[6rem] border-2 border-purple-500 m-auto mt-1"></div>
      <form
        onSubmit={addToList}
        className="w-[80%] max-w-2xl m-auto flex flex-wrap gap-1 items-center justify-center my-8"
      >
        <input
          onChange={(e) => setItemName(e.target.value)}
          value={itemName}
          className="max-[500px]:w-full bg-gray-300 px-2 py-[2px] outline-none border-2 rounded focus:border-purple-500"
          type="text"
          placeholder="e.g egg"
        />
        <button className="max-[500px]:w-full bg-purple-400 px-4 py-1 rounded">
          Add Item
        </button>
      </form>
      {list.length > 0 &&
        list.map((item) => {
          const { id, title, completed } = item;
          return (
            <div
              className="max-[500px]:px-3 w-[80%] max-w-[23rem] m-auto flex items-center justify-between shadow-lg py-2 my-1"
              key={id}
            >
              <div className="flex gap-2">
                <input
                  onChange={() => complete(id)}
                  className="w-4"
                  type="checkbox"
                  id={id}
                  checked={completed}
                />
                <label
                  htmlFor={id}
                  className={`capitalize ${completed && "line-through"}`}
                >
                  {title}
                </label>
              </div>

              <button
                onClick={() => itemToDelete(id)}
                className="bg-red-400 w-[1.5rem] h-[1.5rem] text-[1.5rem] px-2 rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default App;
