createdb = () => {
    const db = new localStorageDB("covid19", localStorage);
    if (db.isNew()) {
        db.createTable("countries", ["country", "countrycode", "slug", "newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        db.createTable("globalstat", ["newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        db.createTable("todate", ["utilisation", "date"]);
        db.createTable("selectcountry", ["country", "active", "confirmed", "deaths", "recovered", "date"]);
        db.commit();
        selectSum() // Si la BD est créée pour la première fois, ajoute les données du sommaire

        console.log("BD créée")
    } else {
        console.log("BD existe déjà")
    }
}

useAPI = () => {
    const db = new localStorageDB("covid19", localStorage);
    if (db.rowCount("todate") === 0) {
        db.insert("todate", {utilisation: 1, date: Date.now()});
    } else {

        db.update("todate", function (row) {
            if (row.utilisation >= 0) {
                return true;
            } else {
                return false;
            }
        }, function (row) {
            row.utilisation++;
            row.date = Date.now();
            return row
        })
    }
    db.commit();
    return db.queryAll('todate');
}
checkAPI = () => {
    const db = new localStorageDB("covid19", localStorage);
    let value = db.queryAll('todate')[0];

    if (value === undefined) {
        let t = useAPI();
        checkAPI();
    } else {
        return value;
    }
    return false;
}
resetAPI = () => {
    const db = new localStorageDB("covid19", localStorage);
    db.deleteRows("todate");
    db.commit();
}
dateDiff = (date1, date2) => {
    let diff = {}                           // Initialisation du retour
    let tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
}
selectSum = () => {

    const db = new localStorageDB("covid19", localStorage);
    let bool;
    let now = Date.now();
    let api = checkAPI();
    if (api !== false) {

        let lasttime = db.queryAll('todate');

        let diff = dateDiff(lasttime[0].date, now);
        if (api.utilisation < 5) {
            useAPI();
            bool = true
        } else {
            if (diff.min > 10) {
                resetAPI();
                bool = true;
            } else {
                bool = false;

            }
        }
    }
    if (bool === true) {
        let settings = {
            async: false,
            "url": "https://api.covid19api.com/summary",
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            let data = response;
            if (data !== undefined) {
                db.deleteRows("countries");
                db.deleteRows("globalstat");
                data.Countries.forEach(element => {
                    db.insert("countries", {
                        country: element.Country,
                        countrycode: element.CountryCode,
                        slug: element.Slug,
                        newconfirmed: element.NewConfirmed,
                        totalconfirmed: element.TotalConfirmed,
                        newdeaths: element.NewDeaths,
                        totaldeaths: element.TotalDeaths,
                    newrecovered: element.NewRecovered,
                    totalrecovered: element.TotalRecovered,
                        date: element.Date.slice(0, 10)
                });
                db.commit();
            });

            db.insert("globalstat", {
                newconfirmed: data.Global.NewConfirmed,
                totalconfirmed: data.Global.TotalConfirmed,
                newdeaths: data.Global.NewDeaths,
                totaldeaths: data.Global.TotalDeaths,
                newrecovered: data.Global.NewRecovered,
                totalrecovered: data.Global.TotalRecovered,
                date: data.Global.Date.slice(0, 10)

            });
            db.commit();

            }
        })
        bool = false;
    }
    let globalstat;
    let countries;

    if (bool === false) {
        countries = db.queryAll('countries');
        globalstat = db.queryAll('globalstat');

    }

    let data = {
        "countries": countries,
        "globalstat": globalstat
    };
    return data;
}

getInfoCountries = (namecountry) => {
    const db = new localStorageDB("covid19", localStorage);
    if (namecountry === "") {
        namecountry = "undefined"
    }
    let bool;
    let now = Date.now();
    let api = checkAPI();
    if (api !== false) {
        let lasttime = db.queryAll('todate');

        let diff = dateDiff(lasttime[0].date, now);

        if (api.utilisation < 4) {
            useAPI();
            bool = true
        } else {
            if (diff.min > 10) {
                resetAPI();
                bool = true;
            } else {
                bool = false;

            }
        }
        if (bool) {
            const settings = {
                "url": "https://api.covid19api.com/total/country/" + namecountry,
                "method": "GET",
                "timeout": 0,
                "async": false
            };
            $.ajax(settings).done(function (response) {
                let data = response;
                db.deleteRows("selectcountry");

                data.forEach(element => {
                    db.insert("selectcountry", {
                        country: element.Country,
                        confirmed: element.Confirmed,
                        deaths: element.Deaths,
                        recovered: element.Recovered,
                        active: element.Active,
                        date: (element.Date).slice(0, 10)
                    });
                    db.commit();
                })
            })
        }
    }

}

getCountryNameFromCountryCode = (code) => {
    const db = new localStorageDB("covid19", localStorage);
    let countryName = '';
    let countries = db.queryAll("countries");

    for (let i = 0; i < countries.length; i++) {
        country = countries[i];
        if (country.countrycode === code) {
            countryName = country.country;
            break;
        }
    }
    return countryName;
}

selectcountries = (namecountry) => {

    getInfoCountries(namecountry);

    const db = new localStorageDB("covid19", localStorage);
    let datacountry = {};
    if (namecountry === "") {
        namecountry = "undefined"
    }
    datacountry = db.queryAll('selectcountry', {
        query: {country: namecountry}
    });

    return datacountry
}

selectTypes = () => {
    const db = new localStorageDB("covid19", localStorage);
    let types = db.queryAll("type");
    return types;
}

selectCountriesName = () => {
    const db = new localStorageDB("covid19", localStorage);
    let query = db.queryAll("countries");
    let countries = [];
    for (let i = 0; i < query.length; i++) {
        countries.push(query[i].country);
    }
    return countries;

}