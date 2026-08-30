
fetch("/testnotescsv.csv")

  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split("\n");
    const tableHead = document.querySelector("thead");
    const tableBody = document.querySelector("tbody");
    const yearSelect = document.getElementById("year");
    const gradeSelect = document.getElementById("grade");
    const typeSelect = document.getElementById("type");
    const subjectInput = document.getElementById("subject");

    // headers
    const headers = rows[0].split(",");
    const headerRow = document.createElement("tr");

    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow);


    // data rows
    document.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", () => {
        tableBody.innerHTML = "";

        rows.slice(1).forEach(row => {
          const tr = document.createElement("tr");
          const cells = row.split(",").map(cell => cell.trim());
          let hasYear = false;
          let hasGrade = false;
          let hasType = false;
          let matchesSubject = false;

          cells.forEach((cell, index) => {
            const td = document.createElement("td");
            if (index === 0) {
              const a = document.createElement("a");
              a.textContent = cell.slice(6, -4);
              a.href = `${cell}`;
              a.target = "blank";
              a.rel = "noopener noreferrer";
              td.appendChild(a);
            } else {
              td.textContent = cell;
              if (cell === yearSelect.value) hasYear = true;
              if (cell === gradeSelect.value) hasGrade = true;
              if (cell === typeSelect.value) hasType = true;
              if (index === 3 && cell.toLowerCase().includes(subjectInput.value.toLowerCase())) matchesSubject = true;
            }
            tr.appendChild(td);
          });

          if (!(hasYear || yearSelect.value === "")) return;
          if (!(hasGrade || gradeSelect.value === "")) return;
          if (!(hasType || typeSelect.value === "")) return;
          if (!(matchesSubject || subjectInput.value === "")) return

          tableBody.appendChild(tr);
        });
      });
    });
    
    document.querySelector("select").dispatchEvent(new Event("change"));
    subjectInput.addEventListener("input", () => {
      document.querySelector("select").dispatchEvent(new Event("change"));
    });
  });
