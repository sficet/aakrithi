console.log("hello");

const sheetURL = "https://docs.google.com/spreadsheets/d/1Hb1h3cWQaV8gE7KnKhhtjfcGnvD2RinZNZNXUk79Hr0/gviz/tq?tqx=out:csv&sheet=Sheet1";

let data = [];

function loadCSV(url, callback) {
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
      callback();
    },
    error: function(err) {
      console.error("CSV Parse Error:", err);
    }
  });
}

loadCSV(sheetURL, function() {
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
    console.log(data);
    displayRows(data);
});

function displayRows(data){
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = ""; // Clear existing rows
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
        pos = ''
        icon=``;
    }
    
    row.innerHTML = `
      <th scope="row" class="${pos}">${index + 1}</th>
      <td class="${pos} details"><div>${dept.DEPT}</div><div class="icon-div">${icon}</div></td>
      <td class="${pos}">${dept.total_points}</td>
    `;
    tableBody.appendChild(row);
    index++;
  });
}