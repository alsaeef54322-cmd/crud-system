// 1. Get Elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxea = document.getElementById("taxea");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let lightbtn = document.getElementById("lightbtn");
let mood = "create";
let tmp;



// دالة حفظ سريعة وموحدة
function saveToStorage() {
    localStorage.setItem("product", JSON.stringify(datapro));
}


///light mode
lightbtn.onclick = function () {

    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        lightbtn.innerHTML = '<i class="fa-solid fa-moon"></i>'
;
        document.body.style.backgroundColor = "#000000f2";
       document.querySelector("h2").style.color = "#fff";
        document.querySelector("p").style.color = "#fff";
        document.querySelector("table").style.color = "#fff";
        
        
    } else {
        lightbtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i'
        document.querySelector("h2").style.color = "black";
         document.querySelector("p").style.color = "black";
         document.querySelector("table").style.color = "black";
        document.body.style.backgroundColor = "#ffffff";
    }
}

// 2. Get Total
function gettotal() {
    if (price.value !== "") {
        let result = (+price.value + +taxea.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = "rgb(7, 161, 7)";
    } else {
        total.innerHTML = "";
        total.style.background = "#d02316";
    }
}

// 3. Get Data From LocalStorage
let datapro;
if (localStorage.getItem("product") !== null) {
    try {
        datapro = JSON.parse(localStorage.getItem("product")) || [];
    } catch (e) {
        datapro = [];
    }
} else {
    datapro = [];
}

// 4. Create / Update Product
submit.onclick = function (event) {
    if (event) event.preventDefault();

    let newpro = {
        title: title.value.trim(),
        price: price.value,
        taxea: taxea.value || 0,
        ads: ads.value || 0,
        discount: discount.value || 0,
        total: total.innerHTML,
        count: count.value,
        category: category.value.trim()
    };

    // Validation
    if (!newpro.title || newpro.price === "" || !newpro.category) {
        alert("Please fill in Title, Price, and Category!");
        return;
    }
    if (title.value != "") {
        if (mood === "create") {
            let quantity = Math.max(1, Number(newpro.count) || 1);
            for (let i = 0; i < quantity; i++) {
                datapro.push({ ...newpro });
            }
        } else {
            datapro[tmp] = newpro;
            mood = "create";
            submit.innerHTML = "Create";
            count.style.display = "block";
        }
    }

    // Save to LocalStorage
    // localStorage.setItem("product", JSON.stringify(datapro));
    saveToStorage();

    clearData();
    showData();
};

// 5. Clear Inputs
function clearData() {
    title.value = "";
    price.value = "";
    taxea.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    total.style.background = "#d02316";
    count.value = "";
    category.value = "";
}

// 6. Show Data
function showData() {
    let table = "";

    for (let i = 0; i < datapro.length; i++) {
        let product = datapro[i];
        if (!product) continue;

        table += `
            <tr>
                <td>${product.title || ''}</td>
                <td>${product.price || ''}</td>
                <td>${product.taxea || 0}</td>
                <td>${product.ads || 0}</td>
                <td>${product.discount || 0}</td>
                <td>${product.total || ''}</td>
                <td>${product.category || ''}</td>
                <td><button onclick="updateData(${i})">Update</button></td>
                <td><button onclick="deleteData(${i})">Delete</button></td>
            </tr>
        `;
    }

    document.getElementById("tbody").innerHTML = table;

    let dletall = document.getElementById("dleteall");
    if (datapro.length > 0) {
        dletall.innerHTML = `
            <button onclick="deleteAllData()">Delete All (${datapro.length})</button>
        `;
    } else {
        dletall.innerHTML = "";
    }
}

// 7. Delete One Product
function deleteData(i) {
    datapro.splice(i, 1);
    saveToStorage();
    showData();
}

// 8. Delete All Products
function deleteAllData() {
    // localStorage.removeItem("product");
    saveToStorage();
    datapro = [];
    showData();
}

// 9. Update Product
function updateData(i) {
    const product = datapro[i];
    if (!product) return;

    title.value = product.title;
    price.value = product.price;
    taxea.value = product.taxea;
    ads.value = product.ads;
    discount.value = product.discount;

    gettotal();

    count.style.display = "none";
    category.value = product.category;
    submit.innerHTML = "Update";
    mood = "update";
    tmp = i;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// 10. Run on Load
showData();

//11. Search Functionality
let searchMood = "title";
function getSearchMood(id) { 
    let search = document.getElementById("search");
    if (id === "searchTitle") {
        searchMood = "title";
        search.placeholder = "Search by title";
    } else {
        searchMood = "category";
        search.placeholder ='Search by category'; 
    }
    search.focus();
    search.value = "";
    showData();


}

function searchData(value) {
    let table = "";
    let searchValue = value.toLowerCase();

    for (let i = 0; i < datapro.length; i++) {
        let product = datapro[i];
        if (!product) continue;

        let titleText = (product.title || "").toLowerCase();
        let categoryText = (product.category || "").toLowerCase();

        let isMatch = false;
        if (searchMood === "title") {
            if (titleText.includes(searchValue)) {
                isMatch = true;
            }
        } else {
            if (categoryText.includes(searchValue)) {
                isMatch = true;
            }
        }

        if (isMatch) {
            table += `
                <tr>
                    <td>${product.title || ''}</td>
                    <td>${product.price || ''}</td>
                    <td>${product.taxea || 0}</td>
                    <td>${product.ads || 0}</td>
                    <td>${product.discount || 0}</td>
                    <td>${product.total || ''}</td>
                    <td>${product.category || ''}</td>
                    <td><button onclick="updateData(${i})">Update</button></td>
                    <td><button onclick="deleteData(${i})">Delete</button></td>
                </tr>
            `;
        }
    }

    document.getElementById("tbody").innerHTML = table;
}

//clear Data
