// Constants
const YES_VALUE = "Yes"
const NO_VALUE = "No"

// Helper
function testImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        resolve(true);
      };
      img.onerror = function() {
        reject(false);
      };
      img.src = url;
    });
  }

function getCharacters() {
    const userIdToken = localStorage.getItem('userIdToken')
    if (userIdToken === null) {
      location.href = "/login"
      return
    }

    const params = new URLSearchParams({ userIdToken: userIdToken})

    fetch('/characters?' + params, {method: 'GET'})
    .then(response => response.json())
    .then(characterData => {
        const characterTable = document.getElementById("characters");
        var totalIncome = 0;
    
        characterData.forEach(character => {
            const newRow = characterTable.insertRow();
    
            const characterNameCell = newRow.insertCell();
            characterNameCell.innerHTML = character["characterName"]

            var img = document.createElement('img')
            if (character['characterImageUrl']) {
                testImage(character['characterImageUrl'])
                .then(() => {
                    img.src = character['characterImageUrl']
                })
                .catch(() => {
                    img.src = '/static/images/bluesnail.webp'
                });
            } else {
                img.src = '/static/images/bluesnail.webp'
            }
            characterNameCell.appendChild(img)

            const hillaCell = newRow.insertCell();
            hillaCell.innerHTML = character["hilla"] ? YES_VALUE : NO_VALUE

            const pinkBeanCell = newRow.insertCell();
            pinkBeanCell.innerHTML = character["pinkbean"] ? YES_VALUE : NO_VALUE

            const cygnusCell = newRow.insertCell();
            cygnusCell.innerHTML = character["cygnus"] ? YES_VALUE : NO_VALUE

            const zakumCell = newRow.insertCell();
            zakumCell.innerHTML = character["zakum"] ? YES_VALUE : NO_VALUE

            const queenCell = newRow.insertCell();
            queenCell.innerHTML = character["queen"] ? YES_VALUE : NO_VALUE

            const pierreCell = newRow.insertCell();
            pierreCell.innerHTML = character["pierre"] ? YES_VALUE : NO_VALUE

            const vonbonCell = newRow.insertCell();
            vonbonCell.innerHTML = character["vonbon"] ? YES_VALUE : NO_VALUE

            const pnoCell = newRow.insertCell();
            pnoCell.innerHTML = character["pno"] ? YES_VALUE : NO_VALUE

            const magnusCell = newRow.insertCell();
            magnusCell.innerHTML = character["magnus"] ? YES_VALUE : NO_VALUE

            const vellumCell = newRow.insertCell();
            vellumCell.innerHTML = character["vellum"] ? YES_VALUE : NO_VALUE

            const papCell = newRow.insertCell();
            papCell.innerHTML = character["pap"] ? YES_VALUE : NO_VALUE;

            const akechiCell = newRow.insertCell();
            akechiCell.innerHTML = character["akechi"] ? YES_VALUE : NO_VALUE;

            const lotusCell = newRow.insertCell();
            lotusCell.innerHTML = character["lotus"] ? YES_VALUE : NO_VALUE;

            const damienCell = newRow.insertCell();
            damienCell.innerHTML = character["damien"] ? YES_VALUE : NO_VALUE;

            const slimeCell = newRow.insertCell();
            slimeCell.innerHTML = character["slime"] ? YES_VALUE : NO_VALUE;

            const totalIncomeCell = newRow.insertCell();
            totalIncomeCell.innerHTML = character["totalIncome"].toLocaleString('en-US', {})

            totalIncome += character["totalIncome"]

              // Add edit button
            const editCell = newRow.insertCell();
            const editBtn = document.createElement("button");
            editBtn.innerHTML = "Edit";
            editBtn.className = "btn btn-secondary";
            editBtn.addEventListener("click", function() {
                location.href = "/edit_character?name=" + character["characterName"]
            });
            editCell.appendChild(editBtn);

            // Add delete button
            const deleteCell = newRow.insertCell();
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Delete";
            deleteBtn.className = "btn btn-danger";
            deleteBtn.addEventListener("click", function() {
                deleteCharacter(character["characterName"]);
            });
            deleteCell.appendChild(deleteBtn);
        });

        var totalIncomeText = document.createElement('div');
        const incomeString = "Total Weekly Income: " + totalIncome.toLocaleString('en-US', {}) + " mesos."
        totalIncomeText.textContent = incomeString
        totalIncomeText.className = "text-center font-weight-bold display-4"
        document.body.appendChild(totalIncomeText)

    })
    .catch(error => console.error(error));
}

function deleteCharacter(characterName) {
    const userIdToken = localStorage.getItem('userIdToken')
    const params = new URLSearchParams({ name: characterName, userIdToken: userIdToken})

    if (confirm("Are you sure you want to delete this character?")) {
        fetch('/characters?' + params, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response => {
            location.reload();
          }))
          .catch(error => {
            console.error(error);
          });
    }

}

