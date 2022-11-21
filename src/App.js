import './App.css';
import {useState} from "react";
import {dijkstra, getNodesInShortestPathOrder} from "./Dijkstra/dijkstra";

const START_ROW = Math.floor(Math.random() * 29);
const START_COL = Math.floor(Math.random() * 64);
const END_ROW = Math.floor(Math.random() * 29);
const END_COL = Math.floor(Math.random() * 64);
console.log(START_ROW, START_COL, END_ROW, END_COL);


function App() {



  const [darkMode, setDarkMode] = useState(true);

  function createNode(row, col) {
      return {
          row,
          col,
          isStart: row === START_ROW && col === START_COL,
          isFinish: row === END_ROW && col === END_COL,
          isWall: false,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          previousNode: null,
          isRead: false,
      };
  }

  const createGrid = (rows, cols) => {
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push(createNode(row, col));
            }
            grid.push(currentRow);
        }
        return grid;
  }

  const initialGrid = createGrid(30, 65);
  const [grid, setGrid] = useState(initialGrid);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const handleClick = () => {
      setDarkMode(!darkMode);
  }

  const setMode = (style) => {
      let backgroundColor, textColor, buttonColor;

      if (darkMode) {
          backgroundColor = "black";
          textColor = 'white';
          buttonColor = "#303030";
      } else {
          backgroundColor = 'white';
          textColor = 'black';
          buttonColor = "#ffe291";
      }

      if (style === 1) {
          return backgroundColor;
      } else if (style === 2) {
          return textColor;
      } else {
            return buttonColor;
        }
  }






  const drawNode = (node) => {
      if (node.isStart) {
          return <img src="https://img.icons8.com/ios-glyphs/30/null/play--v1.png"/>;
      }
      if (node.isFinish) {
          return <img src="https://img.icons8.com/ios-glyphs/30/null/finish-flag.png"/>
      }

  }

  const nodeName = (row, col) => {
        return `node ${row}-${col}`;
  }

  const getNewGridWithWallToggled = (grid, row, col) => {
      const newGrid = grid.slice();
      const node = newGrid[row][col];
      newGrid[row][col] = {
          ...node,
          isWall: !node.isWall,
      };
      return newGrid;
  }
  const getNewGridWithVisitedToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        newGrid[row][col] = {
            ...node,
            isVisited: !node.isVisited,
        };
        return newGrid;
  }
  const getNewGridWithPathToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        newGrid[row][col] = {
            ...node,
            isVisited: !node.isVisited,
            isShortestPath: !node.isShortestPath,
        };
        return newGrid;
  }

  const toggleVisited = (row, col) => {
        const newGrid = getNewGridWithVisitedToggled(grid, row, col);
        setGrid(newGrid);
  }

  const togglePath = (row, col) => {
        const newGrid = getNewGridWithPathToggled(grid, row, col);
        setGrid(newGrid);
  }

  const handleMouseDown = (row, col) => {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
      setMouseIsPressed(true);
  }

  const handleMouseEnter = (row, col) => {
      if (!mouseIsPressed) return;
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
  }

  const handleMouseUp = () => {
      setMouseIsPressed(false);
  }

  const getAnchor= (row, col) => {
      if (grid[row][col].isStart) {
          return "node-start";
      } else if (grid[row][col].isFinish) {
          return "node-finish";
      } else if (grid[row][col].isWall) {
          return "node-wall";
      } else {
          return "";
      }

  }

  const getVisited = (row, col) => {
        if (grid[row][col].isVisited) {
            return "node-visited";
        } else {
            return "";
        }
  }

  const getPath = (row, col) => {
        if (grid[row][col].isShortestPath) {
            return "node-shortest-path";
        } else {
            return "";
        }
  }

  const resetGrid = () => {
        const newGrid = createGrid(30, 65);
        setGrid(newGrid);
  }

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                toggleVisited(node.row, node.col);
            }, 10 * i);
        }
  }

  const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                togglePath(node.row, node.col);
            }, 50 * i);
        }
    }

  const visualizeDijkstra = () => {
        const startNode = grid[START_ROW][START_COL];
        const finishNode = grid[END_ROW][END_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    return (
      <div className="App" style={{backgroundColor: setMode(1), color: setMode(2)}}>
          <div className="header-container">
              <div className="darkmode-container">
                  <label className="darkmode-button" style={{backgroundColor: setMode(3)}}>

                      <input type="checkbox" className="darkmode-input" onClick={handleClick}></input>
                      <span className="darkmode-toggle">
                          <img className="moon" src="https://img.icons8.com/sf-regular/48/null/moon-symbol.png"/>
                      </span>
                      <img className="sun" src="https://img.icons8.com/material-outlined/24/000000/smiling-sun.png"/>

                  </label>
              </div>
              <div className="algorithm-container">
                    <button className="algorithm-button"
                            style={{backgroundColor: setMode(3), color: setMode(2)}}
                            onClick={() => visualizeDijkstra()}
                    >Dijkstra's Algorithm</button>
              </div>
              <div className="header">
                  <header>Visualizer</header>
              </div>
              <div className="reset-container">
                    <button className="reset-button"
                            style={{backgroundColor: setMode(3), color: setMode(2)}}
                            onClick={() => resetGrid()}
                    >Reset</button>
              </div>
          </div>
          <div className="map-container">
              <div className="map">
                  {grid.map((row, rowIndex) => {
                      return (
                            row.map((column, columnIndex) => {
                                return (
                                    <div id={nodeName(rowIndex, columnIndex)}
                                         className={`node ${getAnchor(rowIndex, columnIndex)} ${getVisited(rowIndex, columnIndex)} ${getPath(rowIndex, columnIndex)}`}
                                         onMouseDown={() => {handleMouseDown(rowIndex, columnIndex)} }
                                         onMouseEnter={() => handleMouseEnter(rowIndex, columnIndex)}
                                         onMouseUp={() => handleMouseUp()}>
                                            {drawNode(grid[rowIndex][columnIndex])}
                                    </div>
                                )
                            })
                      )
                  })}
              </div>
          </div>
      </div>

  );
}

export default App;
