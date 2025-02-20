import "./styles.css";
import data from "./data.json";
import { useEffect, useState } from "react";

function Card({ myData, setCurrent, current }) {
  const [isOpen, setIsOpen] = useState({});

  const handleClick = ({ id, isFolder }) => {
    if (isFolder) {
      setIsOpen((prev) => ({
        ...prev,
        [id]: !isOpen[id],
      }));
      setCurrent(id);
      console.log("current: ", current);
    }
  };

  return (
    <>
      {myData.map((d) => (
        <div className={`card ${current === d.id && "active"}`}>
          <div
            onClick={() => {
              handleClick({ id: d.id, isFolder: d.isFolder });
            }}
            className="name"
          >
            {d.isFolder && (isOpen[d.id] ? <span>- </span> : <span>+ </span>)}
            <span className="name">{d.name}</span>
          </div>
          {isOpen[d.id] && d.children && (
            <Card
              myData={d.children}
              setCurrent={setCurrent}
              current={current}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function App() {
  const [myData, setMyData] = useState(data);
  const [current, setCurrent] = useState(null);
  // Recursive function to add a new folder
  const addFolder = (data, id, name) => {
    return data.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          children: [
            ...(node.children || []), // Ensure children exist before spreading
            {
              id: Date.now().toString(),
              name,
              isFolder: true,
              children: [],
            },
          ],
        };
      } else if (node.children) {
        return { ...node, children: addFolder(node.children, id, name) };
      }
      return node;
    });
  };

  const handleAdd = (id) => {
    if (!id) {
      alert("Please select a folder to add a subfolder.");
      return;
    }

    let name = prompt("Enter folder name:");
    if (!name) return;

    setMyData((prevData) => addFolder(prevData, id, name));
  };

  return (
    <div className="App">
      <h1>File Explorer</h1>
      <div className="container">
        <div className="head">
          <span onClick={() => handleAdd(current)}>add</span>
        </div>
        <Card myData={myData} setCurrent={setCurrent} current={current} />
      </div>
    </div>
  );
}
