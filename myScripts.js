const absoluteUri = "http://avanzada2-parcial1.herokuapp.com";
var clients = {
    list: [],
    asc: true
};
var accounts = [];

window.addEventListener('load', async () => {
    document.getElementById("btn-add").addEventListener('click', () => {
        addClientAcount();
        getClientsAccounts();
    });

    document.getElementById("Name").addEventListener('click', sortClients);

    await getClientsAccounts();
    sortClients();  
});


async function addClientAcount() {
    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let balance = document.getElementById("balance").value;
    let params = `first_name=${fname}&last_name=${lname}&email=${email}`;
    let client;
    
    await sendRequest('POST', 'api/clients', params)
    .then(response => {
        console.log("Client created. " + response);
        client = response;
    })
    .catch(reason => console.log("Error creating client. " + reason));

    params = `client_id=${client.id}&balance=${balance}`;

    await sendRequest('POST', 'api/accounts', params)
    .then(response => console.log("Account created. " + response))
    .catch(reason => console.log("Error creating account. " + reason));
}

function sendRequest(method, url, params) {
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    console.log(params);
    return new Promise((resolve, reject) => {
        request.open(method, `${absoluteUri}/${url}?${params}`, true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject(request.statusText);
            }
        }
        request.onerror = () => reject(request.statusText);
        request.send(params);
    });
}

async function getClientsAccounts() {

    await sendRequest('GET', 'api/clients', '')
    .then(response => clients.list = response)
    .catch(reason => console.log("Error obteniendo los clientes. " + reason));
    
    console.log(clients);
    
    await sendRequest('GET', 'api/accounts', '')
    .then(response => accounts = response)
    .catch(reason => console.log("Error obteniendo cuentas. " + reason));
    console.log(accounts);
}

function showData() {
    let table = document.getElementById("table-body");
    while (table.hasChildNodes()) {  
        table.removeChild(table.firstChild);
    }
    clients.list.forEach(element => {
        let tr = document.createElement('tr');
        let id = document.createElement('td');
        let name = document.createElement('td');
        let email = document.createElement('td');
        var bal = document.createElement('td');
        var last = document.createElement('td');
        id.innerHTML = element.id;
        name.innerHTML = element.last_name + " " + element.first_name; 
        email.innerHTML = element.email;
        bal.innerHTML = "S/C";
        last.innerHTML = "S/C";
        accounts.forEach(e => {
            if(element.account_id == e.id){
                bal.innerHTML = e.balance; 
                last.innerHTML = e.last_operation_date
            }
        });
        tr.appendChild(id);
        tr.appendChild(name);
        tr.appendChild(email);
        tr.appendChild(bal);
        tr.appendChild(last);
        table.appendChild(tr);
    });
}

function sortClients() {

    if(clients.asc) {
        clients.list = clients.list.sort((a,b) => {
            return a.last_name > b.last_name ? 1 : -1;
        });
    } else {
        clients.list = clients.list.sort((a,b) => {
            return a.last_name < b.last_name ? 1 : -1;
        });
    }

    let thName = document.getElementById("NameArrow");
    console.log(thName.classList);
    
    clients.asc ? thName.classList.replace("fa-sort-up", "fa-sort-down") : thName.classList.replace("fa-sort-down", "fa-sort-up") 

    clients.asc = !clients.asc;


   

    showData();
}