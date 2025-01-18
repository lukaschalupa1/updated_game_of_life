
document.addEventListener('DOMContentLoaded', () => {
    let rows = 20;
    let cols = 20;
    let playing = false;
    let timer;
    let reproductionTime = 500;
    
    let grid = [];
    let nextGrid = [];
    
    createGrid();
    setupControls();
    
    function createGrid() {
      const gridContainer = document.getElementById('gridContainer');
      const table = document.createElement('table');
      for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        grid[i] = [];
        nextGrid[i] = [];
        for (let j = 0; j < cols; j++) {
          const td = document.createElement('td');
          td.className = 'dead';
          td.id = `${i}_${j}`;
          td.onclick = () => toggleCell(i, j);
          tr.appendChild(td);
          grid[i][j] = 0;
          nextGrid[i][j] = 0;
        }
        table.appendChild(tr);
      }
      gridContainer.appendChild(table);
    }
  
    function toggleCell(row, col) {
      const cell = document.getElementById(`${row}_${col}`);
      if (grid[row][col] === 0) {
        cell.className = 'live';
        grid[row][col] = 1;
      } else {
        cell.className = 'dead';
        grid[row][col] = 0;
      }
    }
  
    function setupControls() {
      document.getElementById('start').addEventListener('click', () => {
        playing = !playing;
        document.getElementById('start').innerText = playing ? 'Pause' : 'Start';
        if (playing) play();
      });
  
      document.getElementById('clear').addEventListener('click', () => {
        playing = false;
        document.getElementById('start').innerText = 'Start';
        resetGrid();
      });
  
      document.getElementById('random').addEventListener('click', randomizeGrid);
  
      document.getElementById('speed').addEventListener('input', (e) => {
        reproductionTime = e.target.value;
      });
    }
  
    function play() {
      computeNextGeneration();
      if (playing) timer = setTimeout(play, reproductionTime);
    }
  
    function computeNextGeneration() {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          applyRules(row, col);
        }
      }
      updateGrid();
    }
  
    function applyRules(row, col) {
      const neighbors = countNeighbors(row, col);
      if (grid[row][col] === 1) {
        nextGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        nextGrid[row][col] = neighbors === 3 ? 1 : 0;
      }
    }
  
    function countNeighbors(row, col) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const r = row + i;
          const c = col + j;
          if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 1) {
            count++;
          }
        }
      }
      return count;
    }
  
    function updateGrid() {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = document.getElementById(`${row}_${col}`);
          grid[row][col] = nextGrid[row][col];
          cell.className = grid[row][col] === 1 ? 'live' : 'dead';
        }
      }
    }
  
    function resetGrid() {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          grid[row][col] = 0;
          nextGrid[row][col] = 0;
          document.getElementById(`${row}_${col}`).className = 'dead';
        }
      }
    }
  
    function randomizeGrid() {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          grid[row][col] = Math.random() > 0.5 ? 1 : 0;
          document.getElementById(`${row}_${col}`).className =
            grid[row][col] === 1 ? 'live' : 'dead';
        }
      }
    }
  });  

// Add logic for dynamic resizing, skins, adjustable cell sizes, and rule toggling
document.addEventListener('DOMContentLoaded', () => {
    const skinToggle = document.getElementById('skinToggle');
    const gridSizeInput = document.getElementById('gridSize');
    const altRulesToggle = document.getElementById('altRulesToggle');

    let isDarkMode = true;
    let gridCellSize = 20;
    let useAltRules = false;

    // Adjust skin styles
    skinToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode', !isDarkMode);
    });

    // Update cell size
    gridSizeInput.addEventListener('change', (e) => {
        gridCellSize = parseInt(e.target.value, 10);
        applyCellSize();
    });

    // Toggle alternate rules
    altRulesToggle.addEventListener('change', (e) => {
        useAltRules = e.target.checked;
    });

    function applyCellSize() {
        document.querySelectorAll('td').forEach(cell => {
            cell.style.width = `${gridCellSize}px`;
            cell.style.height = `${gridCellSize}px`;
        });
    }

    function applyRules(row, col) {
        const neighbors = countNeighbors(row, col);
        if (grid[row][col] === 1) {
            nextGrid[row][col] = useAltRules
                ? neighbors === 4 // Alternate rule example
                : neighbors === 2 || neighbors === 3;
        } else {
            nextGrid[row][col] = useAltRules
                ? neighbors === 3 || neighbors === 5 // Alternate rule example
                : neighbors === 3;
        }
    }

    // Dynamic resizing of grid based on viewport size
    function resizeGrid() {
        rows = Math.floor(window.innerHeight / gridCellSize) - 5;
        cols = Math.floor(window.innerWidth / gridCellSize) - 5;
        resetGrid();
        createGrid();
    }

    window.addEventListener('resize', resizeGrid);
    resizeGrid(); // Call initially to set up
});
