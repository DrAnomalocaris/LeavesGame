var player1=null;
var player2=null;
var player1_func=null;
var player2_func=null;
var GAME={};

function randomLeaves() {
    return Math.floor(Math.pow(10, Math.random() * 7));
}
function set_leaves() {
    GAME['leafs'] = randomLeaves() 
    updateLeavesDisplay();

}
function updateLeavesDisplay() {
    const leavesDisplay = document.getElementById('leaves-number');
    leavesDisplay.textContent = GAME['leafs'];
}

set_leaves()


var leaves = randomLeaves()

function setPlayer1Strategy(strategyName) {
    player1 = { strategy: strategyName, leafs: 0 };
    updatePlayerUI(player1, 'player1-container');
}

function setPlayer2Strategy(strategyName) {
    player2 = { strategy: strategyName, leafs: 0 };
    updatePlayerUI(player2, 'player2-container');
}

function removePlayer1Strategy() {
    player1 = null;
    updatePlayerUI(player1, 'player1-container');
}

function removePlayer2Strategy() {
    player2 = null;
    updatePlayerUI(player2, 'player2-container');
}

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('strategies-container');

    // Loop through each strategy in the strategies object
    for (const [strategyName, strategy] of Object.entries(strategies)) {
        // Create a div to hold each strategy
        const strategyDiv = document.createElement('div');
        strategyDiv.className = 'strategy';

        // Create and append the title
        const title = document.createElement('h3');
        title.textContent = strategyName;
        strategyDiv.appendChild(title);

        // Create and append the description
        const description = document.createElement('p');
        description.textContent = strategy.description;
        strategyDiv.appendChild(description);

        // Create and append the button
        const button = document.createElement('button');
        button.textContent = strategyName;
        button.classList.add('strategy-button'); // Add class for styling and event handling
        strategyDiv.appendChild(button);

        // Append the strategy div to the container
        container.appendChild(strategyDiv);

        // Add event listener to strategy button
        button.addEventListener('click', function() {
            const strategyName = button.textContent.trim(); // Get the strategy name from the button text

            // Check if the button is already clicked (toggled)
            const isToggled = button.classList.contains('toggled');

            if (!isToggled) {
                // Toggle the button
                button.classList.add('toggled');

                // Check if player1 is null, then assign the strategy to player1
                if (player1 === null) {
                    setPlayer1Strategy(strategyName);
                    player1_func = strategy.call;
                }
                // Check if player2 is null, then assign the strategy to player2
                else if (player2 === null) {
                    setPlayer2Strategy(strategyName);
                    player2_func= strategy.call;
                }
            } else {
                // Untoggle the button
                button.classList.remove('toggled');

                // Check if the strategy belongs to player1, then remove it
                if (player1 !== null && player1.strategy === strategyName) {
                    removePlayer1Strategy();
                    player1_func=null;
                }
                // Check if the strategy belongs to player2, then remove it
                else if (player2 !== null && player2.strategy === strategyName) {
                    removePlayer2Strategy();
                    player2_func=null;
                }
            }
        });
    }
});


// Function to update player UI whenever player1 or player2 changes
// Update the updatePlayerUI function to add margin-bottom to the container
function updatePlayerUI(player, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    if (player !== null) {
        // Create a div to hold the strategy
        const strategyDiv = document.createElement('div');
        strategyDiv.className = 'strategy';
        strategyDiv.textContent = player.strategy;
        container.appendChild(strategyDiv);

        // Create a div to hold the leaves number
        const leavesDiv = document.createElement('div');
        leavesDiv.className = 'leaves';
        leavesDiv.textContent = `Leaves: ${player.leafs}`;
        container.appendChild(leavesDiv);
    }
}

// Initialize player UI
updatePlayerUI(player1, 'player1-container');
updatePlayerUI(player2, 'player2-container');



GAME.set_game= function(){
    if (Math.random()<.5){
        GAME['player1']=player1;
        GAME['player2']=player2;
    } else{
        GAME['player1']=player2;
        GAME['player2']=player1;
    }
    GAME.history=[];
}
GAME.set_game()
document.addEventListener("DOMContentLoaded", function() {
    // Your existing code here

    // Function to run a game round and check if it's over
    function runRound() {
        // Run a single round of the game
        if (GAME.round()) {
            // If the round is not over, schedule the next round
            requestAnimationFrame(runRound); // Or setTimeout(runRound, delayInMilliseconds) for a fixed delay
        }
    }

    // Add event listener to round button
    const roundButton = document.getElementById('round-button');
    roundButton.addEventListener('click', function() {
        // Start running rounds when the button is clicked
        runRound();
    });
});

// Define GAME.round function
GAME.round = function() {
    if (GAME.leafs > 0) {
        if (GAME.history.length % 2 == 0) {
            p = player1;
            container = 'player1-container';
        } else {
            p = player2;
            container = 'player2-container';
        }
        var ask = strategies[p.strategy].call(GAME.history);
        if (ask < GAME.leafs) {
            p.leafs += ask;
            GAME.leafs -= ask;
            GAME.history.push({ "asked": ask, "rewarded": true });
        } else if (ask > GAME.leafs) {
            GAME.history.push({ "asked": ask, "rewarded": false });
        }   else if (ask==GAME.leafs){
            GAME.history.push({ "asked": ask, "rewarded": true });
        }
        updateLeavesDisplay();
        updatePlayerUI(p, container);
        return true; // Return true to indicate the round is not over
    } else {
        if (player1.leafs>player2.leafs){
            console.log("player1 wins")
        } else if (player1.leafs<player2.leafs){
            console.log("player2 wins")
        } else if (player1.leafs==player2.leafs){
            console.log("draw")
        
        }
        
        return false; // Return false to indicate the round is over
    }
};
