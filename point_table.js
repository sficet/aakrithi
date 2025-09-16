console.log("hai");

const sheetURL = "https://docs.google.com/spreadsheets/d/1Hb1h3cWQaV8gE7KnKhhtjfcGnvD2RinZNZNXUk79Hr0/gviz/tq?tqx=out:csv&sheet=Sheet1";

// Escape HTML special characters
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

function loadCSV(url, callback) {
  let data = [];
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    preview: 0,
    complete: function(results) {
      data = results.data.map(row =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k.trim(), v.trim()])
        )
      );

      callback(data);
    },
    error: function(err) {
      console.error("CSV Parse Error:", err);
    }
  });
}

function sort_data (data) {
  data.forEach((dept)=>{
    let total_points = 0;
    for(let key in dept){
        if(!isNaN(parseFloat(dept[key])) && isFinite(dept[key])){
            total_points += parseFloat(dept[key]);
        }
    }
    dept.total_points = total_points;
  })
  data.sort((a,b)=>b.total_points - a.total_points);
  displayRows(data);
}

loadCSV(sheetURL, sort_data);

function displayRows(data){
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = ""; 
  let total_sum = 0;
  let index = 0;
  data.forEach((dept) => {
    const row = document.createElement("tr");
    if(dept.total_points == total_sum){
        index--;
    }
    else{
        total_sum = dept.total_points;
    }

    let icon = "";
    let pos = "";

    if(index == 0){
        row.classList.add("my-first");
        icon = `<i class="fa-solid fa-crown fa-bounce" style="color: #f95b06;"></i><i class="fa-solid fa-crown fa-bounce" style="color: #f95b06;"></i><i class="fa-solid fa-crown fa-bounce" style="color: #f95b06;"></i>`;
        pos = 'first-place'
    }
    else if(index == 1){
        row.classList.add("my-second");
        icon = `<i class="fa-solid fa-crown fa-beat-fade" style="color: #5c5c5c;"></i><i class="fa-solid fa-crown fa-beat-fade" style="color: #5c5c5c;"></i>`;
        pos = 'second-place'
    }
    else{
        pos = '';
        icon = '';
    }

    const th = document.createElement("th");
    th.scope = "row";
    th.className = pos;
    th.textContent = escapeHTML((index + 1).toString());

    const tdDept = document.createElement("td");
    tdDept.className = pos + " details";

    const divDept = document.createElement("div");
    divDept.textContent = escapeHTML(dept.DEPT);

    const divIcon = document.createElement("div");
    divIcon.className = "icon-div";
    divIcon.innerHTML = icon; // trusted hardcoded icons

    tdDept.appendChild(divDept);
    tdDept.appendChild(divIcon);

    const tdPoints = document.createElement("td");
    tdPoints.className = pos;
    tdPoints.textContent = escapeHTML(dept.total_points.toString());

    row.appendChild(th);
    row.appendChild(tdDept);
    row.appendChild(tdPoints);

    tableBody.appendChild(row);
    index++;
  });
}
