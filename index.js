const currRow = document.getElementById("currency-update");

const apiData = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'

function fetchData(apiData) {
    return new Promise(async (resolve, reject)=>{
        try{
            const response = await fetch(apiData);
            const data = await response.json();
            resolve(data);
        }
        catch(error)
        {
            reject(error);
        }
    })
}


function renderData(data){  
    currRow.innerHTML='';  
    data.map((obj)=>{
        const percentageColor = obj.price_change_percentage_24h >=0 ? "green" : "red";
        row = document.createElement("tr");
        row.className="table-rows"
        row.innerHTML = `
        <td class="curr-symbol">
            <div class="curr-symbol-name">
                <img src=${obj.image}>
                <span>${obj.name}</span>
            </div>
        </td>
        <td>${obj.symbol.toUpperCase()}</td>
        <td>$${obj.current_price}</td>
        <td>$${obj.total_volume}3</td>
        <td class="${percentageColor}">${obj.price_change_percentage_24h}%</td>
        <td>Mkt Cap: ${obj.market_cap}</td>`
        currRow.appendChild(row)
    })
    
}


document.getElementById("sortMktCap").addEventListener("click",()=>{
    fetchData(apiData)
    .then((data)=>{
        data.sort((a,b)=>a.market_cap-b.market_cap);
        renderData(data);
    })
    .catch((error)=>{
        console.log("Problem occured while fetching data", error)
    });
});

document.getElementById("sortPercentage").addEventListener("click",()=>{
    fetchData(apiData)
    .then((data)=>{
        data.sort((a,b)=>a.price_change_percentage_24h-b.price_change_percentage_24h);
        renderData(data);
    })
    .catch((error)=>{
        console.log("Problem occured while fetching data", error)
    });
});


fetchData(apiData)
.then((data) =>{
    renderData(data)
}).catch((error) =>{
    console.log("Problem occured while fetching data", error)
});


document.getElementById("search").addEventListener("keyup", (event) =>{
    fetchData(apiData)
    .then((data)=>{
        const searchName = event.target.value;
        let filterName = search(searchName,data);
        renderData(filterName);
        
    })
    .catch((error)=>{
        console.log("Problem occured while fetching data", error)
    });
})

function search(searchname, data) {
    return data.filter((currencyName)=>{
        return currencyName.name.toLowerCase().includes(searchname.toLowerCase())
        || currencyName.symbol.toLowerCase().includes(searchname.toLowerCase());
    })
}


