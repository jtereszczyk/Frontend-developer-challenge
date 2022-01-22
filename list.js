const companiesList = {
  init: () => {
    const table = sessionStorage.getItem("table");
    if (table) {
      companiesList.sortEvents();
      companiesList.sortList(table);
    } else {
      companiesList.fetchData();
    }
  },

  fetchData: async () => {
    try {
      const response = await fetch(
        "https://dujour.squiz.cloud/developer-challenge/data",
        {
          method: "GET",
        }
      );
      const dataJson = await response.json();
      const data = JSON.stringify(dataJson);
      sessionStorage.setItem("table", data);
      companiesList.sortList(data);
    } catch (error) {
      console.error(error);
      return false;
    }
    companiesList.sortEvents();
  },

  createCompaniesList: (dataJson) => {
    const companies = dataJson;
    let industryArray = [];
    let countryArray = [];
    let companiesListHTML = `<li class="list-headline"><span>Name</span><span>Country</span><span>Industry</span><span>No. of employees</span></li>`;
    companies.forEach((company) => {
      const name = company.name;
      const country = company.country;
      const industry = company.industry;
      const numberOfEmployees = company.numberOfEmployees;

      companiesListHTML += `<li class="list-item" data-country="ctry_${country}" data-industry="ind_${industry}">
        <span class="name">${name}</span>
        <span class="country">${country}</span>
        <span class="industry">${industry}</span>
        <span class="numberOfEmployees">${numberOfEmployees}</span>
      </li>
      `;

      if (!document.querySelectorAll("#filters input").length) {
        if (industryArray.indexOf(industry) < 0) industryArray.push(industry);
        if (countryArray.indexOf(country) < 0) countryArray.push(country);
      }
    });
    if (!document.querySelectorAll("#filters input").length) {
      companiesList.createFilters(industryArray, countryArray);
    }

    document.querySelectorAll("#list ul")[0].innerHTML = companiesListHTML;

    if (companiesList.filterArray.length) {
      companiesList.filterSet(companiesList.filterArray);
    }
  },

  sortEvents: () => {
    const button = document.querySelector("button.dropdown__btn");
    const dropdown = document.querySelector("ul.dropdown__list");

    function toggleButton() {
      this.querySelector(".chevron").classList.toggle("active");
      this.classList.toggle("expanded");
    }
    function toggleDropdown(event) {
      if (
        event.target != dropdown &&
        event.target.parentNode != dropdown &&
        event.target != button
      ) {
        document.querySelector(".chevron").classList.remove("active");
        document
          .querySelector("button.dropdown__btn")
          .classList.remove("expanded");
      }
    }
    button.addEventListener("click", toggleButton);
    window.addEventListener("mouseup", toggleDropdown);

    document.querySelectorAll(".dropdown__list a").forEach((element) => {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        const attr = this.getAttribute("href");
        companiesList.sortList(sessionStorage.getItem("table"), attr);
      });
    });
  },

  sortList: (dataJson, type) => {
    sort = JSON.parse(dataJson);
    switch (type) {
      case "nameDesc":
        const nameDesc = sort.sort((a, b) => (a.name < b.name ? 1 : -1));
        companiesList.createCompaniesList(nameDesc);
        break;
      case "nameAsc":
        const nameAsc = sort.sort((a, b) => (a.name > b.name ? 1 : -1));
        companiesList.createCompaniesList(nameAsc);
        break;

      case "numberOfEmployeesDesc":
        const numberOfEmployeesDesc = sort.sort(
          (a, b) => b.numberOfEmployees - a.numberOfEmployees
        );
        companiesList.createCompaniesList(numberOfEmployeesDesc);
        break;
      case "numberOfEmployeesAsc":
        const numberOfEmployeesAsc = sort.sort(
          (a, b) => a.numberOfEmployees - b.numberOfEmployees
        );
        companiesList.createCompaniesList(numberOfEmployeesAsc);
        break;
      default:
        companiesList.createCompaniesList(sort);
        break;
    }
  },

  createFilters: (industryArray, countryArray) => {
    let industryForm = "";
    let countryForm = "";
    industryArray.forEach((industry) => {
      const industryCode = industry.replace(/\s/g, "_");
      industryForm += `<label class="filter__option" for="ind_${industryCode}"><input type="checkbox" id="ind_${industryCode}" />${industry}</label>`;
    });
    document.querySelectorAll(
      "#filters #filter-industry .filters__content"
    )[0].innerHTML = industryForm;
    countryArray.forEach((country) => {
      const countryCode = country.replace(/\s/g, "_");
      countryForm += `<label class="filter__option" for="ctry_${countryCode}"><input type="checkbox" id="ctry_${countryCode}" />${country}</label>`;
    });
    document.querySelectorAll(
      "#filters #filter-country .filters__content"
    )[0].innerHTML = countryForm;
    companiesList.filtersEvents();
  },
  filtersEvents: () => {
    document.querySelectorAll("#filters input").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        if (event.currentTarget.checked) {
          companiesList.filterArray.push(event.currentTarget.id);
        } else {
          const index = companiesList.filterArray.indexOf(
            event.currentTarget.id
          );
          if (index > -1) {
            companiesList.filterArray.splice(index, 1);
          }
        }
        companiesList.filterSet(companiesList.filterArray);
      });
    });

    document.querySelectorAll(".filters__name").forEach((element) => {
      element.addEventListener("click", function () {
        this.classList.toggle("expanded");
        this.querySelector(".chevron").classList.toggle("active");
      });
    });
  },
  filterSet: (arr) => {
    document.querySelectorAll("#list .list-item").forEach((item) => {
      if (!arr.length) {
        item.classList.remove("hidden");
        return;
      }
      item.classList.add("hidden");
      const country = item.getAttribute("data-country").replace(/\s/g, "_");
      const industry = item.getAttribute("data-industry").replace(/\s/g, "_");
      if (
        arr.filter(/./.test, /ind_/).length &&
        arr.filter(/./.test, /ctry_/).length
      ) {
        if (arr.includes(country) && arr.includes(industry))
          item.classList.remove("hidden");
      } else {
        if (arr.includes(country) || arr.includes(industry))
          item.classList.remove("hidden");
      }
    });
  },
  filterArray: [],
};
companiesList.init();
