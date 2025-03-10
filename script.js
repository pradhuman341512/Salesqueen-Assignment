document.addEventListener("DOMContentLoaded", () => {
    loadEntries();
});

document.getElementById("searchInput").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
    });
});

function showAddForm() {
    document.getElementById("addForm").style.display = "block";
}

function hideAddForm() {
    document.getElementById("addForm").style.display = "none";
}

function addEntry() {
    let id = Date.now();
    let entry = {
        id,
        licence: document.getElementById("licence").value,
        productKey: document.getElementById("productKey").value,
        expiration: document.getElementById("expiration").value,
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        manufacturer: document.getElementById("manufacturer").value,
        totalSeats: document.getElementById("totalSeats").value,
        availableSeats: document.getElementById("availableSeats").value,
        inventoryQty: document.getElementById("inventoryQty").value
    };
    
    if (Object.values(entry).includes("")) return;
    
    let data = JSON.parse(localStorage.getItem("licenseData")) || [];
    data.push(entry);
    localStorage.setItem("licenseData", JSON.stringify(data));
    
    hideAddForm();
    loadEntries();
}

let currentPage = 1;
const entriesPerPage = 10;

function loadEntries() {
    let data = JSON.parse(localStorage.getItem("licenseData")) || [];
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    
    let start = (currentPage - 1) * entriesPerPage;
    let end = start + entriesPerPage;
    let paginatedData = data.slice(start, end);

    paginatedData.forEach((entry, index) => {
        let row = `
            <tr>
                <td><input type="checkbox"></td>
                <td>${entry.id}</td>
                <td>${entry.licence}</td>
                <td>${entry.productKey}</td>
                <td>${entry.expiration}</td>
                <td>${entry.email}</td>
                <td>${entry.name}</td>
                <td>${entry.manufacturer}</td>
                <td>${entry.totalSeats}</td>
                <td>${entry.availableSeats}</td>
                <td>${entry.inventoryQty}</td>
                <td><button onclick="deleteEntry(${index})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    
    updatePaginationInfo(data.length);
}

function deleteEntry(index) {
    let data = JSON.parse(localStorage.getItem("licenseData"));
    data.splice(index, 1);
    localStorage.setItem("licenseData", JSON.stringify(data));
    loadEntries();
}

function filterBySelectedRange() {
    let range = document.getElementById("selectedRange").value;
    if (!range) {
        document.querySelectorAll("#tableBody tr").forEach(row => row.style.display = "");
        return;
    }
    let [min, max] = range.split("-").map(Number);
    document.querySelectorAll("#tableBody tr").forEach(row => {
        let id = parseInt(row.cells[1].textContent);
        row.style.display = id >= min && id <= max ? "" : "none";
    });
}

function refreshEntries() {
    loadEntries();
}

function updatePaginationInfo(totalEntries) {
    let start = (currentPage - 1) * entriesPerPage + 1;
    let end = Math.min(currentPage * entriesPerPage, totalEntries);

    if (totalEntries === 0) {
        start = 0;
        end = 0;
    }

    document.getElementById("entriesCount").textContent = `Showing ${start}-${end} of ${totalEntries} licenses`;
    document.getElementById("pageNumber").textContent = `Page ${currentPage}`;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = end >= totalEntries;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadEntries();
    }
}

function nextPage() {
    let totalEntries = JSON.parse(localStorage.getItem("licenseData"))?.length || 0;
    if (currentPage * entriesPerPage < totalEntries) {
        currentPage++;
        loadEntries();
    }
}
